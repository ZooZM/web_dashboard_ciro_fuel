import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useProposeOnOffer } from '@/petrol_company/fuel_exchange/hooks/useFuelExchange';
import { apiErrorMessage } from '@/lib/api/error-messages';

export interface ProposeDialogProps {
  offerId: string;
  onClose: () => void;
  onSubmitted: () => void;
}

/**
 * spec 016 (broadcast fuel exchange offers) T057 — the responder's price entry or
 * decline, mutually exclusive at the API. No pre-validation of the price against
 * anything the dashboard could know (research R2: the grade guard is the platform's own
 * `EXCHANGE_GRADE_NOT_SOLD`, surfaced here rather than guessed at client-side — the same
 * discipline feature 014 set).
 */
export function ProposeDialog({ offerId, onClose, onSubmitted }: ProposeDialogProps) {
  const { t } = useTranslation();
  const propose = useProposeOnOffer(offerId);
  const [unitPrice, setUnitPrice] = useState('');

  // The three codes this dialog used to map inline now live in `API_ERROR_MESSAGE_KEY`
  // alongside every other platform code, so a screen that grows a new failure mode does
  // not have to rediscover the same table.
  const errorMessage = (err: unknown) => apiErrorMessage(err, t);

  async function handlePropose() {
    const price = Number(unitPrice);
    if (!(price > 0)) {
      toast.error(t('fuelExchange.formIncomplete'));
      return;
    }
    try {
      await propose.mutateAsync({ unitPrice: price });
      toast.success(t('fuelExchange.proposalSubmitted'));
      onSubmitted();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  async function handleDecline() {
    try {
      await propose.mutateAsync({ decline: true });
      toast.success(t('fuelExchange.declineConfirmed'));
      onSubmitted();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col gap-5 shadow-xl"
        dir="rtl"
      >
        <h2 className="text-lg font-black text-slate-900">{t('fuelExchange.propose')}</h2>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 mr-1">{t('fuelExchange.proposePrice')}</label>
          <input
            type="number"
            min={0.01}
            step="0.01"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            placeholder="0.00"
            autoFocus
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-900"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => void handleDecline()}
            disabled={propose.isPending}
            className="flex items-center justify-center gap-2 bg-red-50 text-red-500 px-5 py-3 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {t('fuelExchange.proposeDecline')}
          </button>
          <button
            onClick={() => void handlePropose()}
            disabled={propose.isPending}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {propose.isPending ? t('common.loading') : t('fuelExchange.proposeSubmit')}
          </button>
        </div>
      </div>
    </div>
  );
}
