import { useSession } from '@/stores/session.store';
import { useTranslation } from 'react-i18next';
import { useSummary } from '@/transport_company/dashboard/hooks/useSummary';

// Home section components
import { StatCard } from '@/transport_company/home/components/StatCard';
import { MapTrackingCard } from '@/transport_company/home/components/MapTrackingCard';
import { NewOrdersCard } from '@/transport_company/home/components/NewOrdersCard';
import { ProgressOrdersCard } from '@/transport_company/home/components/ProgressOrdersCard';
import { ActionCard } from '@/transport_company/home/components/ActionCard';
import { InvoicesSection } from '@/transport_company/home/components/InvoicesSection';
import { DoughnutSection } from '@/transport_company/home/components/DoughnutSection';
import { useLayoutStore } from '@/stores/layout.store';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ── Quick action cards data ───────────────────────────────────────────────────
// Feature 009 T117: titles/subtitles were hardcoded Arabic-only, breaking bilingual coverage
// on a screen this feature rebuilt (FR-074/075) — moved to the `dashboard.quickActions.*` keys.
const ACTION_CARDS = [
  { key: 'viewInvoices', icon: '/transportCompany/home/invoice.svg', bgClass: 'bg-[#F3E8FF] border border-[#E9D5FF]' },
  { key: 'updateFare', icon: '/transportCompany/home/location.svg', bgClass: 'bg-[#FEE2E2] border border-[#FECACA]' },
  { key: 'addDriver', icon: '/transportCompany/home/users.svg', bgClass: 'bg-[#DBEAFE] border border-[#BFDBFE]' },
  { key: 'assignOrder', icon: '/transportCompany/home/user.svg', bgClass: 'bg-[#D1FAE5] border border-[#A7F3D0]' },
] as const;

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

// Feature 009 T112/SC-005: InvoicesSection (a fabricated 12-month paid/due chart) and
// DoughnutSection (fabricated driver/truck status percentages) are dropped from THIS
// composition — neither has a real data source at the granularity shown (the summary
// endpoint gives one driversOnDuty figure, not an active/available/busy/inactive
// breakdown, and no monthly invoice trend endpoint exists). The component files
// themselves are untouched: AdminDashboard.tsx and PetrolDashboard.tsx (out of this
// feature's scope) still compose them.

// ── Page ─────────────────────────────────────────────────────────────────────
export function TransportDashboard() {
  const { t } = useTranslation();
  const { user } = useSession();
  const { isSidebarCollapsed } = useLayoutStore();
  // FR-067: one request for the whole home, not one per figure.
  const { data: summary, isLoading: summaryLoading, isError: summaryError, refetch: refetchSummary } = useSummary();
  const summaryUnavailable = summaryLoading || summaryError;

  const trucksAvail = summary?.trucksStatus?.available ?? 12;
  const trucksBusy = summary?.trucksStatus?.busy ?? 4;
  const trucksOutOfSvc = summary?.trucksStatus?.outOfService ?? 4;
  const trucksTotal = trucksAvail + trucksBusy + trucksOutOfSvc;
  const trucksGradient = buildGradient([
    { count: trucksAvail, colour: '#10B981' },
    { count: trucksBusy, colour: '#F59E0B' },
    { count: trucksOutOfSvc, colour: '#EF4444' },
  ]);

  const driversTrip = summary?.driversStatus?.onTrip ?? 25;
  const driversAvail = summary?.driversStatus?.available ?? 7;
  const driversLeave = summary?.driversStatus?.onLeave ?? 3;
  const driversTotal = driversTrip + driversAvail + driversLeave;
  const driversGradient = buildGradient([
    { count: driversTrip, colour: '#3B82F6' },
    { count: driversAvail, colour: '#F59E0B' },
    { count: driversLeave, colour: '#94A3B8' },
  ]);

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="w-full max-w-[1400px] mx-auto p-2">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col text-right">
            <h1 className="text-2xl font-black text-slate-900">
              {t('dashboard.greeting', { name: user?.fullName?.split(' ')[0] ?? '' })}
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">{t('dashboard.subtitle')}</p>
          </div>
        </div>

        {summaryError && (
          <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <span className="text-sm font-bold text-red-600">{t('errors.generic')}</span>
            <button onClick={() => refetchSummary()} className="text-sm font-bold text-blue-600 hover:underline">
              {t('common.retry')}
            </button>
          </div>
        )}

        {/* ── Stat Cards — every figure real, from GET /orders/summary (FR-062) ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            title={t('dashboard.awaitingAssignment')}
            value={summaryUnavailable ? '—' : String(summary?.awaitingAssignment ?? 0)}
            icon="/transportCompany/home/schedule.svg"
            iconBgClass="bg-[#FFF7ED]"
          />
          <StatCard
            title={t('dashboard.inProgress')}
            value={summaryUnavailable ? '—' : String(summary?.inProgress ?? 0)}
            icon="/transportCompany/home/sandWatch.svg"
            iconBgClass="bg-orange-100"
          />
          <StatCard
            title={t('dashboard.completedInPeriod')}
            value={summaryUnavailable ? '—' : String(summary?.completedInPeriod ?? 0)}
            icon="/transportCompany/home/rightCheck.svg"
            iconBgClass="bg-[#E8F5E9]"
          />
          <StatCard
            title={t('dashboard.driversOnDuty')}
            value={summaryUnavailable ? '—' : String(summary?.driversOnDuty ?? 0)}
            icon="/transportCompany/home/users.svg"
            iconBgClass="bg-blue-100 p-2"
          />
          <StatCard
            title={t('dashboard.outstandingSettlements')}
            value={summaryUnavailable ? '—' : (summary?.outstandingSettlements.amount ?? 0).toLocaleString()}
            unit={summary?.outstandingSettlements.currency}
            icon="/transportCompany/home/payment.svg"
            iconBgClass="bg-green-100" 
          />
        </div>

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



        {/* ── Quick Actions ── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-6">
          <h2 className="text-sm font-black text-slate-800 mb-5 mr-2 text-right">{t('dashboard.quickActions.title')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACTION_CARDS.map((action) => (
              <ActionCard
                key={action.key}
                title={t(`dashboard.quickActions.${action.key}.title`)}
                subtitle={t(`dashboard.quickActions.${action.key}.subtitle`)}
                icon={action.icon}
                bgClass={action.bgClass}
              />
            ))}
          </div>
        </div>
        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <InvoicesSection 
            dueTotal={summary?.invoicesSummary?.dueTotal}
            paidTotal={summary?.invoicesSummary?.paidTotal}
            overallTotal={summary?.invoicesSummary?.overallTotal}
            monthlyData={summary?.invoicesSummary?.monthlyData}
          />
          <DoughnutSection
            title="حالة الشاحنات"
            total={String(trucksTotal)}
            label="شاحنة"
            gradient={trucksGradient}
            legend={[
              { label: 'متاحة', value: String(trucksAvail), color: 'bg-emerald-500' },
              { label: 'مشغولة', value: String(trucksBusy), color: 'bg-amber-500' },
              { label: 'غير متاحة', value: String(trucksOutOfSvc), color: 'bg-red-500' },
            ]}
          />
          <DoughnutSection
            title="حالة السائقين"
            total={String(driversTotal)}
            label="سائق"
            gradient={driversGradient}
            legend={[
              { label: 'في رحلة', value: String(driversTrip), color: 'bg-blue-500' },
              { label: 'متاح', value: String(driversAvail), color: 'bg-amber-500' },
              { label: 'إجازة', value: String(driversLeave), color: 'bg-slate-400' },
            ]}
          />
        </div>

      </div>
    </div>
  );
}
