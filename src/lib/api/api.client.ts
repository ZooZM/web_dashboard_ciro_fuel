import axios, { type AxiosRequestConfig } from 'axios';
import { tokenStore } from '@/lib/auth/token-store';
import { apiRoutes } from '@/constants/api-routes';
import { toApiError, type BackendErrorEnvelope } from './api-error';
import type { RefreshResponse } from '@/auth/types';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'ngrok-skip-browser-warning': 'true' },
  // NOTE: the platform issues no auth cookie — the refresh token travels in the request
  // body (see runRefresh() below, feature 013 T024). `withCredentials` is harmless but
  // does nothing for auth today; left on rather than removed, since some other same-site
  // request on this client may still depend on ordinary cookie behaviour.
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Invoked when a request cannot be authenticated even after a refresh attempt, or when
 * refresh itself fails (FR-009). Wired by features/auth's bootstrap/session wiring to
 * clear the session store and redirect to /login — kept as an external hook here so this
 * module has no dependency on the Zustand session store (avoids a circular import).
 */
let onSessionExpiredHandler: () => void = () => {
  // no-op until wired by features/auth
};

export function setOnSessionExpired(handler: () => void): void {
  onSessionExpiredHandler = handler;
}

// Bare client (no interceptors) used for the refresh call itself, so refresh can never
// recurse through this same 401-handling logic.
const bareClient = axios.create({
  baseURL: apiClient.defaults.baseURL,
  withCredentials: true,
});

// Single-flight: concurrent 401s share exactly ONE /auth/refresh call (FR-008, SC-004).
let refreshPromise: Promise<string> | null = null;

async function runRefresh(): Promise<string> {
  // Feature 013 T024: the platform's `POST /auth/refresh` reads the refresh token from
  // the request BODY (`RefreshTokenDto`), not an httpOnly cookie — `withCredentials` on
  // `bareClient` sends a cookie the platform never issues, so this call had never carried
  // a real credential and every refresh attempt failed. With none stored (never logged in
  // through this fixed flow yet), fail fast rather than send an empty body.
  const currentRefreshToken = tokenStore.getRefreshToken();
  if (!currentRefreshToken) {
    throw new Error('No refresh token available');
  }
  const { data } = await bareClient.post<RefreshResponse>(apiRoutes.auth.refresh, {
    refreshToken: currentRefreshToken,
  });
  tokenStore.set(data.accessToken);
  // The backend mints a fresh refresh token on every call (`AuthService.issueTokenPair`) —
  // capturing it keeps the session refreshable for its full sliding window rather than
  // only until the ORIGINAL refresh token from login expires.
  tokenStore.setRefreshToken(data.refreshToken);
  return data.accessToken;
}

export function refreshAccessToken(): Promise<string> {
  refreshPromise ??= runRefresh().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

interface RetryableConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const axiosError = error as {
      config?: RetryableConfig;
      response?: { status?: number; data?: BackendErrorEnvelope };
    };
    const status = axiosError.response?.status;
    const original = axiosError.config;

    // Feature 013 T026: a SESSION_REVOKED 401 (spec 006) means the platform has already
    // decided this session is over — for a reason a fresh access token cannot undo
    // (account deactivated, company suspended, signed in elsewhere, password reset).
    // Retrying it through a refresh was always futile and, worse, DISCARDED the specific
    // `cause` this response carries: `runRefresh()` calls the platform's generic
    // login/refresh path (`AuthService.refresh` → `validateActiveSession`), which never
    // reveals a cause at all, so `onSessionExpiredHandler()` fired with a bare "session
    // expired" every time regardless of the real reason. Go straight to the handler with
    // THIS response's own error preserved instead.
    if (axiosError.response?.data?.error === 'SESSION_REVOKED') {
      onSessionExpiredHandler();
      return Promise.reject(toApiError(error));
    }

    // 403/404 are access-boundary responses, never an auth failure — no refresh (FR-010).
    if (status !== 401 || !original || original._retry) {
      return Promise.reject(toApiError(error));
    }

    original._retry = true;
    try {
      const newToken = await refreshAccessToken();
      original.headers = { ...original.headers, Authorization: `Bearer ${newToken}` };
      return apiClient(original);
    } catch (refreshError) {
      onSessionExpiredHandler();
      return Promise.reject(toApiError(refreshError));
    }
  },
);
