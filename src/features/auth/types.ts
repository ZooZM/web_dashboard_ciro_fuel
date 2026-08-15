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
  user: AuthUserDto;
}

export interface RefreshResponse {
  accessToken: string;
}
