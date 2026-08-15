import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '@/features/auth/api/auth.api';
import { useSessionStore } from '@/stores/session.store';
import type { LoginInput } from '@/features/auth/types';

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
      const redirectTo = state?.from?.pathname ?? '/';
      navigate(redirectTo, { replace: true });
    },
  });
}
