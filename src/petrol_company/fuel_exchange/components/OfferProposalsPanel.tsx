import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAwardOffer } from '@/petrol_company/fuel_exchange/hooks/useFuelExchange';
import { ExchangeOfferState, ProposalOutcome } from '@/constants/fuel-company';
import { apiErrorMessage } from '@/lib/api/error-messages';
import type { OfferDetail } from '@/petrol_company/fuel_exchange/api/fuel-exchange.api';

export interface OfferProposalsPanelProps {
  offer: OfferDetail;
}

/**
 * spec 016 (broadcast fuel exchange offers) T074/FR-014/FR-021a/FR-037 — the raiser's
 * review + award. **Must never mount for a non-raiser, and that is a UX layer only**:
 * `offer.proposals` is simply ABSENT from the payload for anyone else (the isolation
 * contract, not this component, is what FR-011b actually rests on) — this component
 * merely honours that by rendering nothing when the field it needs was never sent.
 */
export function OfferProposalsPanel({ offer }: OfferProposalsPanelProps) {
  const { t } = useTranslation();
  const award = useAwardOffer(offer._id);

  if (!offer.proposals) {
    return null;
  }

  const canAward = offer.state === ExchangeOfferState.OPEN;

  async function handleAward(proposalId: string) {
    if (!window.confirm(t('fuelExchange.awardConfirm'))) return;
    try {
      await award.mutateAsync(proposalId);
      toast.success(t('fuelExchange.awarded'));
    } catch (err) {
      // FR-014a: a simultaneous award on the same offer surfaces here as
      // EXCHANGE_ALREADY_RESOLVED — the platform's own conditional update decided, not a
      // stale read. The shared table translates it.
      toast.error(apiErrorMessage(err, t));
    }
  }

  const livingProposals = offer.proposals.filter((p) => p.outcome !== ProposalOutcome.DECLINED);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-slate-900">{t('fuelExchange.proposals')}</h2>
        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
          <span>
            {t('fuelExchange.proposalCount')}: {offer.proposalCount ?? 0}
          </span>
          <span>
            {t('fuelExchange.declineCount')}: {offer.declineCount ?? 0}
          </span>
        </div>
      </div>

      {livingProposals.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-6">{t('fuelExchange.noProposalsYet')}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {livingProposals.map((p) => (
            <div
              key={p._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 font-black">
                  {(p.company?.name ?? '?').charAt(0)}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-black text-slate-900">{p.company?.name ?? '—'}</span>
                  <span className="text-xs font-bold text-slate-400 mt-0.5">
                    {t(`fuelExchange.proposalState.${p.outcome}`)}
                  </span>
                  {/* FR-019a: the awarded proposal's contact is disclosed to the raiser
                      inline, since the raiser has many proposers rather than one
                      counterparty — a single sidebar card does not fit this shape. */}
                  {p.outcome === ProposalOutcome.AWARDED && p.company && (
                    <span className="text-xs font-semibold text-blue-600 mt-1" dir="ltr">
                      {p.company.contactPhone} · {p.company.contactEmail}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black text-slate-900" dir="ltr">
                    {p.unitPrice?.toFixed(2)} {p.currency}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{t('fuelExchange.unitPrice')}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black text-slate-900" dir="ltr">
                    {p.total?.toLocaleString()} {p.currency}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{t('fuelExchange.total')}</span>
                </div>
                {canAward && p.outcome === ProposalOutcome.PROPOSED && (
                  <button
                    onClick={() => void handleAward(p._id)}
                    disabled={award.isPending}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {t('fuelExchange.award')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
