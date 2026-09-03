import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from '@/routing/ProtectedRoute';
import { useSessionStore } from '@/stores/session.store';
import { Role } from '@/constants/roles';

// Feature 009 T013/T014: exercises the role vocabulary and route guards this feature
// rewrote (research.md R1). `Role.COMPANY_ADMIN` no longer exists — every case below uses one
// of the platform's five real roles — and the app's actual login route is `/` (router.tsx),
// not `/login`; this file previously asserted a redirect target the app never uses.
function renderProtected(allow: Role[], initialEntries: string[] = ['/secret']) {
  const router = createMemoryRouter(
    [
      { path: '/', element: <div>Login page</div> },
      { path: '/403', element: <div>Forbidden page</div> },
      {
        element: <ProtectedRoute allow={allow} />,
        children: [{ path: '/secret', element: <div>Secret content</div> }],
      },
    ],
    { initialEntries },
  );
  return render(<RouterProvider router={router} />);
}

afterEach(() => {
  useSessionStore.getState().clearSession();
  useSessionStore.setState({ status: 'booting' });
});

describe('<ProtectedRoute> (FR-068, SC-001)', () => {
  it('shows a spinner while booting and renders no route content', () => {
    useSessionStore.setState({ status: 'booting', user: null });
    renderProtected([Role.TRANSPORT_COMPANY_ADMIN]);
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('redirects an unauthenticated user to the login route', () => {
    useSessionStore.setState({ status: 'anonymous', user: null });
    renderProtected([Role.TRANSPORT_COMPANY_ADMIN]);
    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument();
  });

  it('redirects a wrong-role authenticated user to /403 without rendering the route', () => {
    useSessionStore.getState().setSession(
      { id: '1', role: Role.SUPER_ADMIN, companyId: null, fullName: 'Owner', email: 'a@b.com' },
      'token',
    );
    renderProtected([Role.TRANSPORT_COMPANY_ADMIN]);
    expect(screen.getByText('Forbidden page')).toBeInTheDocument();
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument();
  });

  it('renders the route for an allowed authenticated role', () => {
    useSessionStore.getState().setSession(
      { id: '2', role: Role.TRANSPORT_COMPANY_ADMIN, companyId: 'c1', fullName: 'Admin', email: 'c@d.com' },
      'token',
    );
    renderProtected([Role.TRANSPORT_COMPANY_ADMIN]);
    expect(screen.getByText('Secret content')).toBeInTheDocument();
  });

  it('a DRIVER is refused the transport admin surface (FR-068 — this reached both admin surfaces before Slice 0)', () => {
    useSessionStore.getState().setSession(
      { id: '3', role: Role.DRIVER, companyId: 'c1', fullName: 'Driver', email: 'd@e.com' },
      'token',
    );
    renderProtected([Role.TRANSPORT_COMPANY_ADMIN, Role.SUPER_ADMIN]);
    expect(screen.getByText('Forbidden page')).toBeInTheDocument();
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument();
  });

  it('a CLIENT is refused the fuel company admin surface (FR-068 — this reached it before Slice 0)', () => {
    useSessionStore.getState().setSession(
      { id: '4', role: Role.CLIENT, companyId: 'c1', fullName: 'Client', email: 'f@g.com' },
      'token',
    );
    renderProtected([Role.FUEL_COMPANY_ADMIN, Role.SUPER_ADMIN]);
    expect(screen.getByText('Forbidden page')).toBeInTheDocument();
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument();
  });

  it('SUPER_ADMIN reaches every guarded surface (tenant-isolation exemption)', () => {
    useSessionStore.getState().setSession(
      { id: '5', role: Role.SUPER_ADMIN, companyId: null, fullName: 'Owner', email: 'a@b.com' },
      'token',
    );
    renderProtected([Role.TRANSPORT_COMPANY_ADMIN, Role.SUPER_ADMIN]);
    expect(screen.getByText('Secret content')).toBeInTheDocument();
  });

  // spec 013 T244/T245/FR-091: the entire `/admin` route tree is guarded
  // `allow={[SUPER_ADMIN]}` alone (router.tsx) — a FUEL_COMPANY_ADMIN cannot reach it at
  // all, which is what makes "operator-only controls absent, not disabled" true by
  // construction for every operator-only screen this feature added (Phase 16's fuel
  // companies list/detail, billing settings, exchange oversight): there is no shared
  // ROUTE for a control to leak across, only a small set of purely presentational
  // components reused by both trees (`FuelExchangeStats`, `CustomerDataCard`,
  // `CompanyRecentTripsCard`, the four payment-form inputs, `CommissionTypeSelector`) —
  // none of which contain any role-conditional rendering at all (verified by inspection,
  // recorded in tasks.md's Notes). This test asserts the mechanism that makes that
  // construction hold: a FUEL_COMPANY_ADMIN is refused the operator-only surface exactly
  // as a DRIVER/CLIENT are refused theirs above.
  it('a FUEL_COMPANY_ADMIN is refused the operator-only surface (T244/T245, FR-091)', () => {
    useSessionStore.getState().setSession(
      { id: '6', role: Role.FUEL_COMPANY_ADMIN, companyId: 'c1', fullName: 'FCA', email: 'h@i.com' },
      'token',
    );
    renderProtected([Role.SUPER_ADMIN]);
    expect(screen.getByText('Forbidden page')).toBeInTheDocument();
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument();
  });
});
