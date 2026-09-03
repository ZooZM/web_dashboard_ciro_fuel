import { useTranslation } from 'react-i18next';
import type { Transporter } from '@/petrol_company/companies/api/transporters.api';

// Feature 013 T088/FR-048: "orders this month", "average delivery time" and "performance
// rating" removed outright — none of these are computed anywhere on the platform for a
// transporter. `servedRegions.length` is the only real figure this screen ever had.
export function CompanyDetailStats({ company }: { company: Transporter }) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-start gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
          <img src="/petrolCompany/transporters/details/bluePin.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs font-bold text-slate-400 mb-1">{t('companies.regionsCount')}</span>
          <span className="text-xl font-black text-slate-900">{company.servedRegions.length}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-start gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#F0FDF4] flex items-center justify-center shrink-0">
          <img src="/petrolCompany/transporters/details/detail.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs font-bold text-slate-400 mb-1">{t('common.active')}</span>
          <span className="text-xl font-black text-slate-900">{company.status === 'ACTIVE' ? t('common.active') : t('common.inactive')}</span>
        </div>
      </div>
    </div>
  );
}
