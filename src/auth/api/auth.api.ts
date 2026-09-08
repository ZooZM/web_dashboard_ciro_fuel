import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type {
  LoginInput,
  LoginResponse,
  AuthUserDto,
  RequestLoginCodeInput,
  RequestLoginCodeResponse,
  VerifyLoginCodeInput,
  PasswordResetRequestInput,
  PasswordResetVerifyInput,
  PasswordResetVerifyResponse,
  PasswordResetCompleteInput,
} from '@/auth/types';

export async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(apiRoutes.auth.login, input);
  return data;
}

// Feature 013 FR-007 ("exactly one session store and platform-access layer"): a second,
// dead `refresh()` export used to live here — zero consumers, superseded by
// api.client.ts's own `runRefresh()`/`refreshAccessToken()` (the one the response
// interceptor actually calls), and it never sent the refresh token at all. Removed
// rather than fixed in place, to avoid exactly the duplicate-refresh-path shape this
// feature is closing everywhere else.

export async function me(): Promise<AuthUserDto> {
  const { data } = await apiClient.get<AuthUserDto>(apiRoutes.auth.me);
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post(apiRoutes.auth.logout);
}

// ── spec 015 (dashboard auth) — passwordless administrator sign-in ──────────

/**
 * FR-015 — this 202 is identical for every outcome. A `400 CHALLENGE_REQUIRED`
 * or `429 LOGIN_RATE_LIMITED` surfaces as an {@link ApiError} the caller
 * inspects; the neutral 202 is the only success path.
 */
export async function requestLoginCode(
  input: RequestLoginCodeInput,
): Promise<RequestLoginCodeResponse> {
  const { data } = await apiClient.post<RequestLoginCodeResponse>(
    apiRoutes.auth.loginCodeRequest,
    input,
  );
  return data;
}

/** Response shape is byte-identical to {@link login} (FR-016); tokens carry `sid`. */
export async function verifyLoginCode(input: VerifyLoginCodeInput): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(apiRoutes.auth.loginCodeVerify, input);
  return data;
}

// ── spec 015 US7 — SMS password recovery (existing platform endpoints) ──────

export async function requestPasswordReset(input: PasswordResetRequestInput): Promise<void> {
  await apiClient.post(apiRoutes.auth.passwordResetRequest, input);
}

export async function verifyPasswordResetCode(
  input: PasswordResetVerifyInput,
): Promise<PasswordResetVerifyResponse> {
  const { data } = await apiClient.post<PasswordResetVerifyResponse>(
    apiRoutes.auth.passwordResetVerify,
    input,
  );
  return data;
}

export async function completePasswordReset(input: PasswordResetCompleteInput): Promise<void> {
  await apiClient.post(apiRoutes.auth.passwordResetComplete, input);
}
