import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSessionStore } from '@/stores/session.store';
import { Role, isDashboardRole } from '@/constants/roles';
import type { LoginResponse } from '@/auth/types';

interface LocationState {
  from?: { pathname: string };
}

// FR-001/FR-002: each dashboard role's own landing screen. Feature 013 R1 found this had
// NO case for FUEL_COMPANY_ADMIN — every fuel company admin fell into a catch-all `else`
// that sent them to `/transport`. Named per-role, so a role added later fails to compile
// here instead of silently landing on someone else's dashboard (Principle I).
const DASHBOARD_HOME: Record<(typeof Role)[keyof typeof Role] & string, string> = {
  [Role.SUPER_ADMIN]: '/admin',
  [Role.FUEL_COMPANY_ADMIN]: '/petrolCompany',
  [Role.TRANSPORT_COMPANY_ADMIN]: '/transport',
  [Role.CLIENT]: '/',
  [Role.DRIVER]: '/',
};

/**
 * spec 015 T063 — the shared "a credential was just issued, now establish the session and
 * land the user" step. Extracted from `useLogin` so the password path and the passwordless
 * code path share ONE implementation of the role check, `setSession` and the per-role
 * landing map, rather than duplicating it (Constitution IV).
 */
export function useSessionLanding() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useSessionStore((s) => s.setSession);
  const clearSession = useSessionStore((s) => s.clearSession);

  return useCallback(
    (data: LoginResponse, remember?: boolean) => {
      // FR-003/FR-004: a CLIENT or DRIVER credential is genuine but this surface is
      // admin-only — refused here, before a session is ever established.
      if (!isDashboardRole(data.user.role)) {
        clearSession();
        toast.error('هذا الحساب لا يملك صلاحية الوصول إلى لوحة التحكم');
        return;
      }

      setSession(data.user, data.accessToken, data.refreshToken, remember);
      const state = location.state as LocationState | null;
      const requestedPath = state?.from?.pathname;
      const redirectTo =
        requestedPath && requestedPath !== '/' && requestedPath !== '/home'
          ? requestedPath
          : DASHBOARD_HOME[data.user.role];

      navigate(redirectTo, { replace: true });
    },
    [navigate, location.state, setSession, clearSession],
  );
}
