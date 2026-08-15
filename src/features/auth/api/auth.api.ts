import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { LoginInput, LoginResponse, RefreshResponse, AuthUserDto } from '@/features/auth/types';

export async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(apiRoutes.auth.login, input);
  return data;
}

/** Uses a bare axios call (not `apiClient`) so it never recurses through the response
 *  interceptor's own refresh logic — see api.client.ts single-flight refresh (FR-008). */
export async function refresh(bareClient = apiClient): Promise<RefreshResponse> {
  const { data } = await bareClient.post<RefreshResponse>(apiRoutes.auth.refresh);
  return data;
}

export async function me(): Promise<AuthUserDto> {
  const { data } = await apiClient.get<AuthUserDto>(apiRoutes.auth.me);
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post(apiRoutes.auth.logout);
}
