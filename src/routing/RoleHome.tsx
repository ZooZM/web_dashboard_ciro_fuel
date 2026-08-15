import { Navigate } from 'react-router-dom';
import { Role } from '@/constants/roles';
import { useSession } from '@/stores/session.store';

/** Post-login landing redirect: sends each persona to its own home route. */
export function RoleHome() {
  const { user } = useSession();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === Role.SUPER_ADMIN ? (
    <Navigate to="/companies" replace />
  ) : (
    <Navigate to="/orders" replace />
  );
}
