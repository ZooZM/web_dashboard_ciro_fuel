import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { LoginInput, LoginResponse, AuthUserDto } from '@/auth/types';

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
