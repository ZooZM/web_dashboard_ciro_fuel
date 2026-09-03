import { useTranslation } from 'react-i18next';

interface CompanyListStatsProps {
  totalCount: number;
  activeCount: number;
  servedRegionsCount: number;
}

// Feature 013 T084/FR-048: "orders/month across transporters" dropped — no such
// aggregation exists anywhere on the platform. The third stat is the union of every
// transporter's own `servedRegions` — distinct from `Company.coveredRegions` (the regions
// THIS fuel company covers itself), which has its own editable card below the list.
export function CompanyListStats({ totalCount, activeCount, servedRegionsCount }: CompanyListStatsProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 gap-4 flex items-center justify-start shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
          <img src="/petrolCompany/transporters/blueTruck.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs font-bold text-slate-400 mb-1">{t('nav.companies')}</span>
          <span className="text-xl font-black text-slate-900">{totalCount}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 gap-4 flex items-center justify-start shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#FFF7ED] flex items-center justify-center shrink-0">
          <img src="/petrolCompany/transporters/orangTruck.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs font-bold text-slate-400 mb-1">{t('common.active')}</span>
          <span className="text-xl font-black text-slate-900">{activeCount}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 gap-4 flex items-center justify-start shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
          <img src="/petrolCompany/transporters/pin.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs font-bold text-slate-400 mb-1">{t('companies.servedRegions')}</span>
          <span className="text-xl font-black text-slate-900">{servedRegionsCount}</span>
        </div>
      </div>
    </div>
  );
}
