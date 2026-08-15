import { useNavigate } from 'react-router-dom';
import { performLogout } from '@/features/auth/bootstrap-session';

export function useLogout() {
  const navigate = useNavigate();

  return async function logout(): Promise<void> {
    await performLogout();
    navigate('/', { replace: true });
  };
}
