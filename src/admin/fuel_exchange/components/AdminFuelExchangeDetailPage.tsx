import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOffer } from '@/petrol_company/fuel_exchange/hooks/useFuelExchange';
import { FUEL_TYPE_LABEL_KEY } from '@/constants/order-status';
import { governorateLabel } from '@/constants/regions';
import type { GovernorateCode } from '@/constants/regions';
import { ExchangeOfferState, ProposalOutcome } from '@/constants/fuel-company';

/**
 * spec 016 (broadcast fuel exchange offers) T100/FR-023/FR-091 — real
 * `GET /fuel-exchange/offers/:id`. No propose/award/withdraw control anywhere — those are
 * `FUEL_COMPANY_ADMIN`-only (the backend `@Roles` decorators are the actual enforcement;
 * this screen simply never renders a control the operator has no route to use). Company
 * names and every proposal are already on the payload for a `SUPER_ADMIN` viewer
 * (`buildDetail`'s own `isSuperAdmin` branch) — no separate `GET /companies` lookup
 * needed, unlike the directed model's version of this screen.
 */
export function AdminFuelExchangeDetailPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: offer, isLoading, isError, refetch } = useOffer(id ?? '');

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

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full border border-[#E7E9EF] rounded-2xl" dir="rtl">
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={() => navigate('/admin/fuel-exchange')}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/requests/details/chevronRight.svg" alt="" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">{t('fuelExchange.title')}</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm flex items-center justify-between">
        <span className="text-lg font-black text-slate-900">{offer.raisedByCompanyName}</span>
        <span
          className={
            offer.state === ExchangeOfferState.AWARDED
              ? 'px-5 py-2.5 bg-[#DCFCE7] text-[#16A34A] rounded-xl text-sm font-bold'
              : 'px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold'
          }
        >
          {t(`fuelExchange.state.${offer.state}`)}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-6">{t('fuelExchange.offerDetails')}</h2>
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-right">
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.quantity')}</span>
              <span className="text-base font-black text-slate-900">{offer.quantityLitres.toLocaleString()} {t('fuelExchange.litres')}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.fuelType')}</span>
              <span className="text-base font-black text-slate-900">{t(FUEL_TYPE_LABEL_KEY[offer.fuelType])}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.city')}</span>
              <span className="text-base font-black text-slate-900">{governorateLabel(offer.city as GovernorateCode, i18n.language)}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.deliveryDate')}</span>
              <span className="text-sm font-black text-slate-900">{new Date(offer.deliveryAt).toLocaleString(i18n.language)}</span>
            </div>
            {offer.agreedUnitPrice !== undefined && (
              <>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.unitPrice')}</span>
                  <span className="text-base font-black text-slate-900">{offer.agreedUnitPrice.toFixed(2)} {offer.currency}</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.total')}</span>
                  <span className="text-base font-black text-slate-900">{offer.agreedTotal?.toLocaleString()} {offer.currency}</span>
                </div>
              </>
            )}
          </div>

          {offer.proposals && offer.proposals.length > 0 && (
            <>
              <div className="h-px w-full bg-slate-100 my-6" />
              <h3 className="text-sm font-black text-slate-900 mb-4">{t('fuelExchange.proposals')}</h3>
              <div className="flex flex-col gap-3">
                {offer.proposals.map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                    <span className="text-sm font-black text-slate-900">{p.company?.name ?? '—'}</span>
                    <div className="flex items-center gap-4">
                      {p.unitPrice !== undefined && (
                        <span className="text-sm font-black text-slate-900" dir="ltr">{p.unitPrice.toFixed(2)} {p.currency}</span>
                      )}
                      <span className="text-xs font-bold text-slate-500">
                        {t(`fuelExchange.proposalState.${p.outcome}`)}
                        {p.outcome === ProposalOutcome.AWARDED ? ' ✓' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
