import type { ReactNode } from 'react';
import type { Role } from '@/constants/roles';
import { useSession } from '@/stores/session.store';

interface RoleGateProps {
  allow: readonly Role[];
  children: ReactNode;
}

/** UX-layer conditional render (nav items, actions) — never a substitute for server authz
 *  or for <ProtectedRoute>; hides affordances the current role shouldn't see. */
export function RoleGate({ allow, children }: RoleGateProps) {
  const { user } = useSession();
  if (!user || !allow.includes(user.role)) return null;
  return <>{children}</>;
}
