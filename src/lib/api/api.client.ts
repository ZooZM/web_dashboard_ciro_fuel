import axios, { type AxiosRequestConfig } from 'axios';
import { tokenStore } from '@/lib/auth/token-store';
import { apiRoutes } from '@/constants/api-routes';
import { toApiError } from './api-error';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // Sends the httpOnly refresh-token cookie automatically (FR-011a).
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
  const { data } = await bareClient.post<{ accessToken: string }>(apiRoutes.auth.refresh);
  tokenStore.set(data.accessToken);
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
    const axiosError = error as { config?: RetryableConfig; response?: { status?: number } };
    const status = axiosError.response?.status;
    const original = axiosError.config;

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
