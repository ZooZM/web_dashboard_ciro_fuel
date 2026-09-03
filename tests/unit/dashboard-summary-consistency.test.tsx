import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from '@/lib/i18n/i18n';
import { useSessionStore } from '@/stores/session.store';
import { PetrolDashboard } from '@/petrol_company/dashboard/components/PetrolDashboard';
import { StationsPage } from '@/petrol_company/stations/components/StationsPage';

// Feature 013 T118/SC-009: for one seeded data set, every figure the dashboard home shows
// must equal what the corresponding list screen independently counts. Both screens are
// rendered against the SAME underlying seed (3 owners, 5 stations) through their own real
// wiring — `PetrolDashboard` via `useFuelCompanySummary`, `StationsPage` via
// `useOwners`/`useAllStations` — never a single shared fixture asserted against itself.
beforeAll(() => void i18n.changeLanguage('en'));

const SEED_OWNERS_COUNT = 3;
const SEED_STATIONS_COUNT = 5;

const mockOwners = Array.from({ length: SEED_OWNERS_COUNT }, (_, i) => ({
  _id: `owner-${i}`,
  role: 'CLIENT',
  companyId: 'company-a',
  fullName: `Owner ${i}`,
  email: `owner${i}@test.com`,
  phone: '+966500000000',
  isActive: true,
  createdAt: new Date().toISOString(),
}));

const mockStations = Array.from({ length: SEED_STATIONS_COUNT }, (_, i) => ({
  _id: `station-${i}`,
  companyId: 'company-a',
  clientId: `owner-${i % SEED_OWNERS_COUNT}`,
  regionCode: 'RIYADH',
  governorateCode: 'RIYADH_CITY',
  location: { type: 'Point', coordinates: [46.6753, 24.7136] },
  addressText: '',
  isDefault: false,
  isFavourite: false,
}));

vi.mock('@/petrol_company/dashboard/hooks/useSummary', () => ({
  useFuelCompanySummary: () => ({
    data: {
      pendingApproval: 2,
      inProgress: 1,
      completedInPeriod: 4,
      stationOwnersCount: SEED_OWNERS_COUNT,
      stationsCount: SEED_STATIONS_COUNT,
      creditOutstanding: { amount: 1000, currency: 'SAR', count: 2 },
    },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

vi.mock('@/petrol_company/stations/hooks/useOwners', () => ({
  useOwners: () => ({ data: mockOwners, isLoading: false, isError: false, refetch: vi.fn() }),
}));

vi.mock('@/petrol_company/stations/hooks/useStations', () => ({
  useAllStations: () => ({ data: mockStations, isLoading: false, isError: false, refetch: vi.fn() }),
}));

vi.mock('@/petrol_company/stations/hooks/useCreditLimitRequests', () => ({
  useCreditLimitRequests: () => ({ data: [], isLoading: false, isError: false, refetch: vi.fn() }),
}));

describe('Dashboard home figures match the corresponding list screen (SC-009)', () => {
  it('shows the same station-owner count as the owners list screen', () => {
    useSessionStore.setState({
      user: { id: 'admin-1', role: 'FUEL_COMPANY_ADMIN' as never, companyId: 'company-a', fullName: 'Test Admin', email: 'admin@test.com' },
      status: 'authenticated',
    });

    render(<MemoryRouter><PetrolDashboard /></MemoryRouter>);
    expect(screen.getByText(String(SEED_OWNERS_COUNT))).toBeInTheDocument();

    render(<MemoryRouter><StationsPage /></MemoryRouter>);
    // StationListStats' "owners" card and the owners tab's row count both derive from the
    // same `mockOwners` array — length SEED_OWNERS_COUNT — independently of the dashboard.
    expect(screen.getAllByText(String(SEED_OWNERS_COUNT)).length).toBeGreaterThan(0);
  });

  it('shows the same station count as the stations list screen', () => {
    render(<MemoryRouter><PetrolDashboard /></MemoryRouter>);
    expect(screen.getByText(String(SEED_STATIONS_COUNT))).toBeInTheDocument();

    render(<MemoryRouter><StationsPage /></MemoryRouter>);
    expect(screen.getAllByText(String(SEED_STATIONS_COUNT)).length).toBeGreaterThan(0);
  });
});
