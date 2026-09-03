import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { StationOwner } from '@/admin/petrol_companies/api/fuel-companies.api';

interface AdminOwnerListItemProps {
  owner: StationOwner;
  isLast?: boolean;
}

// Feature 013 T238/FR-089: real `StationOwner` data (`GET /users?role=CLIENT&companyId=`).
// `stationsCount`/`ordersPerMonth` had no real per-owner source without an N+1 query and
// are dropped rather than fabricated.
export function AdminOwnerListItem({ owner, isLast }: AdminOwnerListItemProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={cn(
      "flex flex-col md:flex-row items-center justify-between p-4 gap-4 transition-colors hover:bg-slate-50",
      !isLast && "border-b border-slate-100"
    )}>
      <div className="flex items-center gap-3 w-full md:w-[250px] shrink-0">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 font-black">
          {owner.fullName.charAt(0)}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-900 leading-tight mb-0.5">{owner.fullName}</span>
          <span className="text-[10px] font-bold text-slate-400" dir="ltr">{owner.phone}</span>
        </div>
      </div>

      <div className="flex items-center justify-center bg-gray-100 rounded-2xl p-3 flex-1 max-w-[300px] mx-auto">
        <div className={cn(
          "px-4 py-2 rounded-xl text-xs font-bold border",
          owner.isActive
            ? "bg-green-100/50 text-green-600 border-green-100"
            : "bg-red-50 text-red-500 border-red-100"
        )}>
          {owner.isActive ? t('adminCompanies.active') : t('adminCompanies.inactive')}
        </div>
      </div>

      <div className="w-full md:w-auto flex justify-end shrink-0">
        <button
          onClick={() => navigate(`/admin/petrol-companies/owners/${owner._id}`)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-blue-100 text-blue-600 bg-white hover:bg-blue-50 transition-colors w-full md:w-auto shadow-sm"
        >
          <img src="/petrolCompany/station/arrowRight.svg" alt="" className="w-4 h-4" />
          <span className="text-xs font-bold">{t('adminCompanies.viewDetails')}</span>
        </button>
      </div>
    </div>
  );
}
