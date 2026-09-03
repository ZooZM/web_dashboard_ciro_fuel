import { useTranslation } from 'react-i18next';

interface StationListStatsProps {
  ownersCount: number;
  activeOwnersCount: number;
  stationsCount: number;
  pendingCreditRequestsCount: number;
}

// Phase 6 (US3): every figure here is now a real, live count — no fabricated monthly
// trend (no such aggregation exists on the platform, same reasoning `OrdersListPage`'s
// header comment already documents for order-level stats, FR-047).
export function StationListStats({
  ownersCount,
  activeOwnersCount,
  stationsCount,
  pendingCreditRequestsCount,
}: StationListStatsProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
          <img src="/petrolCompany/station/group.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-slate-500 mb-1">{t('owners.title')}</span>
          <span className="text-2xl font-black text-slate-900">{ownersCount}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
          <img src="/petrolCompany/station/gunStation.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-slate-500 mb-1">{t('common.active')}</span>
          <span className="text-2xl font-black text-slate-900">{activeOwnersCount}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
          <img src="/petrolCompany/station/orangeStation.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-slate-500 mb-1">{t('stations.title')}</span>
          <span className="text-2xl font-black text-slate-900">{stationsCount}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <img src="/petrolCompany/station/order.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-slate-500 mb-1">{t('creditLimitRequests.title')}</span>
          <span className="text-2xl font-black text-slate-900">{pendingCreditRequestsCount}</span>
        </div>
      </div>

    </div>
  );
}
