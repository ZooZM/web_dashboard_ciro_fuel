import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '@/auth/api/auth.api';
import { useSessionStore } from '@/stores/session.store';
import { Role } from '@/constants/roles';
import type { LoginInput } from '@/auth/types';

interface LocationState {
  from?: { pathname: string };
}

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useSessionStore((s) => s.setSession);

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (data) => {
      setSession(data.user, data.accessToken, data.refreshToken);
      const state = location.state as LocationState | null;
      let redirectTo = state?.from?.pathname ?? '/';

      // Redirect to the surface this role owns (FR-068) — matches the guards in
      // app/router.tsx exactly, so a redirect here is never followed by a 403.
      if (redirectTo === '/' || redirectTo === '/home') {
        if (data.user.role === Role.SUPER_ADMIN) redirectTo = '/admin';
        else if (data.user.role === Role.FUEL_COMPANY_ADMIN) redirectTo = '/petrolCompany';
        else redirectTo = '/transport';
      }

      navigate(redirectTo, { replace: true });
    },
  });
}
