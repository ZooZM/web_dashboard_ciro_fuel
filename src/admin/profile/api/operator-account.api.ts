import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';

/**
 * spec 017 (operator dashboard) T124/US7 — the operator's own account.
 *
 * A separate route from `GET /auth/me`, which both Flutter clients call and
 * which FR-075 freezes. **Carries no permission list and no account statistic**
 * (FR-063): the platform has no permission model beyond `UserRole` and records
 * no per-account statistic, so neither is fabricated — and the cards that
 * rendered them are deleted rather than left empty.
 */
export interface OperatorAccount {
  fullName: string;
  email: string;
  /** The REAL sign-in identifier, never masked (FR-057). */
  phone: string;
  activeSessionCount: number;
  /** `null` means genuinely never signed in, distinct from "not recorded". */
  lastSignInAt: string | null;
}

export async function getOperatorAccount(): Promise<OperatorAccount> {
  const { data } = await apiClient.get<OperatorAccount>(apiRoutes.auth.meAccount);
  return data;
}

/**
 * FR-060/FR-061 — the phone-change flow, unchanged platform routes.
 *
 * The refusal an operator meets at the FIRST step is the one worth naming:
 * `PHONE_IN_USE` now fires before any SMS is spent, for an administrator's
 * number as well as a client's. Until this feature the pre-check could not see
 * administrator accounts at all, so changing onto another administrator's
 * number sent a message and failed only at confirm (research R10).
 */
export async function requestPhoneChange(newPhone: string): Promise<{
  expiresAt: string;
  attemptsRemaining: number;
}> {
  const { data } = await apiClient.post<{ expiresAt: string; attemptsRemaining: number }>(
    apiRoutes.users.phoneVerificationRequest,
    { newPhone },
  );
  return data;
}

export async function confirmPhoneChange(code: string): Promise<{ phone: string }> {
  const { data } = await apiClient.post<{ phone: string }>(
    apiRoutes.users.phoneVerificationConfirm,
    { code },
  );
  return data;
}
