/* eslint-disable i18next/no-literal-string */
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Static Data ---
const STAT_CARDS = [
  { title: 'إجمالي الطلبات',     value: '56', icon: '/home/invoice.svg',    iconBgClass: 'bg-[#F3E8FF]', valueColor: 'text-[#A855F7]' },
  { title: 'الطلبات المكتملة',   value: '38', icon: '/home/rightCheck.svg', iconBgClass: 'bg-[#E8F5E9]', valueColor: 'text-[#22C55E]' },
  { title: 'إجمالي الطلبات',     value: '56', icon: '/orderPage/invoice.svg',    iconBgClass: 'bg-[#E7EEFF]', valueColor: 'text-blue-600' },
  { title: 'الطلبات قيد التنفيذ', value: '16', icon: '/home/sandWatch.svg',  iconBgClass: 'bg-[#FFF7ED]', valueColor: 'text-[#F97316]' },
  { title: 'مرفوضة',            value: '2',  icon: '/home/schedule.svg',   iconBgClass: 'bg-[#FEE2E2]', valueColor: 'text-[#EF4444]' },
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
    <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6" dir="rtl">
      {/* --- Header --- */}
      <div className="mb-6 flex flex-col items-start text-right">
        <h1 className="text-2xl font-black text-slate-900">الطلبات</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">إدارة ومتابعة كل طلبات نقل الوقود</p>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5 mb-6">
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
      <div className="flex items-center gap-2 bg-white w-fit rounded-full p-2 justify-center  mb-4 ">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              'px-5 py-2 text-sm font-bold rounded-full transition-colors whitespace-nowrap',
              activeFilter === filter
                ? 'bg-blue-600 text-white border border-blue-600 shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 '
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* --- Main Content Section (Table & Actions) --- */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
        
        {/* Top: Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          
          {/* Right Side: Arrange, Filter, Search */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto">


            {/* Arrange */}
            <button className="flex-1 md:flex-none flex justify-center items-center gap-2 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shrink-0">
              <img src="/orderPage/arrange.svg" alt="" className="w-4 h-4 hover:opacity-70" />
              ترتيب
            </button>

            {/* Filter */}
            <button className="flex-1 md:flex-none flex justify-center items-center gap-2 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shrink-0">
              <img src="/orderPage/filter.svg" alt="" className="w-4 h-4 hover:opacity-70" />
              تصفية
            </button>

            {/* Search */}
            <div className="relative w-full border-r pr-4 md:w-auto flex-1 min-w-[250px] order-last md:order-none">
              <input 
                type="text" 
                placeholder="ابحث بكود الطلب أو الشركة..." 
                className="w-full pr-8 pl-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 placeholder:text-slate-400"
              />
              <img src="/orderPage/search.svg" alt="" className="w-4 h-4 absolute right-6 top-1/2 -translate-y-1/2 opacity-50" />
            </div>
          </div>

          {/* Left Side: Export */}
          <button className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#DCFCE7] transition-colors shrink-0">
            <img src="/orderPage/download.svg" alt="" className="w-4 h-4" />
            تصدير
          </button>

        </div>

        {/* Desktop Table View - Hidden on mobile/tablet to prevent horizontal scroll */}
        <div className="hidden lg:block rounded-xl overflow-hidden border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8FAFC] hover:bg-[#F8FAFC] border-b border-slate-200">
                <TableHead className="font-bold text-slate-700 text-[12px] text-right py-3 px-2 min-w-[90px]">رقم الطلب</TableHead>
                <TableHead className="font-bold text-slate-700 text-[12px] text-right py-3 px-2 min-w-[140px]">الشركة</TableHead>
                <TableHead className="font-bold text-slate-700 text-[12px] text-right py-3 px-2 min-w-[100px]">المالك</TableHead>
                <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[100px]">الوقود / الكمية</TableHead>
                <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[140px]">موقع التحميل &larr; التسليم</TableHead>
                <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[100px]">السائق / الشاحنة</TableHead>
                <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[100px]">موعد التسليم</TableHead>
                <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[80px]">الحالة</TableHead>
                <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[90px]">أجرة النقل</TableHead>
                <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[100px]">فاتورة الوقود</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_ORDERS.map((order) => (
                <TableRow key={order.id} className="hover:bg-slate-50/50 border-b border-slate-100 last:border-0">
                  {/* رقم الطلب */}
                  <TableCell className="align-middle py-3 px-2">
                    <span className="text-slate-800 font-bold text-[12px] whitespace-nowrap">{order.num}</span>
                  </TableCell>
                  
                  {/* الشركة */}
                  <TableCell className="align-middle py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm shrink-0">
                        <Shield className="w-4 h-4 text-[#3b82f6] opacity-90" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-slate-900 font-bold text-[12px] truncate">{order.company}</span>
                        <span className="text-slate-400 text-[10px] mt-0.5 truncate max-w-[120px]">{order.companyAddress}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* المالك */}
                  <TableCell className="align-middle py-3 px-2">
                    <span className="text-slate-800 font-bold text-[12px] whitespace-nowrap">{order.owner}</span>
                  </TableCell>
                  
                  {/* الوقود / الكمية */}
                  <TableCell className="align-middle text-center py-3 px-2">
                    <div className="flex flex-col items-center gap-1">
                      <span className="bg-[#FFEDD5] text-[#EA580C] px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap">
                        {order.fuel}
                      </span>
                      <span className="text-slate-600 font-bold text-[11px] whitespace-nowrap">{order.fuelLiters}</span>
                    </div>
                  </TableCell>

                  {/* موقع التحميل <- التسليم */}
                  <TableCell className="align-middle text-center py-3 px-2">
                    <div className="flex flex-col items-center">
                      <span className="text-slate-800 font-bold text-[11px] text-center max-w-[120px] leading-tight">{order.locationFrom}</span>
                      <img src="/orderPage/arrowDown.svg" alt="" className="w-3 h-3 my-0.5 opacity-60" />
                      <span className="text-slate-400 text-[10px] text-center max-w-[120px] leading-tight">{order.locationTo}</span>
                    </div>
                  </TableCell>

                  {/* السائق / الشاحنة */}
                  <TableCell className="align-middle text-center py-3 px-2">
                    <div className="flex flex-col items-center">
                      <span className="text-slate-800 font-bold text-[11px] text-center leading-tight">{order.driver}</span>
                      <span className="text-slate-400 text-[10px] mt-0.5 whitespace-nowrap">{order.driverId}</span>
                    </div>
                  </TableCell>

                  {/* موعد التسليم */}
                  <TableCell className="align-middle text-center py-3 px-2">
                    <div className="flex flex-col items-center">
                      <span className="text-slate-800 font-bold text-[11px] whitespace-nowrap">{order.timeDate}</span>
                      <span className="text-slate-400 text-[10px] mt-0.5 whitespace-nowrap">{order.timeAmPm}</span>
                    </div>
                  </TableCell>

                  {/* الحالة */}
                  <TableCell className="align-middle text-center py-3 px-2">
                    <div className="inline-flex items-center justify-center gap-1.5 bg-[#DCFCE7] px-2 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></div>
                      <span className="text-[#16A34A] text-[10px] font-bold whitespace-nowrap">{order.status}</span>
                    </div>
                  </TableCell>

                  {/* أجرة النقل */}
                  <TableCell className="align-middle text-center py-3 px-2">
                    <span className="text-blue-600 font-black text-[12px]">{order.transportFare}</span>
                  </TableCell>

                  {/* فاتورة الوقود */}
                  <TableCell className="align-middle text-center py-3 px-2">
                    <span className="text-green-600 font-black text-[12px]">{order.fuelInvoice}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View: Cards layout instead of Table to completely eliminate scrolling */}
        <div className="lg:hidden flex flex-col gap-4">
          {MOCK_ORDERS.map((order) => (
            <div key={`mobile-${order.id}`} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
              
              {/* Header: Order Num & Status */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-800 font-bold text-sm">{order.num}</span>
                <div className="inline-flex items-center gap-1.5 bg-[#DCFCE7] px-2.5 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></div>
                  <span className="text-[#16A34A] text-[10px] font-bold">{order.status}</span>
                </div>
              </div>
              
              {/* Company, Owner & Fuel Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0">
                    <Shield className="w-5 h-5 text-[#3b82f6]" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-slate-900 font-bold text-[13px]">{order.company}</span>
                    <span className="text-slate-500 text-[11px] font-medium">{order.owner}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="bg-[#FFEDD5] text-[#EA580C] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    {order.fuel}
                  </span>
                  <span className="text-slate-600 font-bold text-[11px]">{order.fuelLiters}</span>
                </div>
              </div>
              
              {/* Locations (From -> To) */}
              <div className="flex flex-col bg-[#F8FAFC] border border-slate-100 rounded-xl p-3 gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                  <span className="text-slate-700 text-[12px] font-semibold leading-tight">{order.locationFrom}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                  <span className="text-slate-700 text-[12px] font-semibold leading-tight">{order.locationTo}</span>
                </div>
              </div>
              
              {/* Driver, Date & Prices Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-2 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] mb-1">السائق / الشاحنة</span>
                  <span className="text-slate-800 font-bold text-[12px]">{order.driver}</span>
                  <span className="text-slate-500 text-[11px] mt-0.5">{order.driverId}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] mb-1">موعد التسليم</span>
                  <span className="text-slate-800 font-bold text-[12px]">{order.timeDate}</span>
                  <span className="text-slate-500 text-[11px] mt-0.5">{order.timeAmPm}</span>
                </div>
                <div className="flex flex-col bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                  <span className="text-slate-500 text-[10px] mb-0.5">أجرة النقل</span>
                  <span className="text-blue-600 font-black text-[13px]">{order.transportFare} ر.س</span>
                </div>
                <div className="flex flex-col bg-green-50/50 p-2 rounded-lg border border-green-100/50">
                  <span className="text-slate-500 text-[10px] mb-0.5">فاتورة الوقود</span>
                  <span className="text-green-600 font-black text-[13px]">{order.fuelInvoice} ر.س</span>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
