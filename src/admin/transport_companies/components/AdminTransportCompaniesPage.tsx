import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdminTransportCompaniesStats } from './AdminTransportCompaniesStats';
import { AdminTransportCompanyListItem } from './AdminTransportCompanyListItem';
import { useTransportCompaniesList } from '@/admin/transport_companies/hooks/useTransportCompanies';
import { useTransportCompanyVolumes } from '@/admin/dashboard/hooks/usePlatformOverview';

/**
 * spec 017 (operator dashboard) US4 — every transport company on the platform.
 *
 * **The order-volume column is resolved in ONE call for the whole page**
 * (T070a, FR-026b), keyed on the ids actually rendered. A request per row would
 * be an N+1 over the platform's entire order collection on a screen the
 * operator opens constantly — which is exactly why the platform grew a batched
 * route for it rather than leaving the figure to "implementation time"
 * (research R14).
 */
export function AdminTransportCompaniesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: companies, isLoading, isError, refetch } = useTransportCompaniesList();
  const rows = companies ?? [];

  const volumes = useTransportCompanyVolumes({
    companyIds: rows.map((company) => company._id),
  });
  const volumeByCompany = new Map(
    (volumes.data?.items ?? []).map((item) => [item.companyId, item.orderCount]),
  );
  const totalOrders = volumes.data
    ? volumes.data.items.reduce((sum, item) => sum + item.orderCount, 0)
    : undefined;

  return (
    <div
      className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-[calc(100vh-6rem)]"
      dir="rtl"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col text-right">
          <h1 className="text-2xl font-black text-[#162155] mb-1">
            {t('adminDashboard.cards.transportCompanies')}
          </h1>
          <p className="text-sm font-semibold text-[#858C95]">
            {t('transportCompanies.subtitle')}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/transport-companies/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
        >
          <img src="/petrolCompany/transporters/plus.svg" alt="" className="w-4 h-4" />
          {t('transportCompanies.addTitle')}
        </button>
      </div>

      <AdminTransportCompaniesStats companies={rows} totalOrders={totalOrders} />

      <div className="bg-white border border-[#E7E9EF] rounded-2xl shadow-sm flex flex-col p-4 mb-8">
        {/* FR-076: loading, empty and failed each render distinctly. */}
        {isLoading && (
          <p className="py-16 text-center text-sm font-medium text-slate-400">
            {t('common.loading')}
          </p>
        )}

        {isError && (
          <div className="py-16 flex flex-col items-center gap-3">
            <p className="text-sm font-bold text-red-700">{t('transportCompanies.failed')}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {!isLoading && !isError && rows.length === 0 && (
          <p className="py-16 text-center text-sm font-medium text-slate-400">
            {t('transportCompanies.empty')}
          </p>
        )}

        {!isLoading && !isError && rows.length > 0 && (
          <div className="flex flex-col border border-slate-100 rounded-xl overflow-hidden">
            {rows.map((company, index) => (
              <AdminTransportCompanyListItem
                key={company._id}
                company={company}
                orderCount={volumeByCompany.get(company._id)}
                isLast={index === rows.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
