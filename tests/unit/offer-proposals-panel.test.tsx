import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import i18n from '@/lib/i18n/i18n';
import { OfferProposalsPanel } from '@/petrol_company/fuel_exchange/components/OfferProposalsPanel';
import type { OfferDetail } from '@/petrol_company/fuel_exchange/api/fuel-exchange.api';

const mockAward = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  isPending: false,
}));

vi.mock('@/petrol_company/fuel_exchange/hooks/useFuelExchange', () => ({
  useAwardOffer: () => mockAward,
}));

function baseOffer(overrides: Partial<OfferDetail> = {}): OfferDetail {
  return {
    _id: 'offer-1',
    openToMarket: true,
    raisedByCompanyId: 'company-a',
    raisedByCompanyName: 'Company A',
    fuelType: 'PETROL_95',
    quantityLitres: 10000,
    deliveryAt: new Date().toISOString(),
    city: 'JEDDAH',
    state: 'OPEN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as OfferDetail;
}

/**
 * spec 016 (broadcast fuel exchange offers) T077 — `OfferProposalsPanel` must never
 * mount for a non-raiser (a UX layer only: the payload carries no `proposals` field for
 * anyone else — `contracts/isolation-contract.md` is the actual guarantee), and the
 * award control must not appear once the offer is already resolved.
 */
describe('OfferProposalsPanel (US3)', () => {
  beforeAll(() => void i18n.changeLanguage('en'));
  afterEach(() => cleanup());

  it('renders nothing when the viewer did not raise the offer (proposals absent)', () => {
    const { container } = render(<OfferProposalsPanel offer={baseOffer({ proposals: undefined })} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows an award action for an OPEN offer with a live proposal', () => {
    render(
      <OfferProposalsPanel
        offer={baseOffer({
          proposalCount: 1,
          declineCount: 0,
          proposals: [
            {
              _id: 'p1',
              proposingCompanyId: 'company-b',
              outcome: 'PROPOSED',
              unitPrice: 2.2,
              currency: 'SAR',
              total: 22000,
              respondedAt: new Date().toISOString(),
              company: { name: 'Company B', contactEmail: 'b@b.test', contactPhone: '+9665' },
            },
          ],
        })}
      />,
    );
    expect(screen.getByRole('button', { name: /award/i })).toBeInTheDocument();
  });

  it('shows no award action once the offer is already resolved (AWARDED)', () => {
    render(
      <OfferProposalsPanel
        offer={baseOffer({
          state: 'AWARDED',
          proposalCount: 1,
          declineCount: 0,
          proposals: [
            {
              _id: 'p1',
              proposingCompanyId: 'company-b',
              outcome: 'AWARDED',
              unitPrice: 2.2,
              currency: 'SAR',
              total: 22000,
              respondedAt: new Date().toISOString(),
              company: { name: 'Company B', contactEmail: 'b@b.test', contactPhone: '+9665' },
            },
          ],
        })}
      />,
    );
    expect(screen.queryByRole('button', { name: /award/i })).not.toBeInTheDocument();
  });
});
