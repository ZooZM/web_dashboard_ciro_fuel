import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { FuelCompany } from '@/admin/petrol_companies/api/fuel-companies.api';

interface AdminPetrolCompanyListItemProps {
  company: FuelCompany;
  isLast?: boolean;
}

// Feature 013 T236/FR-087: real `FuelCompany` data. `ownersCount`/`stationsCount`/
// `requestsPerMonth` had no real per-company aggregate source at the LIST level (an
// N+1 query the backend has no endpoint for) and are dropped rather than fabricated —
// the operator sees those real figures once they open a company (T238).
export function AdminPetrolCompanyListItem({ company, isLast }: AdminPetrolCompanyListItemProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isActive = company.status === 'ACTIVE';

  return (
    <div className={cn(
      "flex flex-col md:flex-row items-center justify-between p-4 gap-4 transition-colors hover:bg-slate-50",
      !isLast && "border-b border-slate-100"
    )}>
      <div className="flex items-center gap-3 w-full md:w-[250px] shrink-0">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 font-black">
          {company.name.charAt(0)}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-900 leading-tight mb-0.5">{company.name}</span>
          <span className="text-[10px] font-bold text-slate-400" dir="ltr">{company.contactEmail}</span>
        </div>
      </div>

      <div className="flex items-center justify-center bg-gray-100 rounded-2xl px-6 py-2.5 w-full flex-1 max-w-[400px] mx-auto">
        <div className={cn(
          "px-4 py-1.5 rounded-xl text-xs font-bold shrink-0",
          isActive ? "bg-green-100/50 text-green-600" : "bg-red-100/50 text-red-500"
        )}>
          {isActive ? t('adminCompanies.active') : t('adminCompanies.suspended')}
        </div>
      </div>

      <div className="w-full md:w-auto flex justify-end shrink-0">
        <button
          onClick={() => navigate(`/admin/petrol-companies/${company._id}`)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-blue-100 text-blue-600 bg-white hover:bg-blue-50 transition-colors w-full md:w-auto shadow-sm"
        >
          <img src="/petrolCompany/station/arrowRight.svg" alt="" className="w-4 h-4" />
          <span className="text-xs font-bold">{t('adminCompanies.viewDetails')}</span>
        </button>
      </div>
    </div>
  );
}
