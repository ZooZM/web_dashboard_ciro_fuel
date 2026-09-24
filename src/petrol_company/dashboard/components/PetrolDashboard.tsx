import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/stores/session.store';
import { StatCard } from '@/transport_company/home/components/StatCard';
import { ActionCard } from '@/transport_company/home/components/ActionCard';
import { DateRangePopup } from '@/components/ui/date-range-popup';
import { useFuelCompanySummary } from '@/petrol_company/dashboard/hooks/useSummary';
import { NewOrdersCard } from '@/transport_company/home/components/NewOrdersCard';
import { ProgressOrdersCard } from '@/transport_company/home/components/ProgressOrdersCard';
import { MapTrackingCard } from '@/transport_company/home/components/MapTrackingCard';
import { InvoicesSection } from '@/transport_company/home/components/InvoicesSection';
import { DoughnutSection } from '@/transport_company/home/components/DoughnutSection';
import { useLayoutStore } from '@/stores/layout.store';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function buildGradient(segments: { count: number; colour: string }[]): string {
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  if (total === 0) return 'conic-gradient(#E2E8F0 0% 100%)';
  let cursor = 0;
  const stops = segments.map((segment) => {
    const start = (cursor / total) * 100;
    cursor += segment.count;
    const end = (cursor / total) * 100;
    return `${segment.colour} ${start}% ${end}%`;
  });
  return `conic-gradient(${stops.join(', ')})`;
}

export function PetrolDashboard() {
  const { t } = useTranslation();
  const { user } = useSession();
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useLayoutStore();

  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const { data: summary, isLoading, isError, refetch } = useFuelCompanySummary(range.from, range.to);

  const firstName = user?.fullName?.split(' ')[0] ?? '';

  const stationsAvail = 25;
  const stationsBusy = 8;
  const stationsOutOfSvc = 2;
  const stationsTotal = stationsAvail + stationsBusy + stationsOutOfSvc;
  const stationsGradient = buildGradient([
    { count: stationsAvail, colour: '#10B981' },
    { count: stationsBusy, colour: '#F59E0B' },
    { count: stationsOutOfSvc, colour: '#EF4444' },
  ]);

  const transportersActive = 12;
  const transportersPending = 4;
  const transportersInactive = 1;
  const transportersTotal = transportersActive + transportersPending + transportersInactive;
  const transportersGradient = buildGradient([
    { count: transportersActive, colour: '#3B82F6' },
    { count: transportersPending, colour: '#F59E0B' },
    { count: transportersInactive, colour: '#94A3B8' },
  ]);

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

        {/* ── Middle: Orders + Map ── */}
        <motion.div layout className={cn("grid gap-4 mb-6", isSidebarCollapsed ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1 lg:grid-cols-2")}>
          <motion.div layout className={cn(isSidebarCollapsed ? "order-2" : "order-1")}>
            <NewOrdersCard />
          </motion.div>
          <motion.div layout className={cn(isSidebarCollapsed ? "order-3" : "order-2")}>
            <ProgressOrdersCard />
          </motion.div>
          <motion.div layout className={cn(isSidebarCollapsed ? "order-1 lg:col-span-1" : "order-3 lg:col-span-2")}>
            <MapTrackingCard />
          </motion.div>
        </motion.div>

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

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <InvoicesSection 
            dueTotal={124320}
            paidTotal={62160}
            overallTotal={186480}
            monthlyData={[
              { label: 'يناير', paid: 15000, due: 5000 },
              { label: 'فبراير', paid: 12000, due: 8000 },
              { label: 'مارس', paid: 18000, due: 4000 },
              { label: 'أبريل', paid: 20000, due: 6000 },
              { label: 'مايو', paid: 25000, due: 7000 },
              { label: 'يونيو', paid: 22000, due: 9000 },
            ]}
          />
          <DoughnutSection
            title="حالة المحطات"
            total={String(stationsTotal)}
            label="محطة"
            gradient={stationsGradient}
            legend={[
              { label: 'نشطة', value: String(stationsAvail), color: 'bg-emerald-500' },
              { label: 'صيانة', value: String(stationsBusy), color: 'bg-amber-500' },
              { label: 'مغلقة', value: String(stationsOutOfSvc), color: 'bg-red-500' },
            ]}
          />
          <DoughnutSection
            title="حالة شركات النقل"
            total={String(transportersTotal)}
            label="شركة"
            gradient={transportersGradient}
            legend={[
              { label: 'نشط', value: String(transportersActive), color: 'bg-blue-500' },
              { label: 'قيد المراجعة', value: String(transportersPending), color: 'bg-amber-500' },
              { label: 'غير نشط', value: String(transportersInactive), color: 'bg-slate-400' },
            ]}
          />
        </div>

      </div>
    </div>
  );
}
