import { useTranslation } from 'react-i18next';
import type { FuelCompany } from '@/admin/petrol_companies/api/fuel-companies.api';

interface AdminPetrolCompaniesStatsProps {
  companies: FuelCompany[];
}

// Feature 013 T236/FR-087: real figures computed from the fetched company list — no
// per-company owners/stations/monthly-requests aggregate exists on the backend (that
// would be an N+1 query with no endpoint behind it), so those three cards are dropped
// rather than fabricated. The operator sees those real per-company figures once they
// open a company (T238), where a single query genuinely answers them.
export function AdminPetrolCompaniesStats({ companies }: AdminPetrolCompaniesStatsProps) {
  const { t } = useTranslation();
  const activeCount = companies.filter((c) => c.status === 'ACTIVE').length;
  const suspendedCount = companies.length - activeCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 justify-start">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
          <img src="/Admin/Brands/home.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-slate-500 mb-1">{t('adminCompanies.totalCompanies')}</span>
          <span className="text-2xl font-black text-slate-900">{companies.length}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 justify-start">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
          <img src="/Admin/Brands/station.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-slate-500 mb-1">{t('adminCompanies.active')}</span>
          <span className="text-2xl font-black text-slate-900">{activeCount}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 justify-start">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <img src="/petrolCompany/station/order.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-slate-500 mb-1">{t('adminCompanies.suspended')}</span>
          <span className="text-2xl font-black text-slate-900">{suspendedCount}</span>
        </div>
      </div>
    </div>
  );
}
