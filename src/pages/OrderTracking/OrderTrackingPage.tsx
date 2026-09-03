import { useState } from 'react';
import { Search, Filter, ArrowDownToLine, ChevronLeft, ChevronRight, MoreHorizontal, ArrowDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MobileOrderTrackingList } from './MobileOrderTrackingList';
import { Pagination } from '@/components/ui/pagination';

export function OrderTrackingPage() {
  const mockOrders = Array(56).fill({
    id: 'ORD-2024-256',
    companyName: 'شركة بترو أمان',
    companyLogo: '/petrolCompany/requests/petro-aman.jpg',
    station: 'جدة - طريق مكة القديم - حي البوادي',
    ownerName: 'محمد أحمد',
    ownerAvatar: '/petrolCompany/orderDetails/profile.jpg',
    fuelType: 'بنزين 95',
    fuelQuantity: '20,000 لتر',
    loadLocation: 'مستودع جدة الرئيسي',
    deliveryLocation: 'جدة - طريق مكة القديم - حي البوادي',
    transporter: 'شركة النقل المتحدة',
    deliveryTimeDay: 'اليوم',
    deliveryTimeHour: '04:30 م',
    status: 'جديد',
    commission: '1,450',
    invoice: '210,000'
  }).map((order, index) => ({
    ...order,
    id: `ORD-2024-${256 - index}`,
    paymentMethod: index % 2 === 0 ? 'bank' : 'sadad'
  }));

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Paginate Data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = mockOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full h-full p-4 lg:p-6 border border-[#E7E9EF] rounded-2xl  " dir="rtl">
      {/* Header Area */}
      <div className="flex flex-col mb-6">
        <h1 className="text-[#0E2041] text-2xl font-black mb-1">ابحث و تابع الطلبات</h1>
        <p className="text-slate-500 text-sm font-medium">إدارة ومتابعة طلبات نقل الوقود</p>
      </div>

      {/* Controls Area */}
      <div className="flex flex-col md:flex-row items-start md:items-center bg-white rounded-tl-2xl rounded-tr-2xl border border-slate-100 p-3 shadow-sm justify-between gap-4">


        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 w-full md:w-auto border-l-[2px] border-slate-100 pl-2">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border-none text-slate-700 px-4 py-2 rounded-xl text-sm font-bold">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 12H17" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 18H14" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              ترتيب
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border-none  text-slate-700 px-4 py-2 rounded-xl text-sm font-bold">

              <img src="/transportCompany/orderPage/filter.svg" alt="" className='w-4 h-4 object-contain' />
              تصفية
            </button>
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="ابحث بكود الطلب أو الشركة..."
              className="pl-4 pr-10 py-2 border border-slate-200 rounded-xl text-sm w-full md:w-80 focus:outline-none focus:border-blue-500 font-medium"
            />
            <Search className="w-4 h-4 text-blue-500 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 bg-[#E6F4EA] text-[#16A34A] px-4 py-2 rounded-xl text-sm font-bold border border-[#bbf7d0] w-full md:w-auto">
            <ArrowDownToLine className="w-4 h-4" />
            تصدير
          </button>
        </div>
      </div>

      {/* Table Area (Desktop) */}
      <div className="hidden lg:block bg-white border border-slate-100 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f8f9fa] hover:bg-[#f8f9fa]">
              <TableHead className="font-bold text-slate-700 text-xs text-right py-4 pr-6">رقم الطلب</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs text-right py-4">الشركة</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs text-right py-4">المالك</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs text-center py-4">الوقود / الكمية</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs text-center py-4">موقع التحميل &larr; التسليم</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs text-center py-4">الناقل</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs text-center py-4">موعد التسليم</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs text-center py-4">الحالة</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs text-center py-4">عمولة المنصة <br /> <span className="text-[10px]">(ر.س)</span></TableHead>
              <TableHead className="font-bold text-slate-700 text-xs text-center py-4">فاتورة الوقود <br /> <span className="text-[10px]">(ر.س)</span></TableHead>
              <TableHead className="font-bold text-slate-700 text-xs text-center py-4 pl-6">طريقة الدفع</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                <TableCell className="py-4 pr-6">
                  <span className="text-slate-600 font-medium text-xs">{order.id}</span>
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden shrink-0">
                      <img src={order.companyLogo} alt={order.companyName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#162155] font-black text-xs">{order.companyName}</span>
                      <span className="text-slate-400 font-bold text-[10px]">{order.station}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <span className="text-slate-700 font-bold text-xs">{order.ownerName}</span>
                </TableCell>

                <TableCell className="py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="bg-[#FFF3E0] text-[#E65100] px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {order.fuelType}
                    </span>
                    <span className="text-slate-600 font-bold text-[11px]">{order.fuelQuantity}</span>
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-slate-600 font-bold text-[11px] max-w-[120px] text-center">{order.loadLocation}</span>
                    <ArrowDown className="w-3 h-3 text-slate-400 my-0.5" />
                    <span className="text-slate-500 text-[10px] max-w-[120px] text-center">{order.deliveryLocation}</span>
                  </div>
                </TableCell>

                <TableCell className="py-4 text-center">
                  <span className="text-slate-600 font-bold text-[11px]">{order.transporter}</span>
                </TableCell>

                <TableCell className="py-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-slate-600 font-bold text-[11px]">{order.deliveryTimeDay},</span>
                    <span className="text-slate-600 font-bold text-[11px]">{order.deliveryTimeHour}</span>
                  </div>
                </TableCell>

                <TableCell className="py-4 text-center">
                  <div className="inline-flex items-center gap-1.5 bg-[#E6F4EA] px-2.5 py-1 rounded-full">
                    <div className="relative flex h-1.5 w-1.5 shrink-0">
                      {order.status === 'جديد' && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                      )}
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#16A34A]"></span>
                    </div>
                    <span className="text-[#16A34A] text-[10px] font-bold">{order.status}</span>
                  </div>
                </TableCell>

                <TableCell className="py-4 text-center">
                  <span className="text-blue-600 font-black text-xs">{order.commission}</span>
                </TableCell>

                <TableCell className="py-4 text-center">
                  <span className="text-green-600 font-black text-xs">{order.invoice}</span>
                </TableCell>

                <TableCell className="py-4 text-center pl-6">
                  {order.paymentMethod === 'bank' ? (
                    <div className="inline-flex items-center gap-1.5 bg-[#faf5ff] px-3 py-1.5 rounded-full border border-purple-100">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#a855f7]">
                        <path d="M20 14H4L10 20M4 10H20L14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-[#a855f7] text-[11px] font-bold">تحويل بنكي</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 bg-[#eff6ff] px-3 py-1.5 rounded-full border border-blue-100">
                      <img src="/transportCompany/orderPage/orderDetails/invoice.svg" className="w-4 h-4" alt="sadad" />
                      <span className="text-[#3b82f6] text-[11px] font-bold">سداد</span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination
          totalItems={mockOrders.length}
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
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        <MobileOrderTrackingList orders={paginatedOrders} />
        <Pagination
          totalItems={mockOrders.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          itemName="طلب"
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(items) => {
            setItemsPerPage(items);
            setCurrentPage(1);
          }}
          className="mt-4 px-0 bg-transparent"
        />
      </div>
    </div>
  );
}
