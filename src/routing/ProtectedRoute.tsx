import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { Role } from '@/constants/roles';
import { useSession } from '@/stores/session.store';
import toast from 'react-hot-toast';
interface ProtectedRouteProps {
  allow: readonly Role[];
  children?: React.ReactNode;
}

function FullscreenSpinner() {
  return (
    <div className="flex h-svh w-full items-center justify-center" role="status" aria-live="polite">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

/**
 * Guards a route subtree by auth + role BEFORE its element (and therefore its data hooks)
 * render — FR-004/FR-005, SC-001. Unauthenticated goes to /login with the original location
 * preserved for post-login return; authenticated-but-wrong-role goes to /403 with no
 * out-of-scope fetch ever issued.
 */
export function ProtectedRoute({ allow, children }: ProtectedRouteProps) {
  const location = useLocation();
  const { status, user } = useSession();

  if (status === 'booting') {
    return <FullscreenSpinner />;
  }

  if (status !== 'authenticated' || !user) {
    if (status !== 'booting') {
      toast.error('يرجى تسجيل الدخول أولاً')
    }
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (!allow.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
