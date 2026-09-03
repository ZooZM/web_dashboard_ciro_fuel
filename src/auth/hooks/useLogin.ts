import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '@/auth/api/auth.api';
import { useSessionStore } from '@/stores/session.store';
import { Role, isDashboardRole } from '@/constants/roles';
import type { LoginInput } from '@/auth/types';

interface LocationState {
  from?: { pathname: string };
}

// FR-001/FR-002: each dashboard role's own landing screen. Feature 013 R1 found
// this had NO case for FUEL_COMPANY_ADMIN at all — every fuel company
// administrator fell into a catch-all `else` that sent them to `/transport`,
// the wrong surface, on every fresh login. Named per-role rather than an
// `else`, so a role added later fails to compile here instead of silently
// landing on someone else's dashboard (Principle I).
const DASHBOARD_HOME: Record<(typeof Role)[keyof typeof Role] & string, string> = {
  [Role.SUPER_ADMIN]: '/admin',
  [Role.FUEL_COMPANY_ADMIN]: '/petrolCompany',
  [Role.TRANSPORT_COMPANY_ADMIN]: '/transport',
  [Role.CLIENT]: '/',
  [Role.DRIVER]: '/',
};

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useSessionStore((s) => s.setSession);
  const clearSession = useSessionStore((s) => s.clearSession);

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (data) => {
      // FR-003/FR-004: a CLIENT or DRIVER credential is genuine (the platform issued
      // it) but this surface is admin-only — refused here, before a session is ever
      // established, rather than left to bounce through a route guard afterwards.
      if (!isDashboardRole(data.user.role)) {
        clearSession();
        toast.error('هذا الحساب لا يملك صلاحية الوصول إلى لوحة التحكم');
        return;
      }

      setSession(data.user, data.accessToken, data.refreshToken);
      const state = location.state as LocationState | null;
      const requestedPath = state?.from?.pathname;
      const redirectTo =
        requestedPath && requestedPath !== '/' && requestedPath !== '/home'
          ? requestedPath
          : DASHBOARD_HOME[data.user.role];

      navigate(redirectTo, { replace: true });
    },
  });
}
