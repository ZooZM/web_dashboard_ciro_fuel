import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FUEL_TYPE_LABEL_KEY } from '@/constants/order-status';
import { ExchangeOfferState } from '@/constants/fuel-company';
import type { OfferListItem as OfferListItemData } from '@/petrol_company/fuel_exchange/api/fuel-exchange.api';

interface FuelExchangeListItemProps {
  offer: OfferListItemData;
}

const STATE_BADGE_CLASS: Record<string, string> = {
  [ExchangeOfferState.OPEN]: 'bg-blue-50 text-blue-600',
  [ExchangeOfferState.AWARDED]: 'bg-green-50 text-green-600',
  [ExchangeOfferState.WITHDRAWN]: 'bg-slate-100 text-slate-500',
  [ExchangeOfferState.CLOSED_NO_AWARD]: 'bg-slate-100 text-slate-500',
};

/**
 * spec 016 (broadcast fuel exchange offers) T044 — rebuilt for offer states. No price is
 * ever shown for an OPEN offer (none exists yet — FR-005a); `agreedUnitPrice`/`agreedTotal`
 * appear only once the payload itself carries them (the raiser or the awarded company),
 * and `proposalCount`/`declineCount` only for the raiser's own outgoing items (FR-021a) —
 * never a stripped/derived value, exactly what the backend sent.
 */
export function FuelExchangeListItem({ offer }: FuelExchangeListItemProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const created = new Date(offer.createdAt);
  const isRaiserView = offer.proposalCount !== undefined;
  const hasAgreedFigures = offer.agreedUnitPrice !== undefined;

  return (
    <div
      onClick={() => navigate(`/petrolCompany/fuel-exchange/${offer._id}`)}
      className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 border border-slate-200 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all bg-white cursor-pointer"
    >
      <div className="flex items-center gap-4 w-full xl:w-auto xl:min-w-[200px]">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 font-black">
          {offer.raisedByCompanyName.charAt(0)}
        </div>
        <div className="flex flex-col">
          <span className="font-black text-slate-900">{offer.raisedByCompanyName}</span>
          <span className="text-xs text-slate-500 font-bold mt-0.5">{t(FUEL_TYPE_LABEL_KEY[offer.fuelType])}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 w-full xl:w-auto bg-slate-50/50 rounded-xl p-3 border border-slate-100">
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm font-black text-slate-900">{offer.quantityLitres.toLocaleString()}</span>
          <span className="text-xs text-slate-500 mt-1 font-semibold">{t('fuelExchange.litres')}</span>
        </div>
        <div className="flex flex-col items-center justify-center md:border-r border-slate-200">
          <span className="text-sm font-black text-slate-900">
            {new Date(offer.deliveryAt).toLocaleDateString(i18n.language)}
          </span>
          <span className="text-xs text-slate-500 mt-1 font-semibold">{t('fuelExchange.deliveryDate')}</span>
        </div>
        {hasAgreedFigures ? (
          <>
            <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-r border-slate-200 pt-3 md:pt-0">
              <span className="text-sm font-black text-slate-900" dir="ltr">
                {offer.agreedUnitPrice!.toFixed(2)} {offer.currency}
              </span>
              <span className="text-xs text-slate-500 mt-1 font-semibold">{t('fuelExchange.unitPrice')}</span>
            </div>
            <div className="flex flex-col items-center justify-center md:border-r border-slate-200 border-t md:border-t-0 pt-3 md:pt-0">
              <span className="text-sm font-black text-slate-900" dir="ltr">
                {offer.agreedTotal!.toLocaleString()} {offer.currency}
              </span>
              <span className="text-xs text-slate-500 mt-1 font-semibold">{t('fuelExchange.total')}</span>
            </div>
          </>
        ) : isRaiserView ? (
          <>
            <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-r border-slate-200 pt-3 md:pt-0">
              <span className="text-sm font-black text-slate-900">{offer.proposalCount}</span>
              <span className="text-xs text-slate-500 mt-1 font-semibold">{t('fuelExchange.proposalCount')}</span>
            </div>
            <div className="flex flex-col items-center justify-center md:border-r border-slate-200 border-t md:border-t-0 pt-3 md:pt-0">
              <span className="text-sm font-black text-slate-900">{offer.declineCount}</span>
              <span className="text-xs text-slate-500 mt-1 font-semibold">{t('fuelExchange.declineCount')}</span>
            </div>
          </>
        ) : null}
      </div>

      <div className="flex items-center justify-between w-full xl:w-auto gap-8 xl:min-w-[180px]">
        <div className="flex flex-col items-start xl:items-end">
          <span className="text-sm font-bold text-slate-600">{created.toLocaleDateString(i18n.language)}</span>
          <span className="text-xs text-slate-400 font-bold mt-0.5">{created.toLocaleTimeString(i18n.language)}</span>
        </div>

        <div className="min-w-[110px] flex justify-end">
          <span className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${STATE_BADGE_CLASS[offer.state]}`}>
            {t(`fuelExchange.state.${offer.state}`)}
          </span>
        </div>
      </div>
    </div>
  );
}
