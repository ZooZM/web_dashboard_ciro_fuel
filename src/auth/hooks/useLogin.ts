import { useMutation } from '@tanstack/react-query';
import { login } from '@/auth/api/auth.api';
import { useSessionLanding } from '@/auth/hooks/useSessionLanding';
import type { LoginInput } from '@/auth/types';

/**
 * The email + password sign-in path (US6 — still supported, FR-064). Its
 * `onSuccess` role-check + `setSession` + per-role landing is the SHARED
 * `useSessionLanding` step, which the passwordless code path
 * (`useVerifyLoginCode`) uses too — one implementation, not two (T063).
 */
export function useLogin() {
  const land = useSessionLanding();
  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (data) => land(data),
  });
}
