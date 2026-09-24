import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18n from '@/lib/i18n/i18n';
import { OrdersListPage } from '@/transport_company/orders/components/OrdersListPage';

const mockQuery = vi.hoisted(() => ({
  data: undefined as unknown,
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
}));

vi.mock('@/transport_company/orders/hooks/useOrders', () => ({
  useOrdersList: () => mockQuery,
}));

// The page's stat cards read `GET /orders/summary` — a separate query from the list whose
// three states this suite is about, so it is held steady (and successful) here.
vi.mock('@/transport_company/dashboard/hooks/useSummary', () => ({
  useSummary: () => ({
    data: { awaitingAssignment: 0, inProgress: 0, completedInPeriod: 0, driversOnDuty: 0 },
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => vi.fn(),
}));

/**
 * Feature 009 T116/FR-064/SC-011: loading, empty and failed must be three visibly distinct
 * states — never collapsed into one another. A failed query previously left `data`
 * `undefined`, which every list rendered identically to a genuinely empty one; this is the
 * regression test for the fix (`isError` branches added across every transport list/figure).
 */
describe('Loading/empty/failed are three distinct states (FR-064, SC-011)', () => {
  beforeAll(() => void i18n.changeLanguage('en'));

  it('shows the empty-list message when the query succeeded with zero rows', () => {
    mockQuery.data = { items: [], nextCursor: null };
    mockQuery.isLoading = false;
    mockQuery.isError = false;
    render(<OrdersListPage />);
    expect(screen.getByText(/no orders/i)).toBeInTheDocument();
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });

  it('shows a distinct failed state with retry when the query errors, never the empty message', () => {
    mockQuery.data = undefined;
    mockQuery.isLoading = false;
    mockQuery.isError = true;
    render(<OrdersListPage />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    expect(screen.queryByText(/no orders/i)).not.toBeInTheDocument();
  });
});
