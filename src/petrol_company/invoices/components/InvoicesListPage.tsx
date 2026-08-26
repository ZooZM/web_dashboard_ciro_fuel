import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { DesktopInvoicesTable } from './DesktopInvoicesTable';
import { MobileInvoicesList } from './MobileInvoicesList';
import { CashbackBanner } from './CashbackBanner';
import { PlatformCommissionBanner } from './PlatformCommissionBanner';

// --- Static Data ---
const FILTERS = ['الكل', 'المدفوعة', 'المستحقة'];

const MOCK_INVOICES = [
  { id: '1', invoiceNum: 'INV-2024-158', orderNum: 'ORD-2024-256', company: 'شركة النقل المتحدة', station: 'جدة - طريق مكة القديم - حي البوادي', owner: 'محمد أحمد', deliveryFee: '400', amount: '1,150,000', issueDate: '06/06/2026', issueTime: '04:30 م', status: 'مدفوع' },
  { id: '2', invoiceNum: 'INV-2024-158', orderNum: 'ORD-2024-256', company: 'شركة النقل المتحدة', station: 'جدة - طريق مكة القديم - حي البوادي', owner: 'محمد أحمد', deliveryFee: '400', amount: '1,150,000', issueDate: '06/06/2026', issueTime: '04:30 م', status: 'مدفوع' },
  { id: '3', invoiceNum: 'INV-2024-158', orderNum: 'ORD-2024-256', company: 'شركة النقل المتحدة', station: 'جدة - طريق مكة القديم - حي البوادي', owner: 'محمد أحمد', deliveryFee: '400', amount: '1,150,000', issueDate: '06/06/2026', issueTime: '04:30 م', status: 'مستحق' },
  { id: '4', invoiceNum: 'INV-2024-158', orderNum: 'ORD-2024-256', company: 'شركة النقل المتحدة', station: 'جدة - طريق مكة القديم - حي البوادي', owner: 'محمد أحمد', deliveryFee: '400', amount: '1,150,000', issueDate: '06/06/2026', issueTime: '04:30 م', status: 'مدفوع' },
  { id: '5', invoiceNum: 'INV-2024-158', orderNum: 'ORD-2024-256', company: 'شركة النقل المتحدة', station: 'جدة - طريق مكة القديم - حي البوادي', owner: 'محمد أحمد', deliveryFee: '400', amount: '1,150,000', issueDate: '06/06/2026', issueTime: '04:30 م', status: 'مستحق' },
  { id: '6', invoiceNum: 'INV-2024-158', orderNum: 'ORD-2024-256', company: 'شركة النقل المتحدة', station: 'جدة - طريق مكة القديم - حي البوادي', owner: 'محمد أحمد', deliveryFee: '400', amount: '1,150,000', issueDate: '06/06/2026', issueTime: '04:30 م', status: 'مستحق' },
  { id: '7', invoiceNum: 'INV-2024-158', orderNum: 'ORD-2024-256', company: 'شركة النقل المتحدة', station: 'جدة - طريق مكة القديم - حي البوادي', owner: 'محمد أحمد', deliveryFee: '400', amount: '1,150,000', issueDate: '06/06/2026', issueTime: '04:30 م', status: 'مدفوع' },
];

export function InvoicesListPage() {
  const [activeFilter, setActiveFilter] = useState('الكل');
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices', activeFilter],
    queryFn: async () => {
      // Simulating API call for architectural demonstration
      return new Promise<typeof MOCK_INVOICES>((resolve) => 
        setTimeout(() => resolve(MOCK_INVOICES), 1500)
      );
    }
  });

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      {/* --- Header --- */}
      <div className="mb-6 flex flex-col items-start text-right">
        <h1 className="text-2xl font-black text-slate-900">الفواتير</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">إدارة ومتابعة كل فواتير نقل الوقود</p>
      </div>

      {/* --- Stats Cards --- */}
      <div className={cn("grid grid-cols-1 gap-4 mb-6", isAdmin ? "md:grid-cols-4" : "md:grid-cols-3")}>
        {/* Card 4: Commission (Admin Only) */}
        {isAdmin && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex  items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <img src="/petrolCompany/invoice/dollar.svg" alt="" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-bold text-sm">العمولة</span>
                <span className="text-[#162155] font-black text-2xl flex items-center gap-1.5">
                  150,000 <span className="text-sm text-slate-500">ر.س</span>
                </span>
                <div className="flex items-center gap-1.5 text-[#16A34A]">
                  <svg className='mt-1' width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2L10 6H2L6 2Z" fill="currentColor" />
                  </svg>
                  <span className="text-xs font-bold text-slate-500"><span className="text-[#16A34A]">12.50%</span> من الأسبوع الماضي</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Card 1: Paid */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex  items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 14L4 14L10 20" stroke="#FF5810" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M4 10H20L14 4" stroke="#FF5810" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 font-bold text-sm">تحويلات</span>
              <span className="text-[#162155] font-black text-2xl flex items-center gap-1.5">
                230,000 <span className="text-sm text-slate-500">ر.س</span>
              </span>
              <div className="flex items-center gap-1.5 text-[#16A34A]">
                <svg className='mt-1' width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2L10 6H2L6 2Z" fill="currentColor" />
                </svg>
                <span className="text-xs font-bold text-slate-500"><span className="text-[#16A34A]">16.30%</span> من الأسبوع الماضي</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Paid */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex  items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
              <img src="/transportCompany/invoicePage/rightCheck.svg" alt="" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 font-bold text-sm">المدفوع</span>
              <span className="text-[#162155] font-black text-2xl flex items-center gap-1.5">
                5,120,000 <span className="text-sm text-slate-500">ر.س</span>
              </span>
              <div className="flex items-center gap-1.5 text-[#16A34A]">
                <svg className='mt-1' width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2L10 6H2L6 2Z" fill="currentColor" />
                </svg>
                <span className="text-xs font-bold text-slate-500"><span className="text-[#16A34A]">16.30%</span> من الأسبوع الماضي</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Due */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex  items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FFF7ED] flex items-center justify-center shrink-0">
              <img src="/transportCompany/invoicePage/schedule.svg" alt="" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 font-bold text-sm">المستحق</span>
              <span className="text-[#162155] font-black text-2xl flex items-center gap-1.5">
                3,599,000 <span className="text-sm text-slate-500">ر.س</span>
              </span>
              <div className="flex items-center gap-1.5 text-[#16A34A]">
                <svg className='mt-1' width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2L10 6H2L6 2Z" fill="currentColor" />
                </svg>
                <span className="text-xs font-bold text-slate-500"><span className="text-[#16A34A]">16.30%</span> من الأسبوع الماضي</span>
              </div>
            </div>

          </div>
        </div>



      </div>

      {/* --- Promotional Banners --- */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <CashbackBanner />
          <PlatformCommissionBanner />
        </div>
      )}

      {/* --- Filters Tabs --- */}
      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden w-full sm:w-fit mb-6 bg-white divide-x divide-x-reverse divide-slate-200">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'relative flex-1 sm:flex-none px-4 sm:px-12 py-3 text-sm font-bold transition-colors whitespace-nowrap cursor-pointer text-center',
                isActive ? 'text-[#162155]' : 'text-slate-500 hover:bg-slate-50'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 bg-[#EEF2FF] border-b-2 border-blue-600"
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 px-4">

          {/* Right Side: Arrange, Filter, Search */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto">
            {/* Arrange */}
            <button className="flex-1 md:flex-none flex justify-center items-center gap-2 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shrink-0">
              <img src="/transportCompany/orderPage/arrange.svg" alt="" className="w-4 h-4 hover:opacity-70" />
              ترتيب
            </button>

            {/* Filter */}
            <button className="flex-1 md:flex-none flex justify-center items-center gap-2 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shrink-0">
              <img src="/transportCompany/orderPage/filter.svg" alt="" className="w-4 h-4 hover:opacity-70" />
              تصفية
            </button>

            {/* Search */}
            <div className="relative w-full border-r pr-4 md:w-auto flex-1 min-w-[250px] order-last md:order-none">
              <input
                type="text"
                placeholder="ابحث بكود الطلب أو الشركة..."
                className="w-full pr-8 pl-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 placeholder:text-slate-400"
              />
              <img src="/transportCompany/orderPage/search.svg" alt="" className="w-4 h-4 absolute right-6 top-1/2 -translate-y-1/2 " />
            </div>
          </div>

          {/* Left Side: Export */}
          <button className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#DCFCE7] transition-colors shrink-0">
            <img src="/transportCompany/invoicePage/greenDownload.svg" alt="" className="w-4 h-4" />
            تصدير
          </button>

        </div>

        {/* Loading State or Data */}
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <DesktopInvoicesTable invoices={invoices} />

            {/* Mobile View: Cards layout instead of Table */}
            <div className="px-4 pb-4 lg:px-0 lg:pb-0">
              <MobileInvoicesList invoices={invoices} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
