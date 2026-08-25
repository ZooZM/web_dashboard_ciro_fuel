import { useSession } from '@/stores/session.store';
import { StatCard }           from '@/transport_company/home/components/StatCard';
import { MapTrackingCard }    from '@/transport_company/home/components/MapTrackingCard';
import { ProgressOrdersCard } from '@/transport_company/home/components/ProgressOrdersCard';
import { ActionCard }         from '@/transport_company/home/components/ActionCard';
import { InvoicesSection }    from '@/transport_company/home/components/InvoicesSection';
import { DoughnutSection }    from '@/transport_company/home/components/DoughnutSection';
import { FuelIcon }           from '@/transport_company/tracking/components/FuelIcon';
import { useLayoutStore }     from '@/stores/layout.store';
import { motion }             from 'framer-motion';
import { cn }                 from '@/lib/utils';
import { useNavigate }        from 'react-router-dom';

// ── Stat cards data ──────────────────────────────────────────────────────────
const STAT_CARDS = [
  { title: 'شركات البترول', value: '9', icon: '/Admin/Home/gunStation.svg', iconBgClass: 'bg-[#E8F5E9]', date: 'من الأسبوع الماضي', trend: 'شركتان جديدتان', trendUp: true },
  { title: 'الشركات الناقلة', value: '6', icon: '/petrolCompany/truck.svg', iconBgClass: 'bg-[#FFF7ED]', date: 'من الأسبوع الماضي', trend: 'شركة جديدة', trendUp: true },
  { title: 'إجمالي المحطات', value: '97', icon: '/Admin/Home/station.svg', iconBgClass: 'bg-[#F3E8FF]', date: 'من الأسبوع الماضي', trend: '16.30%', trendUp: true },
  { title: 'طلبات / شهر', value: '612', icon: '/Admin/Home/chart.svg', iconBgClass: 'bg-[#FEE2E2]', date: 'من الأسبوع الماضي', trend: '16.30%', trendUp: true },
  { title: 'حجم التداول (GMV)', value: '2.48M', unit: 'ر.س', icon: '/Admin/Home/dollar.svg', iconBgClass: 'bg-[#E8F5E9]', date: 'من الأسبوع الماضي', trend: '16.30%', trendUp: true },
  { title: 'الكميات المتداولة', value: '210M', unit: 'لتر', icon: '/Admin/Home/quantities.svg', iconBgClass: 'bg-[#E8F5E9]', date: 'من الأسبوع الماضي', trend: '16.30%', trendUp: true },
];

// ── Quick action cards data ───────────────────────────────────────────────────
const ACTION_CARDS = [
  { title: 'عرض الفواتير', subtitle: 'الفواتير و المستحقات', icon: '/petrolCompany/invoice.svg', bgClass: 'bg-[#F3E8FF] border border-[#E9D5FF]' },
  { title: 'إضافة شركة نقل', subtitle: 'إضافة ناقل جديد', icon: '/petrolCompany/truck.svg', bgClass: 'bg-[#FEE2E2] border border-[#FECACA]' },
  { title: 'إضافة مالك محطة', subtitle: 'تسجيل مالك ومحطة جديدة', icon: '/transportCompany/home/users.svg', bgClass: 'bg-[#DBEAFE] border border-[#BFDBFE]' },
  { title: 'إرسال إشعار للمنصة', subtitle: 'تنبيه كل الشركات والمستخدمين', icon: '/Admin/Home/notification.svg', bgClass: 'bg-[#D1FAE5] border border-[#A7F3D0]' },
];

// ── Doughnut charts data ──────────────────────────────────────────────────────
const DOUGHNUT_LEGEND_COMPANIES = [
  { label: 'شركات بترول', value: '9', color: 'bg-[#10B981]' },
  { label: 'شركات نقل', value: '6', color: 'bg-[#3B82F6]' },
];

const DOUGHNUT_LEGEND_ORDERS = [
  { label: 'مكتمل', value: '450', color: 'bg-[#10B981]' },
  { label: 'قيد التنفيذ', value: '162', color: 'bg-[#3B82F6]' },
];

const DOUGHNUT_CHARTS = [
  {
    title: 'توزيع الشركات',
    total: '15',
    label: 'شركة',
    gradient: 'conic-gradient(#10B981 0% 60%, #3B82F6 60% 100%)',
    legend: DOUGHNUT_LEGEND_COMPANIES,
  },
  {
    title: 'حالة الطلبات',
    total: '612',
    label: 'طلب',
    gradient: 'conic-gradient(#10B981 0% 73%, #3B82F6 73% 100%)',
    legend: DOUGHNUT_LEGEND_ORDERS,
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export function AdminDashboard() {
  const { user } = useSession();
  const { isSidebarCollapsed } = useLayoutStore();
  const navigate = useNavigate();

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="w-full max-w-[1400px] mx-auto p-2">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col text-right">
            <h1 className="text-2xl font-black text-slate-900">
              مرحباً {user?.fullName?.split(' ')[0] || (user as any)?.name?.split(' ')[0] || 'حسين'}
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              نظرة عامة على أداء منصة CIRO FUEL بالكامل اليوم
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-6">
          <motion.div layout className={cn(isSidebarCollapsed ? "order-2 lg:col-span-2" : "order-1 lg:col-span-3")}>
            <ProgressOrdersCard onViewAllClick={() => navigate('/admin/order-tracking')} />
          </motion.div>
          <motion.div layout className={cn(isSidebarCollapsed ? "order-3 lg:col-span-2" : "order-2 lg:col-span-3")}>
            <ProgressOrdersCard onViewAllClick={() => navigate('/admin/order-tracking')} />
          </motion.div>
          <motion.div layout className={cn(isSidebarCollapsed ? "order-1 lg:col-span-2" : "order-3 lg:col-span-6")}>
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

        {/* ── Bottom: Revenues + Charts ── */}
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
