import { setOnSessionExpired } from '@/lib/api/api.client';
import { me } from '@/auth/api/auth.api';
import { useSessionStore } from '@/stores/session.store';
import { isDashboardRole } from '@/constants/roles';
import { logout as logoutRequest } from '@/auth/api/auth.api';
import { tokenStore } from '@/lib/auth/token-store';

/**
 * Silent refresh on app load (FR-011): the httpOnly refresh cookie (if any) restores the
 * access token without a visible re-login. A CLIENT/DRIVER token is rejected — this surface
 * is admin-only (FR-001).
 */
export async function bootstrapSession(): Promise<void> {
  const { setSession, clearSession, setStatus, user: existingUser } = useSessionStore.getState();
  setStatus('booting');

  try {
    const accessToken = tokenStore.get();

    // Bypass for Demo/Mock mode
    if (accessToken === 'dummy-token' && existingUser) {
      setSession(existingUser, accessToken);
      return;
    }

    // Rely on the existing token. If it's expired or missing, the interceptor 
    // will catch the 401 and attempt a refresh automatically.
    const user = await me();

    if (!isDashboardRole(user.role) || !accessToken) {
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
