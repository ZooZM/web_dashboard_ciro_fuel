import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import i18n from '@/lib/i18n/i18n';
import { ProposeDialog } from '@/petrol_company/fuel_exchange/components/ProposeDialog';
import { ApiError } from '@/lib/api/api-error';

const mockPropose = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  isPending: false,
}));

vi.mock('@/petrol_company/fuel_exchange/hooks/useFuelExchange', () => ({
  useProposeOnOffer: () => mockPropose,
}));

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

/**
 * spec 016 (broadcast fuel exchange offers) T059/`contracts/dashboard-integration.md` —
 * the platform's own refusals are surfaced with curated copy, never pre-validated
 * client-side (the pattern feature 014 set for `EXCHANGE_GRADE_NOT_SOLD`).
 */
describe('ProposeDialog (US2)', () => {
  beforeAll(() => void i18n.changeLanguage('en'));
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('surfaces EXCHANGE_ALREADY_ANSWERED with curated copy', async () => {
    mockPropose.mutateAsync.mockRejectedValueOnce(
      new ApiError(409, 'already answered', 'EXCHANGE_ALREADY_ANSWERED'),
    );
    const toast = (await import('react-hot-toast')).default;
    render(<ProposeDialog offerId="offer-1" onClose={vi.fn()} onSubmitted={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '2.5' } });
    fireEvent.click(screen.getByRole('button', { name: /submit offer/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('You have already answered this offer'));
  });

  it('surfaces EXCHANGE_GRADE_NOT_SOLD with curated copy', async () => {
    mockPropose.mutateAsync.mockRejectedValueOnce(
      new ApiError(400, 'grade not sold', 'EXCHANGE_GRADE_NOT_SOLD'),
    );
    const toast = (await import('react-hot-toast')).default;
    render(<ProposeDialog offerId="offer-1" onClose={vi.fn()} onSubmitted={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '2.5' } });
    fireEvent.click(screen.getByRole('button', { name: /submit offer/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Your company does not sell this grade'));
  });

  it('submits a decline without requiring a price', async () => {
    mockPropose.mutateAsync.mockResolvedValueOnce({ outcome: 'DECLINED' });
    const onSubmitted = vi.fn();
    render(<ProposeDialog offerId="offer-1" onClose={vi.fn()} onSubmitted={onSubmitted} />);

    fireEvent.click(screen.getByRole('button', { name: /decline this offer/i }));

    await waitFor(() => expect(mockPropose.mutateAsync).toHaveBeenCalledWith({ decline: true }));
    await waitFor(() => expect(onSubmitted).toHaveBeenCalled());
  });
});
