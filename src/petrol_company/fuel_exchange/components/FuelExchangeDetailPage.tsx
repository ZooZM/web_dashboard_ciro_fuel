import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FuelExchangeContactInfo } from './FuelExchangeContactInfo';
import { OfferProposalsPanel } from './OfferProposalsPanel';
import { ProposeDialog } from './ProposeDialog';
import { useOffer, useWithdrawOffer } from '@/petrol_company/fuel_exchange/hooks/useFuelExchange';
import { useSessionStore } from '@/stores/session.store';
import { apiErrorMessage } from '@/lib/api/error-messages';
import { FUEL_TYPE_LABEL_KEY } from '@/constants/order-status';
import { governorateLabel } from '@/constants/regions';
import type { GovernorateCode } from '@/constants/regions';
import { ExchangeOfferState } from '@/constants/fuel-company';

/**
 * spec 016 (broadcast fuel exchange offers) T075 — rebuilt for the offer/proposal model
 * and the disclosure rules `contracts/rest-api-delta.md`'s own table states. Folds
 * `FuelExchangeRequestData.tsx` (deleted, T099) directly in, since a market offer has no
 * single "counterparty" whose terms belong on a separate component the way the directed
 * model's two-party shape did.
 */
export function FuelExchangeDetailPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const user = useSessionStore((s) => s.user);
  const { data: offer, isLoading, isError, refetch } = useOffer(id ?? '');
  const withdraw = useWithdrawOffer(id ?? '');
  const [isProposing, setIsProposing] = useState(false);

  if (isLoading) {
    return <div className="p-6 text-center text-sm text-slate-400">{t('common.loading')}</div>;
  }
  if (isError || !offer) {
    return (
      <div className="p-6 flex flex-col items-center gap-3">
        <p className="text-sm text-red-500">{t('fuelExchange.loadError')}</p>
        <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
          {t('common.retry')}
        </button>
      </div>
    );
  }

  const isRaiser = offer.raisedByCompanyId === user?.companyId;
  const isOpen = offer.state === ExchangeOfferState.OPEN;
  // A non-raiser who has not yet answered, on an offer still open — FR-009 (never the
  // raiser answering its own offer), FR-011c (one answer per company, enforced by the
  // backend regardless, but there is nothing to show a second dialog for once
  // `myProposal` exists).
  const canPropose = !isRaiser && isOpen && !offer.myProposal;
  const canWithdraw = isRaiser && isOpen;

  async function handleWithdraw() {
    if (!window.confirm(t('fuelExchange.withdrawConfirm'))) return;
    try {
      await withdraw.mutateAsync();
      toast.success(t('fuelExchange.withdrawn'));
    } catch (err) {
      toast.error(apiErrorMessage(err, t));
    }
  }

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full border border-[#E7E9EF] rounded-2xl" dir="rtl">
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={() => navigate('/petrolCompany/fuel-exchange')}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/requests/details/chevronRight.svg" alt="" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          {t('fuelExchange.title')}
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 font-black text-xl">
            {offer.raisedByCompanyName.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900">{offer.raisedByCompanyName}</span>
            <span className="text-sm font-bold text-slate-400 mt-0.5">
              {new Date(offer.createdAt).toLocaleDateString(i18n.language)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canPropose ? (
            <button
              onClick={() => setIsProposing(true)}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              {t('fuelExchange.propose')}
            </button>
          ) : canWithdraw ? (
            <button
              onClick={() => void handleWithdraw()}
              disabled={withdraw.isPending}
              className="px-5 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {t('fuelExchange.withdraw')}
            </button>
          ) : (
            <span
              className={
                offer.state === ExchangeOfferState.AWARDED
                  ? 'px-5 py-2.5 bg-[#DCFCE7] text-[#16A34A] rounded-xl text-sm font-bold'
                  : 'px-5 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-sm font-bold'
              }
            >
              {t(`fuelExchange.state.${offer.state}`)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-start gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <img src="/petrolCompany/requests/details/details.svg" alt="" className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900">{t('fuelExchange.offerDetails')}</h2>
            </div>

            {offer.state === ExchangeOfferState.AWARDED && (
              <>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-right mb-6">
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.unitPrice')}</span>
                    <span className="text-base font-black text-slate-900">
                      {offer.agreedUnitPrice?.toFixed(2)} {offer.currency}
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.total')}</span>
                    <span className="text-base font-black text-slate-900">
                      {offer.agreedTotal?.toLocaleString()} {offer.currency}
                    </span>
                  </div>
                </div>
                <div className="h-px w-full bg-slate-100 mb-6" />
              </>
            )}

            {offer.myProposal && (
              <>
                <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/60 border border-blue-100 mb-6">
                  <span className="text-sm font-bold text-slate-700">{t('fuelExchange.yourProposal')}</span>
                  <span className="text-sm font-black text-slate-900">
                    {offer.myProposal.unitPrice !== undefined
                      ? `${offer.myProposal.unitPrice.toFixed(2)} ${offer.myProposal.currency ?? ''}`
                      : t(`fuelExchange.proposalState.${offer.myProposal.outcome}`)}
                  </span>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-right">
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.quantity')}</span>
                <span className="text-base font-black text-slate-900">
                  {offer.quantityLitres.toLocaleString()} {t('fuelExchange.litres')}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.fuelType')}</span>
                <span className="text-base font-black text-slate-900">{t(FUEL_TYPE_LABEL_KEY[offer.fuelType])}</span>
              </div>
            </div>

            <div className="h-px w-full bg-slate-100 my-6" />

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-right">
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.city')}</span>
                <span className="text-sm font-black text-slate-900">
                  {governorateLabel(offer.city as GovernorateCode, i18n.language)}
                </span>
              </div>
              {offer.district && (
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.district')}</span>
                  <span className="text-sm font-black text-slate-900">{offer.district}</span>
                </div>
              )}
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.deliveryDate')}</span>
                <span className="text-sm font-black text-slate-900">
                  {new Date(offer.deliveryAt).toLocaleString(i18n.language)}
                </span>
              </div>
              {offer.locationUrl && (
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.locationUrl')}</span>
                  {/* FR-028: presented as unverified text/link — the platform validates
                      only the scheme (http/https), never the destination itself. */}
                  <a
                    href={offer.locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-black text-blue-600 hover:underline break-all"
                    dir="ltr"
                  >
                    {offer.locationUrl}
                  </a>
                  <span className="text-[11px] text-slate-400 font-semibold mt-0.5">{t('fuelExchange.unverifiedLink')}</span>
                </div>
              )}
              {offer.notes && (
                <div className="flex flex-col items-start col-span-2">
                  <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.notes')}</span>
                  <span className="text-sm font-black text-slate-900 whitespace-pre-wrap">{offer.notes}</span>
                </div>
              )}
            </div>
          </div>

          <OfferProposalsPanel offer={offer} />
        </div>

        {offer.raiserContact && (
          <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 self-start">
            <FuelExchangeContactInfo contact={offer.raiserContact} />
          </div>
        )}
      </div>

      {isProposing && id && (
        <ProposeDialog offerId={id} onClose={() => setIsProposing(false)} onSubmitted={() => setIsProposing(false)} />
      )}
    </div>
  );
}
