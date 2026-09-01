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
  // Feature 009 T010a: the platform has always returned this (`AuthService.login` -> `TokenPair`
  // & user); the dashboard never captured it, which is what made the request-body refresh
  // contract (T010) impossible to implement — there was no token to send.
  refreshToken: string;
  user: AuthUserDto;
}

export interface RefreshResponse {
  accessToken: string;
  // The platform rotates the refresh token on every refresh (`AuthService.refresh` calls
  // `issueTokenPair` again) — the previous one must be replaced, not reused, or the next
  // refresh sends a token the platform already considers superseded.
  refreshToken: string;
}
