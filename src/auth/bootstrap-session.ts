import { setOnSessionExpired } from '@/lib/api/api.client';
import { me } from '@/auth/api/auth.api';
import { useSessionStore } from '@/stores/session.store';
import { isDashboardRole } from '@/constants/roles';
import { logout as logoutRequest } from '@/auth/api/auth.api';
import { tokenStore } from '@/lib/auth/token-store';

/**
 * Feature 009 Slice 0 (T007): the demonstration bypass this function used to contain —
 *
 *   if (accessToken === 'dummy-token' && existingUser) { setSession(existingUser, accessToken); return; }
 *
 * — admitted a session fabricated by the deleted RoleSelectionPage for ANY role, with no
 * platform involved at all. It is removed, not adjusted: every session now originates from a
 * real `/auth/login` or, here, a real `/auth/me` lookup.
 *
 * Because both tokens are now held in memory only (FR-078, research.md R2), neither survives a
 * page reload — there is no httpOnly refresh cookie in this feature (plan.md Complexity
 * Tracking), so a hard reload always starts from zero and this call is expected to end in
 * `clearSession()` on one. What it still does: resolve an in-SPA-memory access token against
 * `/auth/me` (e.g. after a client-side navigation that re-invoked this), and reject a
 * CLIENT/DRIVER token outright — this surface is admin-only (FR-068).
 */
export async function bootstrapSession(): Promise<void> {
  const { setSession, clearSession, setStatus } = useSessionStore.getState();
  setStatus('booting');

  try {
    const accessToken = tokenStore.get();
    if (!accessToken) {
      clearSession();
      return;
    }

    const user = await me();

    if (!isDashboardRole(user.role)) {
      clearSession();
      return;
    }

    setSession(user, accessToken);
  } catch {
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
