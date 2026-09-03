import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/stores/session.store';
import { StatCard } from '@/transport_company/home/components/StatCard';
import { ActionCard } from '@/transport_company/home/components/ActionCard';
import { DateRangePopup } from '@/components/ui/date-range-popup';
import { useFuelCompanySummary } from '@/petrol_company/dashboard/hooks/useSummary';

// Feature 013 T113-T116/FR-044/FR-046/FR-047/FR-048/FR-051: wired to
// `GET /orders/summary` (FUEL_COMPANY_ADMIN shape). Every week-over-week trend
// (`"…% من الأسبوع الماضي"`) is gone — no historical baseline exists to compute one from,
// and a fabricated trend is indistinguishable from a real one. The reused
// `NewOrdersCard`/`ProgressOrdersCard`/`MapTrackingCard`/`InvoicesSection`/
// `DoughnutSection` (transport-company home components, fleet-position and per-status
// owner/station breakdowns with no fuel-company equivalent or data source at all) are
// dropped rather than reworked — `FuelCompanySummaryDto` has no field behind any of them.
// Every quick action now points at the real screen that performs it (FR-051); none had a
// destination before.
export function PetrolDashboard() {
  const { t } = useTranslation();
  const { user } = useSession();
  const navigate = useNavigate();

  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const { data: summary, isLoading, isError, refetch } = useFuelCompanySummary(range.from, range.to);

  const firstName = user?.fullName?.split(' ')[0] ?? '';

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="w-full max-w-[1400px] mx-auto p-2">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col text-right">
            <h1 className="text-2xl font-black text-slate-900">{t('petrolDashboard.greeting', { name: firstName })}</h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">{t('petrolDashboard.subtitle')}</p>
          </div>
          <DateRangePopup
            onApply={(r) => setRange(r)}
            className="w-[240px]"
          />
        </div>

        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('common.loading')}</p>
        ) : isError || !summary ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <p className="text-sm text-red-500">{t('petrolDashboard.loadError')}</p>
            <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
              {t('common.retry')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <StatCard
              title={t('petrolDashboard.pendingApproval')}
              value={String(summary.pendingApproval)}
              icon="/transportCompany/home/sandWatch.svg"
              iconBgClass="bg-[#FFF7ED]"
            />
            <StatCard
              title={t('petrolDashboard.inProgress')}
              value={String(summary.inProgress)}
              icon="/transportCompany/home/truck.svg"
              iconBgClass="bg-[#DBEAFE]"
            />
            <StatCard
              title={t('petrolDashboard.completedInPeriod')}
              value={String(summary.completedInPeriod)}
              icon="/transportCompany/home/rightCheck.svg"
              iconBgClass="bg-[#E8F5E9]"
            />
            <StatCard
              title={t('petrolDashboard.stationOwnersCount')}
              value={String(summary.stationOwnersCount)}
              icon="/petrolCompany/owner/user.svg"
              iconBgClass="bg-[#F3E8FF]"
            />
            <StatCard
              title={t('petrolDashboard.stationsCount')}
              value={String(summary.stationsCount)}
              icon="/petrolCompany/station/station.svg"
              iconBgClass="bg-[#DBEAFE]"
            />
            <StatCard
              title={t('petrolDashboard.creditOutstanding')}
              value={summary.creditOutstanding.amount.toLocaleString()}
              unit={summary.creditOutstanding.currency}
              icon="/transportCompany/home/schedule.svg"
              iconBgClass="bg-[#FEE2E2]"
              valueColor="text-[#EF4444]"
            />
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-6">
          <h2 className="text-sm font-black text-slate-800 mb-5 mr-2 text-right">{t('petrolDashboard.quickActions.title')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              title={t('petrolDashboard.quickActions.viewOrders.title')}
              subtitle={t('petrolDashboard.quickActions.viewOrders.subtitle')}
              icon="/transportCompany/home/invoice.svg"
              bgClass="bg-[#DBEAFE] border border-[#BFDBFE]"
              onClick={() => navigate('/petrolCompany/orders')}
            />
            <ActionCard
              title={t('petrolDashboard.quickActions.viewInvoices.title')}
              subtitle={t('petrolDashboard.quickActions.viewInvoices.subtitle')}
              icon="/petrolCompany/invoice.svg"
              bgClass="bg-[#F3E8FF] border border-[#E9D5FF]"
              onClick={() => navigate('/petrolCompany/invoices')}
            />
            <ActionCard
              title={t('petrolDashboard.quickActions.addTransporter.title')}
              subtitle={t('petrolDashboard.quickActions.addTransporter.subtitle')}
              icon="/petrolCompany/truck.svg"
              bgClass="bg-[#FEE2E2] border border-[#FECACA]"
              onClick={() => navigate('/petrolCompany/companies/add')}
            />
            <ActionCard
              title={t('petrolDashboard.quickActions.addStationOwner.title')}
              subtitle={t('petrolDashboard.quickActions.addStationOwner.subtitle')}
              icon="/petrolCompany/support.svg"
              bgClass="bg-[#D1FAE5] border border-[#A7F3D0]"
              onClick={() => navigate('/petrolCompany/stations/owners/add')}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
