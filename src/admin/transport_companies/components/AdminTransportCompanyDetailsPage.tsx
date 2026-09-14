import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdminCompanyAdminCard } from '@/admin/petrol_companies/components/AdminCompanyAdminCard';
import { Role } from '@/constants/roles';
import { AdminTransportCompanyInfoCard } from './AdminTransportCompanyInfoCard';
import { AdminCompanyDriversCard } from './AdminCompanyDriversCard';
import { cn } from '@/lib/utils';
import { CompanyStatus } from '@/constants/order-status';
import {
  useSetTransportCompanyStatus,
  useTransportCompanyDetail,
} from '@/admin/transport_companies/hooks/useTransportCompanyMutations';
import { useTransportCompanyVolumes } from '@/admin/dashboard/hooks/usePlatformOverview';

/**
 * spec 017 (operator dashboard) T071/T073/T074/US4 — one transport company in
 * full.
 *
 * **The performance-rating and average-delivery-time cards are REMOVED**
 * (FR-037, FR-078, and recorded in this feature's Removals table). Neither has
 * a data source: the platform rates DRIVERS (`User.ratingAverage`, via
 * `DeliveryRating`) and has never rated a transport COMPANY, and it records no
 * per-company delivery duration anywhere — `deliveredAt` exists, but no
 * corresponding "started" timestamp that would make a duration meaningful
 * across the platform's stages. Both were literals (`4.7`, `27 د`).
 *
 * Suspend and reinstate call the EXISTING `PATCH /companies/:id/status`, which
 * is already operator-only and already type-agnostic — this story needed no
 * backend change for it at all (FR-033). The previous button only flipped local
 * `useState`, so it appeared to work and changed nothing.
 */
export function AdminTransportCompanyDetailsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id: companyId } = useParams<{ id: string }>();

  const { data: company, isLoading, isError, refetch } = useTransportCompanyDetail(companyId);
  const setStatus = useSetTransportCompanyStatus();

  const volumes = useTransportCompanyVolumes({
    companyIds: companyId ? [companyId] : [],
  });
  const orderCount = volumes.data?.items[0]?.orderCount;

  const isActive = company?.status === CompanyStatus.ACTIVE;

  return (
    <div
      className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full border border-[#E7E9EF] rounded-2xl"
      dir="rtl"
    >
      <div
        className="flex items-center gap-2 mb-6 cursor-pointer w-fit"
        onClick={() => navigate('/admin/transport-companies')}
      >
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E9EF] rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img
            src="/petrolCompany/requests/details/chevronRight.svg"
            alt=""
            className="w-4 h-4"
          />
        </button>
        <span className="text-sm font-semibold text-slate-500">{t('common.back')}</span>
      </div>

      {isLoading && (
        <div className="h-24 rounded-2xl bg-white border border-slate-200 animate-pulse mb-6" />
      )}

      {isError && (
        <div className="bg-white border border-red-200 rounded-2xl p-6 text-right mb-6">
          <p className="text-sm font-bold text-red-700 mb-3">
            {t('transportCompanies.failed')}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold"
          >
            {t('common.retry')}
          </button>
        </div>
      )}

      {company && (
        <>
          {/* Header */}
          <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shrink-0 border-2 border-white shadow-sm overflow-hidden p-2">
                <img
                  src="/petrolCompany/transporters/details/truck.svg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col text-right">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-[#162155]">{company.name}</span>
                  <span
                    className={cn(
                      'px-4 py-1.5 rounded-xl text-xs font-bold',
                      isActive
                        ? 'bg-green-100/50 text-green-600'
                        : 'bg-red-50 text-red-600',
                    )}
                  >
                    {isActive ? t('companies.active') : t('companies.suspended')}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-400 mt-0.5">
                  {new Date(company.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* FR-033 — the real route, not local state. */}
              <button
                disabled={setStatus.isPending || !companyId}
                onClick={() =>
                  companyId &&
                  setStatus.mutate({
                    id: companyId,
                    status: isActive ? CompanyStatus.SUSPENDED : CompanyStatus.ACTIVE,
                  })
                }
                className={cn(
                  'px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50',
                  isActive
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 shadow-sm'
                    : 'bg-green-100 text-green-600 hover:bg-green-200 border border-[#E7E9EF] shadow-sm',
                )}
              >
                {isActive ? t('drivers.suspend') : t('drivers.reinstate')}
              </button>
            </div>
          </div>

          {/*
            TWO cards, not four. The performance rating and average delivery
            time are removed — see this file's own note.
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <StatBox
              label={t('transportCompanies.coveredAreas')}
              value={company.servedRegions?.length ?? 0}
              icon="/petrolCompany/requests/pin.svg"
              iconBg="bg-blue-50"
            />
            <StatBox
              label={t('transportCompanies.orderVolume')}
              value={orderCount}
              icon="/Admin/Brands/order.svg"
              iconBg="bg-orange-50"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 w-full flex flex-col gap-6">
              <AdminTransportCompanyInfoCard company={company} />
              {companyId && (
                <AdminCompanyAdminCard
                  companyId={companyId}
                  role={Role.TRANSPORT_COMPANY_ADMIN}
                />
              )}
              {companyId && <AdminCompanyDriversCard companyId={companyId} />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  icon,
  iconBg,
}: {
  label: string;
  value: number | undefined;
  icon: string;
  iconBg: string;
}) {
  return (
    <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
      <div className="flex flex-col text-right order-2">
        <span className="text-[#858C95] text-xs font-bold mb-1">{label}</span>
        <span className="text-[#162155] text-2xl font-black">
          {value === undefined ? '—' : value.toLocaleString()}
        </span>
      </div>
      <div
        className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center shrink-0 order-1`}
      >
        <img src={icon} alt="" className="w-6 h-6 object-contain" />
      </div>
    </div>
  );
}
