import type { Role } from '@/constants/roles';

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUserDto {
  id: string;
  role: Role;
  companyId: string | null;
  fullName: string;
  email: string;
}

export interface LoginResponse {
  accessToken: string;
  // Feature 013 T024: the platform's login response always carries this
  // (backend `TokenPair`) — it had simply never been read here, which is
  // why body-based `/auth/refresh` had never actually worked.
  refreshToken: string;
  user: AuthUserDto;
}

export interface RefreshResponse {
  accessToken: string;
  // Feature 013 T024: the backend mints a fresh refresh token on every
  // `/auth/refresh` call (`AuthService.issueTokenPair`) — capturing it keeps
  // the session refreshable for its full sliding window rather than only
  // until the ORIGINAL refresh token from login expires.
  refreshToken: string;
}
