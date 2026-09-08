import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import i18n from '@/lib/i18n/i18n';
import { NewOfferForm } from '@/petrol_company/fuel_exchange/components/NewOfferForm';

const mockCreateOffer = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  isPending: false,
}));

vi.mock('@/petrol_company/fuel_exchange/hooks/useFuelExchange', () => ({
  useCreateOffer: () => mockCreateOffer,
}));

/**
 * spec 016 (broadcast fuel exchange offers) T045/T090 — `NewOfferForm` replaces the
 * directed model's `NewFuelRequestForm` (FR-040): no recipient selector (an offer
 * reaches every eligible company, never one named party) and no price input (FR-005a —
 * price is proposed by each responder, never set by the raiser). The summary row states
 * quantity and grade, never a currency amount (FR-032a — no price exists at creation, so
 * a total could only ever read zero). The neighbourhood field is labelled الحي, never
 * المنطقة (research R8 — the platform already uses that word for its 13 RegionCode
 * regions elsewhere).
 */
describe('NewOfferForm (US1/US5)', () => {
  beforeAll(() => void i18n.changeLanguage('en'));
  afterEach(() => cleanup());

  it('has no recipient selector', () => {
    render(<NewOfferForm onCreated={vi.fn()} />);
    expect(screen.queryByText(/recipient/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/select a company/i)).not.toBeInTheDocument();
  });

  it('has no price input anywhere', () => {
    render(<NewOfferForm onCreated={vi.fn()} />);
    expect(screen.queryByText(/price per litre/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('0.00')).not.toBeInTheDocument();
  });

  it('the summary row states quantity and grade, never a currency amount (FR-032a)', () => {
    render(<NewOfferForm onCreated={vi.fn()} />);
    expect(screen.getByText(/offer summary/i)).toBeInTheDocument();
    expect(screen.queryByText(/estimated total/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/SAR/)).not.toBeInTheDocument();
  });

  it('has the destination fields: city, district (neighbourhood), location link and notes', () => {
    render(<NewOfferForm onCreated={vi.fn()} />);
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('Neighbourhood')).toBeInTheDocument();
    expect(screen.getByText('Location link')).toBeInTheDocument();
    expect(screen.getByText('Additional notes')).toBeInTheDocument();
  });

  it('labels the neighbourhood field الحي, never المنطقة, in Arabic (research R8)', async () => {
    await i18n.changeLanguage('ar');
    render(<NewOfferForm onCreated={vi.fn()} />);
    expect(screen.getByText('الحي')).toBeInTheDocument();
    expect(screen.queryByText('المنطقة')).not.toBeInTheDocument();
    await i18n.changeLanguage('en');
  });
});
