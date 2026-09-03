import toast from 'react-hot-toast';
import { setOnSessionExpired } from '@/lib/api/api.client';
import { me } from '@/auth/api/auth.api';
import { useSessionStore } from '@/stores/session.store';
import { isDashboardRole } from '@/constants/roles';
import { logout as logoutRequest } from '@/auth/api/auth.api';
import { tokenStore } from '@/lib/auth/token-store';
import { ApiError } from '@/lib/api/api-error';
import { SessionRevocationCause } from '@/constants/session';

// Feature 013 FR-090/Edge Cases: "refused, with the reason stated rather than an empty
// dashboard" — SIGNED_IN_ELSEWHERE/PASSWORD_RESET already have a live-session precedent
// (spec 006); COMPANY_SUSPENDED is this feature's addition. Deliberately not shown for
// every cause — SIGNED_IN_ELSEWHERE and PASSWORD_RESET are the user's OWN action
// elsewhere and need no explanation on this device; a silent, unexplained sign-out for
// those would be confusing where a stated one is not.
const REVOCATION_MESSAGES: Partial<Record<SessionRevocationCause, string>> = {
  [SessionRevocationCause.COMPANY_SUSPENDED]:
    'تم تعليق حساب الشركة. يرجى التواصل مع إدارة المنصة.',
  [SessionRevocationCause.ACCOUNT_DEACTIVATED]: 'تم إلغاء تفعيل هذا الحساب.',
};

/**
 * Silent refresh on app load (FR-011): the stored refresh token (feature 013 T024 — the
 * platform reads it from the request body, not a cookie) restores the access token without
 * a visible re-login. A CLIENT/DRIVER token is rejected — this surface is admin-only (FR-001).
 */
export async function bootstrapSession(): Promise<void> {
  const { setSession, clearSession, setStatus } = useSessionStore.getState();
  setStatus('booting');

  try {
    const accessToken = tokenStore.get();

    // Rely on the existing token. If it's expired or missing, the interceptor
    // will catch the 401 and attempt a refresh automatically.
    const user = await me();

    if (!isDashboardRole(user.role) || !accessToken) {
      clearSession();
      return;
    }

    setSession(user, accessToken);
  } catch (error) {
    // FR-090/Edge Cases: state the specific reason when the platform gave one (e.g. a
    // suspended company), rather than silently landing on the sign-in screen.
    if (error instanceof ApiError && error.cause) {
      const message = REVOCATION_MESSAGES[error.cause as SessionRevocationCause];
      if (message) {
        toast.error(message);
      }
    }
    clearSession();
  }
}

export function wireSessionExpiry(): void {
  setOnSessionExpired(() => {
    useSessionStore.getState().clearSession();
  });
}

export async function performLogout(): Promise<void> {
  try {
    await logoutRequest();
  } finally {
    useSessionStore.getState().clearSession();
  }
}
