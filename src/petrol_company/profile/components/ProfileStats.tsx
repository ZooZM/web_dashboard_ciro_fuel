import { useTranslation } from 'react-i18next';
import { useFuelCompanySummary } from '@/petrol_company/dashboard/hooks/useSummary';
import { useTransporters } from '@/petrol_company/companies/hooks/useTransporters';

// Feature 013 T128/FR-048: "order volume (month)" dropped outright — no such aggregation
// exists on the platform (order *counts* by stage exist, via `FuelCompanySummaryDto`, but
// no litre-volume total). The other three are real: `stationOwnersCount`/`stationsCount`
// reuse the same summary Phase 10 already wired; partner transporters come from
// `useTransporters` (Phase 7).
export function ProfileStats() {
  const { t } = useTranslation();
  const { data: summary } = useFuelCompanySummary();
  const { data: transporters } = useTransporters();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4 w-full">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
          <img src="/petrolCompany/owner/user.svg" alt="" className="w-6 h-6 object-contain" />
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[#858C95] font-bold text-xs">{t('profile.stationOwnersCount')}</span>
          <span className="text-[#162155] font-black text-xl">{summary?.stationOwnersCount ?? '—'}</span>
        </div>
      </div>

      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4 w-full">
        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
          <img src="/transportCompany/HelpPage/station.svg" alt="" className="w-6 h-6 object-contain" />
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[#858C95] font-bold text-xs">{t('profile.stationsCount')}</span>
          <span className="text-[#162155] font-black text-xl">{summary?.stationsCount ?? '—'}</span>
        </div>
      </div>

      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4 w-full">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
          <img src="/petrolCompany/greenTruck.svg" alt="" className="w-6 h-6 object-contain" />
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[#858C95] font-bold text-xs">{t('profile.transportersCount')}</span>
          <span className="text-[#162155] font-black text-xl">{transporters?.length ?? '—'}</span>
        </div>
      </div>
    </div>
  );
}
