import { useTranslation } from 'react-i18next';
import { CompanyStatus } from '@/constants/order-status';
import type { FuelCompany } from '@/admin/petrol_companies/api/fuel-companies.api';

interface AdminPetrolCompaniesStatsProps {
  companies: FuelCompany[];
}

// Feature 013 T236/FR-087: real figures computed from the fetched company list — no
// per-company owners/stations/monthly-requests aggregate exists on the backend (that
// would be an N+1 query with no endpoint behind it), so those three cards are dropped
// rather than fabricated. The operator sees those real per-company figures once they
// open a company (T238), where a single query genuinely answers them.
// spec 017 T016/FR-014 — VERIFIED: every figure here is derived from the SAME array the
// list renders, which is the single `?type=FUEL` result. There is no second, unfiltered
// call behind the count card, so the card and the rows beneath it cannot disagree. That
// mattered more than it looked: until spec 017 the backend ignored `type` entirely, so
// this total has been the platform's whole company count — transporters included — since
// feature 013, while the rows it sat above were the same (also unfiltered) list.
export function AdminPetrolCompaniesStats({ companies }: AdminPetrolCompaniesStatsProps) {
  const { t } = useTranslation();
  const activeCount = companies.filter((c) => c.status === CompanyStatus.ACTIVE).length;
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
