import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AdminDesktopOrdersTable } from './AdminDesktopOrdersTable';
import { AdminMobileOrdersList } from './AdminMobileOrdersList';
import { FilterToolbar } from '@/components/ui/FilterToolbar';
import { Pagination } from '@/components/ui/pagination';

// --- Static Mock Data ---
const STAT_CARDS = [
  { title: 'إجمالي الطلبات',     value: '56', icon: '/transportCompany/home/invoice.svg',    iconBgClass: 'bg-[#F3E8FF]', valueColor: 'text-[#A855F7]' },
  { title: 'الطلبات المكتملة',   value: '38', icon: '/transportCompany/home/rightCheck.svg', iconBgClass: 'bg-[#E8F5E9]', valueColor: 'text-[#22C55E]' },
  { title: 'الطلبات قيد التنفيذ', value: '16', icon: '/transportCompany/home/sandWatch.svg',  iconBgClass: 'bg-[#FFF7ED]', valueColor: 'text-[#F97316]' },
  { title: 'مرفوضة',            value: '2',  icon: '/transportCompany/home/schedule.svg',   iconBgClass: 'bg-[#FEE2E2]', valueColor: 'text-[#EF4444]' },
];
const FILTERS = ['الكل', 'جديد', 'قيد التنفيذ', 'مكتملة', 'مرفوضة'];

const MOCK_ORDERS = Array(56).fill({
  company: 'شركة بترو أمان', 
  companyAddress: 'جدة - طريق مكة القديم - حي البوادي', 
  owner: 'محمد أحمد', 
  fuel: 'بنزين 95', 
  fuelLiters: '20,000 لتر', 
  locationFrom: 'مستودع جدة الرئيسي', 
  locationTo: 'جدة - طريق مكة القديم - حي البوادي', 
  transporter: 'شركة النقل المتحدة', 
  timeDate: 'اليوم، 04:30', 
  timeAmPm: 'م', 
  status: 'جديد', 
  platformCommission: '400', 
  fuelInvoice: '210,000'
}).map((order, index) => ({
  ...order,
  id: `${256 - index}`,
  num: `ORD-2024-${256 - index}`,
  paymentMethod: index % 2 === 0 ? 'bank' : 'sadad'
}));

export function AdminOrdersPage() {
  const [activeFilter, setActiveFilter] = useState('الكل');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Paginate Data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = MOCK_ORDERS.slice(startIndex, startIndex + itemsPerPage);

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
      <div className="flex items-center gap-2 bg-white w-fit rounded-full p-2 justify-center mb-4 overflow-x-auto max-w-full">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'relative px-5 py-2 text-sm font-bold rounded-full transition-colors whitespace-nowrap cursor-pointer shrink-0',
                isActive ? 'text-white' : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-filter-pill-admin"
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
          onExport={() => console.log('Export Admin Orders')}
          hasDateRange={true}
          filters={[
            { id: 'status', label: 'الحالة', options: [{ value: 'new', label: 'جديد' }, { value: 'completed', label: 'مكتمل' }] },
            { id: 'company', label: 'الشركة', options: [{ value: '1', label: 'شركة أ' }] }
          ]}
        />

        {/* Data List/Table */}
        <div className="bg-white">
          {MOCK_ORDERS.length > 0 ? (
            <>
              <AdminDesktopOrdersTable orders={paginatedOrders} />
              <div className="px-4 pb-4 lg:hidden">
                <AdminMobileOrdersList orders={paginatedOrders} />
              </div>
              <Pagination
                totalItems={MOCK_ORDERS.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                itemName="طلب"
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(items) => {
                  setItemsPerPage(items);
                  setCurrentPage(1);
                }}
                className="border-t border-slate-100"
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <p className="font-medium text-sm">لا توجد طلبات حتى الآن.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
