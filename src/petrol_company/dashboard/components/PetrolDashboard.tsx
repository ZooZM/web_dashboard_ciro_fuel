import { useSession } from '@/stores/session.store';
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

// ── Stat cards data ──────────────────────────────────────────────────────────
const STAT_CARDS = [
  { title: 'الطلبات المكتملة', value: '38', icon: '/transportCompany/home/rightCheck.svg', iconBgClass: 'bg-[#E8F5E9]', date: 'من الأسبوع الماضي', trend: '16.30%', trendUp: true },
  { title: 'الطلبات قيد التنفيذ', value: '18', icon: '/transportCompany/home/sandWatch.svg', iconBgClass: 'bg-[#FFF7ED]', date: 'من الأسبوع الماضي', trend: '16.30%', trendUp: true },
  { title: 'إجمالي الطلبات', value: '56', icon: '/transportCompany/home/invoice.svg', iconBgClass: 'bg-[#F3E8FF]', date: 'من الأسبوع الماضي', trend: '16.30%', trendUp: true },
  { title: 'مستحق التحصيل', value: '62,160', unit: 'ر.س', icon: '/transportCompany/home/schedule.svg', iconBgClass: 'bg-[#FEE2E2]', valueColor: 'text-[#EF4444]', date: 'من الأسبوع الماضي', trend: '16.30%', trendUp: false },
  { title: 'إجمالي العمولات', value: '248,560', unit: 'ر.س', icon: '/transportCompany/home/payment.svg', iconBgClass: 'bg-[#E8F5E9]', date: 'من الأسبوع الماضي', trend: '16.30%', trendUp: true },
  { title: 'إجمالي الكميات', value: '228,000', unit: 'لتر', icon: '/transportCompany/home/truck.svg', iconBgClass: 'bg-[#DBEAFE]', date: 'من الأسبوع الماضي', trend: '16.30%', trendUp: true },
];

// ── Quick action cards data ───────────────────────────────────────────────────
const ACTION_CARDS = [
  { title: 'عرض الفواتير', subtitle: 'الفواتير و المستحقات', icon: '/petrolCompany/invoice.svg', bgClass: 'bg-[#F3E8FF] border border-[#E9D5FF]' },
  { title: 'إضافة شركة نقل', subtitle: 'إضافة ناقل جديد', icon: '/petrolCompany/truck.svg', bgClass: 'bg-[#FEE2E2] border border-[#FECACA]' },
  { title: 'إضافة مالك محطة', subtitle: 'تسجيل مالك ومحطة جديدة', icon: '/transportCompany/home/users.svg', bgClass: 'bg-[#DBEAFE] border border-[#BFDBFE]' },
  { title: 'التواصل مع الدعم', subtitle: 'فريق الدعم متاح الآن', icon: '/petrolCompany/support.svg', bgClass: 'bg-[#D1FAE5] border border-[#A7F3D0]' },
];

// ── Doughnut charts data ──────────────────────────────────────────────────────
const DOUGHNUT_LEGEND = [
  { label: 'نشطون', value: '20', color: 'bg-[#10B981]' },
  { label: 'متاحون', value: '5', color: 'bg-[#3B82F6]' },
  { label: 'في مهمة', value: '2', color: 'bg-[#F97316]' },
  { label: 'غير نشطين', value: '1', color: 'bg-[#94A3B8]' },
];

const DOUGHNUT_CHARTS = [
  {
    title: 'ملاك المحطات',
    total: '7',
    label: 'إجمالي الملاك',
    gradient: 'conic-gradient(#10B981 0% 70%, #3B82F6 70% 88%, #F97316 88% 96%, #94A3B8 96% 100%)',
    legend: DOUGHNUT_LEGEND,
  },
  {
    title: 'المحطات',
    total: '21',
    label: 'إجمالي المحطات',
    gradient: 'conic-gradient(#10B981 0% 65%, #3B82F6 65% 85%, #F97316 85% 95%, #94A3B8 95% 100%)',
    legend: DOUGHNUT_LEGEND,
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export function PetrolDashboard() {
  const { user } = useSession();
  const { isSidebarCollapsed } = useLayoutStore();

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="w-full max-w-[1400px] mx-auto p-2">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col text-right">
            <h1 className="text-2xl font-black text-slate-900">
              مرحباً {user?.fullName?.split(' ')[0] || (user as any)?.name?.split(' ')[0] || 'إبراهيم'}
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              إليك ملخص عمليات الطلب و النقل اليوم
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="text-[11px] font-bold text-slate-700">كل المحطات</span>
              <img src="/transportCompany/home/chevronDown.svg" className="w-3.5 h-3.5  " />
            </div>
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
              <img src="/transportCompany/home/date.svg" className="w-4 h-4 opacity-70" />
              <span className="text-[11px] font-bold text-slate-700 font-mono" dir="ltr">2024/05/02 - 2024/05/08</span>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {STAT_CARDS.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
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
          <h2 className="text-sm font-black text-slate-800 mb-5 mr-2 text-right">إجراءات سريعة</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACTION_CARDS.map((action) => (
              <ActionCard key={action.title} {...action} />
            ))}
          </div>
        </div>

        {/* ── Bottom: Invoices + Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <InvoicesSection />
          {DOUGHNUT_CHARTS.map((chart) => (
            <DoughnutSection key={chart.title} {...chart} />
          ))}
        </div>

      </div>
    </div>
  );
}
