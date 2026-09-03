// `erasableSyntaxOnly` forbids runtime `enum` — this object+type pattern gives the same
// call-site syntax while remaining fully erasable.
//
// Mirrors the platform's `src/common/enums/session-revocation-cause.enum.ts` exactly
// (FR-097) — carried on a `SESSION_REVOKED` error's `cause` field so the app can state
// the specific reason a session ended, never inferred from message text (Principle I/III).
export const SessionRevocationCause = {
  SIGNED_IN_ELSEWHERE: 'SIGNED_IN_ELSEWHERE',
  PASSWORD_RESET: 'PASSWORD_RESET',
  ACCOUNT_DEACTIVATED: 'ACCOUNT_DEACTIVATED',
  // Feature 013 FR-090/Edge Cases: revealed only to a caller that already holds a live
  // session (never at login — see the platform enum's own comment for why).
  COMPANY_SUSPENDED: 'COMPANY_SUSPENDED',
} as const;

export type SessionRevocationCause =
  (typeof SessionRevocationCause)[keyof typeof SessionRevocationCause];
