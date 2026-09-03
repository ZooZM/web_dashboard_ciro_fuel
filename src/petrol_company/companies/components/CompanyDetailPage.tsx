import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CompanyDetailStats } from './CompanyDetailStats';
import { CompanyRegionsCard } from './CompanyRegionsCard';
import { CompanyContactCard } from './CompanyContactCard';
import { CompanyRecentTripsCard } from './CompanyRecentTripsCard';
import { useTransporterDetail } from '@/petrol_company/companies/hooks/useTransporters';

// Feature 013 T086/T087/FR-035/FR-036: wired to `GET /companies/:id`. The mock's "cancel
// contract" button had no capability behind it — `PATCH /companies/:id/status` is
// SUPER_ADMIN-only, so a Fuel Company admin cannot suspend a transporter directly;
// dropped rather than wired to a route that would 403.
export function CompanyDetailPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: company, isLoading, isError } = useTransporterDetail(id ?? '');

  if (isLoading) {
    return <div className="p-6 text-center text-sm text-slate-400">{t('common.loading')}</div>;
  }
  if (isError || !company) {
    return <div className="p-6 text-center text-sm text-red-500">{t('companies.loadError')}</div>;
  }

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full border border-[#E7E9EF] rounded-2xl" dir="rtl">

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={() => navigate('/petrolCompany/companies')}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/transporters/details/chevronRight.svg" alt="Back" className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          {t('nav.companies')} / {company.name}
        </span>
      </div>

      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 shadow-sm shadow-blue-200">
            <img src="/petrolCompany/transporters/details/truck.svg" alt="Logo" className="w-7 h-7" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900">{company.name}</span>
              <span className={
                company.status === 'ACTIVE'
                  ? "px-4 py-2 bg-[#DCFCE7] text-[#16A34A] rounded-xl text-sm font-bold border border-green-100"
                  : "px-4 py-2 bg-[#FEF2F2] text-[#DC2626] rounded-xl text-sm font-bold border border-red-100"
              }>
                {company.status === 'ACTIVE' ? t('common.active') : t('common.inactive')}
              </span>
            </div>
            <span className="text-sm font-bold text-slate-400 mt-0.5">
              {company._id} · {new Date(company.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <CompanyDetailStats company={company} />

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full flex flex-col gap-6">
          <CompanyRegionsCard company={company} />
        </div>

        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 self-start">
          <CompanyContactCard company={company} />
          <CompanyRecentTripsCard />
        </div>
      </div>
    </div>
  );
}
