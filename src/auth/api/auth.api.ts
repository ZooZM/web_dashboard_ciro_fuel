import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { LoginInput, LoginResponse, AuthUserDto } from '@/auth/types';

export async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(apiRoutes.auth.login, input);
  return data;
}

// Refresh itself is NOT exposed here — api.client.ts's `runRefresh` calls the bare client
// directly, since it must own the refresh-token body and the single-flight promise together
// (T010). A second implementation here would be a second place to keep the two in sync.

export async function me(): Promise<AuthUserDto> {
  const { data } = await apiClient.get<AuthUserDto>(apiRoutes.auth.me);
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post(apiRoutes.auth.logout);
}
