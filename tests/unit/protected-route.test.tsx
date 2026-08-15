import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from '@/routing/ProtectedRoute';
import { useSessionStore } from '@/stores/session.store';
import { Role } from '@/constants/roles';

function renderProtected(allow: Role[], initialEntries: string[] = ['/secret']) {
  const router = createMemoryRouter(
    [
      { path: '/login', element: <div>Login page</div> },
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

describe('<ProtectedRoute> (FR-004/FR-005, SC-001)', () => {
  it('shows a spinner while booting and renders no route content', () => {
    useSessionStore.setState({ status: 'booting', user: null });
    renderProtected([Role.COMPANY_ADMIN]);
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to /login', () => {
    useSessionStore.setState({ status: 'anonymous', user: null });
    renderProtected([Role.COMPANY_ADMIN]);
    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument();
  });

  it('redirects a wrong-role authenticated user to /403 without rendering the route', () => {
    useSessionStore.getState().setSession(
      { id: '1', role: Role.SUPER_ADMIN, companyId: null, fullName: 'Owner', email: 'a@b.com' },
      'token',
    );
    renderProtected([Role.COMPANY_ADMIN]);
    expect(screen.getByText('Forbidden page')).toBeInTheDocument();
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument();
  });

  it('renders the route for an allowed authenticated role', () => {
    useSessionStore.getState().setSession(
      { id: '2', role: Role.COMPANY_ADMIN, companyId: 'c1', fullName: 'Admin', email: 'c@d.com' },
      'token',
    );
    renderProtected([Role.COMPANY_ADMIN]);
    expect(screen.getByText('Secret content')).toBeInTheDocument();
  });
});
