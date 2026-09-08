import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import i18n from '@/lib/i18n/i18n';
import { FuelExchangePage } from '@/petrol_company/fuel_exchange/components/FuelExchangePage';

const mockList = vi.hoisted(() => ({
  data: { items: [], nextCursor: null } as unknown,
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
}));
const mockSummary = vi.hoisted(() => ({
  data: undefined as unknown,
}));

vi.mock('@/petrol_company/fuel_exchange/hooks/useFuelExchange', () => ({
  useOffersList: () => mockList,
  useOfferSummary: () => mockSummary,
}));

vi.mock('@/petrol_company/fuel_exchange/components/NewOfferForm', () => ({
  NewOfferForm: () => <div data-testid="new-offer-form" />,
}));

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => vi.fn(),
}));

/**
 * spec 016 (broadcast fuel exchange offers) T096/research R9 — the three summary cards
 * are fed by `GET /fuel-exchange/offers/summary`, counted over the WHOLE scoped set, not
 * the loaded page (FR-033). This is the regression test for the defect the shipped
 * component's own comment used to concede: "counts a page because no aggregate endpoint
 * exists".
 */
describe('Fuel exchange summary counts (US6)', () => {
  beforeAll(() => void i18n.changeLanguage('en'));
  afterEach(() => cleanup());

  it('renders the summary endpoint\'s counts even though the loaded page is empty', () => {
    mockList.data = { items: [], nextCursor: 'has-more' };
    mockSummary.data = { incomingAwaitingAnswer: 3, outgoingOpen: 25, awardedThisMonth: 9 };

    render(<FuelExchangePage />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('renders zero, not a crash, before the summary query resolves', () => {
    mockList.data = { items: [], nextCursor: null };
    mockSummary.data = undefined;
    render(<FuelExchangePage />);
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(3);
  });
});
