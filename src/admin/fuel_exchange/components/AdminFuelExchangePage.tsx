import { useTranslation } from 'react-i18next';
import { FuelExchangeStats } from '@/petrol_company/fuel_exchange/components/FuelExchangeStats';
import { AdminFuelExchangeListItem } from './AdminFuelExchangeListItem';
import { useOffersList } from '@/petrol_company/fuel_exchange/hooks/useFuelExchange';
import { ExchangeOfferState } from '@/constants/fuel-company';

/**
 * spec 016 (broadcast fuel exchange offers) T100/FR-023 — real `GET /fuel-exchange/offers`
 * (`SUPER_ADMIN` bypasses the isolation plugin entirely and sees every offer, direction
 * ignored server-side — see `AdminFuelExchangeListItem.tsx`'s own comment on why this
 * screen must never be read as proof the isolation mechanism works). `GET
 * /fuel-exchange/offers/summary` is FCA-only (a fuel company's own scoped counts have no
 * meaning for a platform operator with no company of its own), so these three cards are
 * counted from the loaded page — the same limitation the directed-model version had,
 * acceptable for oversight rather than billing.
 */
export function AdminFuelExchangePage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useOffersList('all');

  const items = data?.items ?? [];
  const openCount = items.filter((o) => o.state === ExchangeOfferState.OPEN).length;
  const awardedCount = items.filter((o) => o.state === ExchangeOfferState.AWARDED).length;

  const STAT_CARDS = [
    {
      title: 'طلبات واردة بانتظار الرد',
      value: String(items.length),
      icon: '/petrolCompany/requests/arrowUp.svg',
      iconBgClass: 'bg-blue-50',
      valueColor: 'text-slate-900',
      titleColor: 'text-slate-500',
    },
    {
      title: 'طلبات صادرة قيد الانتظار',
      value: String(openCount),
      icon: '/petrolCompany/requests/arrowDown.svg',
      iconBgClass: 'bg-orange-50',
      valueColor: 'text-slate-900',
      titleColor: 'text-slate-500',
    },
    {
      title: 'تم القبول (الشهر)',
      value: String(awardedCount),
      icon: '/petrolCompany/requests/rightCheck.svg',
      iconBgClass: 'bg-emerald-50',
      valueColor: 'text-slate-900',
      titleColor: 'text-slate-500',
    },
  ];

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] min-h-full font-sans border border-[#E7E9EF] rounded-2xl" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col items-start text-right">
          <h1 className="text-2xl font-black text-slate-900">{t('fuelExchange.title')}</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">طلبات توريد وقود بين شركات البترول الشريكة</p>
        </div>
      </div>

      <FuelExchangeStats cards={STAT_CARDS} />

      <div className="mb-4 relative w-full md:w-1/3">
        <input
          type="text"
          placeholder="ابحث بكود أو إسم المالك..."
          className="w-full bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500 font-semibold"
        />
        <img src="/petrolCompany/requests/search.svg" alt="" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-6">
        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('common.loading')}</p>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <p className="text-sm text-red-500">{t('fuelExchange.loadError')}</p>
            <button onClick={() => void refetch()} className="text-sm font-bold text-blue-600 hover:underline">
              {t('common.retry')}
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('fuelExchange.empty')}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((offer) => (
              <AdminFuelExchangeListItem key={offer._id} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
