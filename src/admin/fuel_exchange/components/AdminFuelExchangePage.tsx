import { useTranslation } from 'react-i18next';
import { FuelExchangeStats } from '@/petrol_company/fuel_exchange/components/FuelExchangeStats';
import { AdminFuelExchangeListItem } from './AdminFuelExchangeListItem';
import { useExchangeRequestsList } from '@/petrol_company/fuel_exchange/hooks/useFuelExchange';
import { ExchangeRequestState } from '@/constants/fuel-company';
import { useFuelCompaniesList } from '@/admin/petrol_companies/hooks/useFuelCompanies';

// Feature 013 T242/FR-089: real `GET /fuel-exchange/requests` (SUPER_ADMIN sees every
// request, direction ignored — see `AdminFuelExchangeListItem.tsx`'s own comment on why
// this screen must never be read as proof the party-set isolation mechanism works,
// R3/quickstart 3.3). Company names for the raiser/recipient columns come from `GET
// /companies?type=FUEL` (already fetched for the companies list, T236) — the exchange
// list endpoint itself returns ids only.
export function AdminFuelExchangePage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useExchangeRequestsList('all');
  const { data: companies } = useFuelCompaniesList();

  const companyNameById = new Map((companies ?? []).map((c) => [c._id, c.name]));
  const items = data?.items ?? [];
  const awaitingCount = items.filter((r) => r.state === ExchangeRequestState.AWAITING_RESPONSE).length;
  const acceptedCount = items.filter((r) => r.state === ExchangeRequestState.ACCEPTED).length;

  const STAT_CARDS = [
    {
      title: t('fuelExchange.filterAll'),
      value: String(items.length),
      icon: '/petrolCompany/requests/arrowUp.svg',
      iconBgClass: 'bg-blue-50',
      valueColor: 'text-slate-900',
      titleColor: 'text-slate-500',
    },
    {
      title: t('fuelExchange.state.AWAITING_RESPONSE'),
      value: String(awaitingCount),
      icon: '/petrolCompany/requests/arrowDown.svg',
      iconBgClass: 'bg-orange-50',
      valueColor: 'text-slate-900',
      titleColor: 'text-slate-500',
    },
    {
      title: t('fuelExchange.state.ACCEPTED'),
      value: String(acceptedCount),
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
          <p className="text-sm font-semibold text-slate-500 mt-1">{t('adminCompanies.exchangeOversightSubtitle')}</p>
        </div>
      </div>

      <FuelExchangeStats cards={STAT_CARDS} />

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-6">
        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('common.loading')}</p>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <p className="text-sm text-red-500">{t('fuelExchange.loadError')}</p>
            <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
              {t('common.retry')}
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('fuelExchange.empty')}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((req) => (
              <AdminFuelExchangeListItem key={req._id} request={req} companyNameById={companyNameById} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
