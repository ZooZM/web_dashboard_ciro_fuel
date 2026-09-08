import { useMutation } from '@tanstack/react-query';
import { requestLoginCode, verifyLoginCode } from '@/auth/api/auth.api';
import { useSessionLanding } from '@/auth/hooks/useSessionLanding';
import { solveChallenge } from '@/lib/auth/proof-of-work';
import { ApiError } from '@/lib/api/api-error';
import type { RequestLoginCodeResponse } from '@/auth/types';

/**
 * spec 015 US2/US3 — request a sign-in code, transparently solving a
 * `CHALLENGE_REQUIRED` proof-of-work if the platform demands one. The user is
 * never asked to do anything (FR-023). A `429 LOGIN_RATE_LIMITED` surfaces as
 * an {@link ApiError} carrying the platform's own `retryAfterSeconds` (FR-047).
 */
async function requestCodeSolvingChallenge(phone: string): Promise<RequestLoginCodeResponse> {
  try {
    return await requestLoginCode({ phone });
  } catch (err) {
    if (err instanceof ApiError && err.error === 'CHALLENGE_REQUIRED' && err.challenge) {
      const challenge = await solveChallenge(err.challenge);
      return requestLoginCode({ phone, challenge });
    }
    throw err;
  }
}

export function useRequestLoginCode() {
  return useMutation({
    mutationFn: (phone: string) => requestCodeSolvingChallenge(phone),
  });
}

export function useVerifyLoginCode() {
  const land = useSessionLanding();
  return useMutation({
    mutationFn: (input: { phone: string; code: string; remember?: boolean }) =>
      verifyLoginCode({ phone: input.phone, code: input.code }),
    onSuccess: (data, vars) => land(data, vars.remember),
  });
}
