import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import i18n from '@/lib/i18n/i18n';
import { AssignmentProvider } from '@/transport_company/orders/components/assign-driver/AssignmentContext';
import { AssignLists } from '@/transport_company/orders/components/assign-driver/AssignLists';
import { AssignSelectionCard } from '@/transport_company/orders/components/assign-driver/AssignSelectionCard';
import { OrderStatus } from '@/constants/order-status';
import type { Candidate } from '@/transport_company/orders/api/dispatch.api';

beforeAll(() => void i18n.changeLanguage('en'));

const mockCandidates = vi.hoisted(() => ({ data: [] as Candidate[] }));
const mockAssign = vi.hoisted(() => ({ mutate: vi.fn() }));

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useParams: () => ({ id: 'order-1' }),
}));

vi.mock('@/transport_company/orders/hooks/useOrders', () => ({
  useOrderDetail: () => ({ data: { status: OrderStatus.ROUTED_TO_TRANSPORT }, isLoading: false }),
}));

vi.mock('@/transport_company/orders/hooks/useCandidates', () => ({
  useCandidates: () => ({ data: mockCandidates.data, isLoading: false }),
}));

vi.mock('@/transport_company/orders/hooks/useAssignDriver', () => ({
  useAssignDriver: () => ({ mutate: mockAssign.mutate, isPending: false }),
}));

vi.mock('@/transport_company/trucks/hooks/useTrucks', () => ({
  useTrucksList: () => ({ data: { items: [] }, isLoading: false }),
}));

vi.mock('@/transport_company/trucks/hooks/useTanks', () => ({
  useTanksList: () => ({ data: { items: [] }, isLoading: false }),
}));

function candidate(overrides: Partial<Candidate>): Candidate {
  return {
    _id: 'driver-1',
    fullName: 'Test Driver',
    phone: '+966500000000',
    suggestedTruck: null,
    eligibility: 'ELIGIBLE',
    lastSeenAt: null,
    ...overrides,
  } as Candidate;
}

function renderAssignScreen() {
  return render(
    <AssignmentProvider>
      <AssignLists />
      <AssignSelectionCard />
    </AssignmentProvider>,
  );
}

/**
 * Feature 010 T012 (FR-004/FR-007/FR-008): every eligibility state renders distinctly, and
 * the required-reason field appears only for an OFFLINE selection — never for BUSY/INACTIVE,
 * which the platform refuses regardless of any reason (FR-007 correction).
 */
describe('Candidate eligibility rendering (spec 010 US1)', () => {
  it('renders ELIGIBLE, BUSY, OFFLINE and INACTIVE distinctly', () => {
    mockCandidates.data = [
      candidate({ _id: 'd-eligible', fullName: 'Eligible Driver', eligibility: 'ELIGIBLE' }),
      candidate({ _id: 'd-busy', fullName: 'Busy Driver', eligibility: 'BUSY' }),
      candidate({ _id: 'd-offline', fullName: 'Offline Driver', eligibility: 'OFFLINE', lastSeenAt: new Date().toISOString() }),
      candidate({ _id: 'd-inactive', fullName: 'Inactive Driver', eligibility: 'INACTIVE' }),
    ];
    renderAssignScreen();

    expect(screen.getByText('Already assigned elsewhere')).toBeInTheDocument();
    expect(screen.getByText(/Offline — last seen/)).toBeInTheDocument();
    expect(screen.getByText('Deactivated')).toBeInTheDocument();
    // The eligible driver's row carries no eligibility badge at all.
    expect(screen.queryByText('Eligible Driver')?.parentElement?.textContent).not.toMatch(
      /Already assigned|Offline|Deactivated/,
    );
  });

  it('disables selection for BUSY and INACTIVE, but not for OFFLINE or ELIGIBLE', () => {
    mockCandidates.data = [
      candidate({ _id: 'd-busy', fullName: 'Busy Driver', eligibility: 'BUSY' }),
      candidate({ _id: 'd-inactive', fullName: 'Inactive Driver', eligibility: 'INACTIVE' }),
      candidate({ _id: 'd-offline', fullName: 'Offline Driver', eligibility: 'OFFLINE' }),
    ];
    renderAssignScreen();

    const radios = screen.getAllByRole('radio');
    // Order matches candidates.map render order: busy, inactive, offline.
    expect(radios[0]).toBeDisabled();
    expect(radios[1]).toBeDisabled();
    expect(radios[2]).not.toBeDisabled();
  });

  it('shows the required reason field only for an OFFLINE selection, blocking confirm until filled', () => {
    mockCandidates.data = [
      candidate({ _id: 'd-offline', fullName: 'Offline Driver', eligibility: 'OFFLINE' }),
    ];
    renderAssignScreen();

    expect(screen.queryByText(/Reason for assigning an offline driver/)).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('radio')[0]);

    expect(screen.getByText(/Reason for assigning an offline driver/)).toBeInTheDocument();
    const confirmButton = screen.getByRole('button', { name: /confirm assignment/i });
    expect(confirmButton).toBeDisabled();
  });
});
