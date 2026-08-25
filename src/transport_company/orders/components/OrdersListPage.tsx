import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { DesktopOrdersTable } from './DesktopOrdersTable';
import { MobileOrdersList } from './MobileOrdersList';
import { FilterToolbar } from '@/components/ui/FilterToolbar';

// --- Static Data ---
const STAT_CARDS = [
  { title: 'إجمالي الطلبات', value: '56', icon: '/transportCompany/home/invoice.svg', iconBgClass: 'bg-[#F3E8FF]', valueColor: 'text-[#A855F7]' },
  { title: 'الطلبات المكتملة', value: '38', icon: '/transportCompany/home/rightCheck.svg', iconBgClass: 'bg-[#E8F5E9]', valueColor: 'text-[#22C55E]' },
  { title: 'الطلبات قيد التنفيذ', value: '16', icon: '/transportCompany/home/sandWatch.svg', iconBgClass: 'bg-[#FFF7ED]', valueColor: 'text-[#F97316]' },
  { title: 'مرفوضة', value: '2', icon: '/transportCompany/home/schedule.svg', iconBgClass: 'bg-[#FEE2E2]', valueColor: 'text-[#EF4444]' },
];
const FILTERS = ['الكل', 'جديد', 'قيد التنفيذ', 'مكتملة', 'مرفوضة'];

const MOCK_ORDERS = [
  { id: '256', num: 'ORD-2024-256', company: 'شركة بترو أمان', companyAddress: 'جدة - طريق مكة القديم - حي البوادي', owner: 'محمد أحمد', fuel: 'بنزين 95', fuelLiters: '20,000 لتر', locationFrom: 'مستودع جدة الرئيسي', locationTo: 'جدة - طريق مكة القديم - حي البوادي', driver: 'أحمد السبيعي', driverId: 'أ ب ت - 1234', timeDate: 'اليوم، 04:30', timeAmPm: 'م', status: 'جديد', transportFare: '400', fuelInvoice: '210,000' },
  { id: '255', num: 'ORD-2024-255', company: 'شركة بترو أمان', companyAddress: 'جدة - طريق مكة القديم - حي البوادي', owner: 'محمد أحمد', fuel: 'بنزين 95', fuelLiters: '20,000 لتر', locationFrom: 'مستودع جدة الرئيسي', locationTo: 'جدة - طريق مكة القديم - حي البوادي', driver: 'أحمد السبيعي', driverId: 'أ ب ت - 1234', timeDate: 'اليوم، 04:30', timeAmPm: 'م', status: 'جديد', transportFare: '400', fuelInvoice: '210,000' },
  { id: '254', num: 'ORD-2024-254', company: 'شركة بترو أمان', companyAddress: 'جدة - طريق مكة القديم - حي البوادي', owner: 'محمد أحمد', fuel: 'بنزين 95', fuelLiters: '20,000 لتر', locationFrom: 'مستودع جدة الرئيسي', locationTo: 'جدة - طريق مكة القديم - حي البوادي', driver: 'أحمد السبيعي', driverId: 'أ ب ت - 1234', timeDate: 'اليوم، 04:30', timeAmPm: 'م', status: 'جديد', transportFare: '400', fuelInvoice: '210,000' },
  { id: '253', num: 'ORD-2024-253', company: 'شركة بترو أمان', companyAddress: 'جدة - طريق مكة القديم - حي البوادي', owner: 'محمد أحمد', fuel: 'بنزين 95', fuelLiters: '20,000 لتر', locationFrom: 'مستودع جدة الرئيسي', locationTo: 'جدة - طريق مكة القديم - حي البوادي', driver: 'أحمد السبيعي', driverId: 'أ ب ت - 1234', timeDate: 'اليوم، 04:30', timeAmPm: 'م', status: 'جديد', transportFare: '400', fuelInvoice: '210,000' },
  { id: '252', num: 'ORD-2024-252', company: 'شركة بترو أمان', companyAddress: 'جدة - طريق مكة القديم - حي البوادي', owner: 'محمد أحمد', fuel: 'بنزين 95', fuelLiters: '20,000 لتر', locationFrom: 'مستودع جدة الرئيسي', locationTo: 'جدة - طريق مكة القديم - حي البوادي', driver: 'أحمد السبيعي', driverId: 'أ ب ت - 1234', timeDate: 'اليوم، 04:30', timeAmPm: 'م', status: 'جديد', transportFare: '400', fuelInvoice: '210,000' },
  { id: '251', num: 'ORD-2024-251', company: 'شركة بترو أمان', companyAddress: 'جدة - طريق مكة القديم - حي البوادي', owner: 'محمد أحمد', fuel: 'بنزين 95', fuelLiters: '20,000 لتر', locationFrom: 'مستودع جدة الرئيسي', locationTo: 'جدة - طريق مكة القديم - حي البوادي', driver: 'أحمد السبيعي', driverId: 'أ ب ت - 1234', timeDate: 'اليوم، 04:30', timeAmPm: 'م', status: 'جديد', transportFare: '400', fuelInvoice: '210,000' },
  { id: '250', num: 'ORD-2024-250', company: 'شركة بترو أمان', companyAddress: 'جدة - طريق مكة القديم - حي البوادي', owner: 'محمد أحمد', fuel: 'بنزين 95', fuelLiters: '20,000 لتر', locationFrom: 'مستودع جدة الرئيسي', locationTo: 'جدة - طريق مكة القديم - حي البوادي', driver: 'أحمد السبيعي', driverId: 'أ ب ت - 1234', timeDate: 'اليوم، 04:30', timeAmPm: 'م', status: 'جديد', transportFare: '400', fuelInvoice: '210,000' },
];

export function OrdersListPage() {
  const [activeFilter, setActiveFilter] = useState('الكل');

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      {/* --- Header --- */}
      <div className="mb-6 flex flex-col items-start text-right">
        <h1 className="text-2xl font-black text-slate-900">الطلبات</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">إدارة ومتابعة كل طلبات نقل الوقود</p>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {STAT_CARDS.map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-start gap-4 shadow-sm">
            <div className={cn('w-12 h-12 flex items-center justify-center rounded-full shrink-0', card.iconBgClass)}>
              <img src={card.icon} alt="" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-sm font-semibold text-slate-500">{card.title}</span>
              <span className={cn('text-2xl font-black', card.valueColor)}>{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* --- Filters Pills --- */}
      <div className="flex items-center gap-2 bg-white w-fit rounded-full p-2 justify-center mb-4">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'relative px-5 py-2 text-sm font-bold rounded-full transition-colors whitespace-nowrap cursor-pointer',
                isActive ? 'text-white' : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-filter-pill"
                  className="absolute inset-0 bg-blue-600 rounded-full shadow-sm border border-blue-600"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10">{filter}</span>
            </button>
          );
        })}
      </div>

      {/* --- Main Content Section (Table & Actions) --- */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden pt-4 pb-0">

        {/* Top: Action Bar */}
        <FilterToolbar 
          searchPlaceholder="ابحث بكود الطلب أو الشركة..."
          onExport={() => console.log('Export Orders')}
          hasDateRange={true}
          filters={[
            { id: 'status', label: 'الحالة', options: [{ value: 'new', label: 'جديد' }, { value: 'completed', label: 'مكتمل' }] },
            { id: 'company', label: 'الشركة', options: [{ value: '1', label: 'شركة أ' }] }
          ]}
        />

        {/* Desktop Table View */}
        <DesktopOrdersTable orders={MOCK_ORDERS} />

        {/* Mobile View: Cards layout instead of Table */}
        <div className="px-4 pb-4 lg:px-0 lg:pb-0">
          <MobileOrdersList orders={MOCK_ORDERS} />
        </div>
      </div>
    </div>
  );
}
