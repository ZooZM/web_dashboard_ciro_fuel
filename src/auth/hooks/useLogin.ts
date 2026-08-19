import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '@/auth/api/auth.api';
import { useSessionStore } from '@/stores/session.store';
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
      setSession(data.user, data.accessToken);
      const state = location.state as LocationState | null;
      let redirectTo = state?.from?.pathname ?? '/';
      
      if (redirectTo === '/' || redirectTo === '/home') {
        if (data.user.role === 'SUPER_ADMIN') redirectTo = '/admin';
        else if (data.user.role === 'CLIENT') redirectTo = '/petrol';
        else redirectTo = '/transport';
      }
      
      navigate(redirectTo, { replace: true });
    },
  });
}
