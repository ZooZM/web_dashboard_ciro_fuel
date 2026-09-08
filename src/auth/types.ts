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

// ── spec 015 (dashboard auth) — passwordless administrator sign-in ──────────

/** A solved proof-of-work challenge, attached to a code re-request (FR-023). */
export interface LoginChallengeSolution {
  seed: string;
  nonce: string;
}

export interface RequestLoginCodeInput {
  /** E.164 — the screen displays `05…` but must send `+9665…`. */
  phone: string;
  challenge?: LoginChallengeSolution;
}

export interface RequestLoginCodeResponse {
  expiresInMinutes: number;
  attemptsAllowed: number;
}

export interface VerifyLoginCodeInput {
  phone: string;
  /** Exactly 6 digits (FR-012 / FR-043). */
  code: string;
}

/** The `400 CHALLENGE_REQUIRED` body — the client solves and resubmits (FR-023). */
export interface ChallengeRequiredBody {
  error: 'CHALLENGE_REQUIRED';
  challenge: { seed: string; difficultyBits: number };
  message: string;
}

// ── spec 015 US7 — SMS password recovery ───────────────────────────────────

export interface PasswordResetRequestInput {
  phone: string;
}
export interface PasswordResetVerifyInput {
  phone: string;
  code: string;
}
export interface PasswordResetVerifyResponse {
  resetToken: string;
}
export interface PasswordResetCompleteInput {
  resetToken: string;
  newPassword: string;
}
