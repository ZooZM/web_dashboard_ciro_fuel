import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function StationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(true);

  // Mock data for the page
  const station = {
    id: id || 'STA-2024-011',
    name: 'الرحاب',
    isActive: isActive,
    joinDate: '2022/01/15',
    ordersPerMonth: 54,
    suppliedVolume: '78,400',
    totalSpending: '35,100',
    avgDeliveryTime: 27,
    fullName: 'مكة القديم',
    code: 'TRN-2024-001',
    address: 'جدة - طريق مكة القديم'
  };

  const owner = {
    name: 'محمد أحمد',
    mobile: '05xxxxxxxx'
  };

  const MOCK_ORDERS = [
    { id: 'ORD-2024-256', stationName: 'محمد أحمد - محطة الرحاب', fuelType: 'بنزين 95', volume: '20,000 لتر', status: 'قيد التوصيل' },
    { id: 'ORD-2024-256', stationName: 'محمد أحمد - محطة الرحاب', fuelType: 'بنزين 95', volume: '20,000 لتر', status: 'مكتمل' },
    { id: 'ORD-2024-256', stationName: 'محمد أحمد - محطة الرحاب', fuelType: 'بنزين 95', volume: '20,000 لتر', status: 'مكتمل' },
  ];

  return (
    <div className="flex flex-col p-6 max-w-[1600px] mx-auto w-full gap-6">

      {/* Header / Breadcrumb */}
      <div className="flex items-center justify-start gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <img src="/petrolCompany/station/arrowRight.svg" className="w-3 h-3 " alt="Back" />
        </button>
        <span className="text-sm font-bold text-slate-400">ملاك المحطات / <span className="text-slate-900">محطة {station.name}</span></span>
      </div>

      {/* Main Profile Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-600 shadow-sm flex items-center justify-center">
            <img src="/petrolCompany/station/station.svg" alt="Station" className="w-6 h-6 filter brightness-0 invert" />
          </div>
          <div className="flex flex-col text-right">
            <div className="flex items-center justify-start gap-3 mb-1">
              <span className="text-lg font-black text-slate-900">{station.name}</span>
              <span className="bg-green-100/50 text-green-600 px-3 py-1 rounded-lg text-xs font-bold">{station.isActive ? "نشط" : "غير نشط"}</span>
            </div>
            <span className="text-xs font-bold text-slate-400">{station.id} • تاريخ الانضمام {station.joinDate}</span>
          </div>
        </div>
        <div
          onClick={() => setIsActive(!isActive)}
          className={cn(
            "flex items-center justify-center px-4 h-10 rounded-xl font-bold text-sm gap-2 cursor-pointer transition-colors border",
            isActive
              ? "bg-red-50 text-red-500 hover:bg-red-100 border-red-100"
              : "bg-green-50 text-green-600 hover:bg-green-100 border-green-100"
          )}
        >
          <img src={isActive ? "/petrolCompany/owner/pause (1).svg" : "/petrolCompany/owner/continue.svg"} alt="" className="w-4 h-4" />
          {isActive ? "إيقاف المحطة" : "تشغيل المحطة"}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Orders per month */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex items-center justify-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/petrolCompany/owner/blueOrder.svg" alt="" className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-slate-500 mb-1">طلبات الشهر</span>
            <span className="text-xl font-black text-slate-900">{station.ordersPerMonth}</span>
          </div>
        </div>

        {/* Supplied volume */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex items-center justify-start gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <img src="/petrolCompany/transporters/orangTruck.svg" alt="" className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-slate-500 mb-1">الكمية الموردة (الشهر)</span>
            <span className="text-xl font-black text-slate-900">{station.suppliedVolume} <span className="text-[10px] text-slate-500">لتر</span></span>
          </div>
        </div>

        {/* Total spending */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex items-center justify-start gap-4">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16H13C13.6667 16 15 15.6 15 14C15 12.4 13.6667 12 13 12H11C10.3333 12 9 11.6 9 10C9 8.4 10.3333 8 11 8H12M12 16H9M12 16V18M15 8H12M12 8V6M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#12A150" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-slate-500 mb-1">إجمالي الإنفاق (الشهر)</span>
            <span className="text-xl font-black text-slate-900">{station.totalSpending} <span className="text-[10px] text-slate-500">ر.س</span></span>
          </div>
        </div>

        {/* Average delivery time */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex items-center justify-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#EF3F3F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-slate-500 mb-1">متوسط وقت التوصيل</span>
            <span className="text-xl font-black text-slate-900">{station.avgDeliveryTime} <span className="text-[10px] text-slate-500">د</span></span>
          </div>
        </div>

      </div>

      {/* Main Content: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Station Information */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <img src="/petrolCompany/owner/blueStation.svg" alt="" className="w-5 h-5" />

                </div>
                <span className="font-black text-slate-900 text-lg">معلومات المحطة</span>
              </div>
              <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                <img src="/petrolCompany/station/edit.svg" alt="Edit" className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-6 text-right">
              {/* Row 1: Name and Code */}
              <div className="flex flex-row  w-full">
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold text-slate-400 mb-1">اسم المحطة</span>
                  <span className="text-sm font-black text-slate-900">{station.fullName}</span>
                </div>
                <div className="flex flex-col items-start mx-auto ">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-400">كود المحطة</span>
                    <div className="flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold">
                      <img src="/petrolCompany/owner/lock.svg" alt="" className="w-3 h-3" />
                      غير قابل للتعديل
                    </div>
                  </div>
                  <span className="text-sm font-black text-slate-900">{station.code}</span>
                </div>
              </div>

              {/* Row 2: Address */}
              <div className="flex flex-col items-start w-full">
                <span className="text-xs font-bold text-slate-400 mb-1">عنوان المحطة</span>
                <span className="text-sm font-black text-slate-900">{station.address}</span>
              </div>
            </div>
          </div>

          {/* Recent Orders Log */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <div className="w-full flex items-center justify-start gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <img src="/petrolCompany/owner/blueOrder.svg" alt="" className="w-4 h-4" />
              </div>
              <span className="font-black text-slate-900 text-lg">سجل الطلبات الأخيرة</span>
            </div>

            <div className="flex flex-col gap-4 mb-4 flex-1">
              {MOCK_ORDERS.map((order, index) => (
                <div key={index} className={cn(
                  "flex items-center justify-between pb-4",
                  index !== MOCK_ORDERS.length - 1 && "border-b border-slate-100"
                )}>

                  {/* Order Details (Left and Middle) */}
                  <div className="flex items-center justify-between w-full text-right">

                    {/* Order Details (Right) */}
                    <div className="flex flex-col items-start flex-1 text-right">
                      <span className="text-xs font-black text-slate-900 mb-0.5">{order.id}</span>
                      <span className="text-[10px] font-bold text-slate-400">{order.stationName}</span>
                    </div>

                    {/* Fuel Details (Middle) */}
                    <div className="flex flex-col items-center justify-center flex-1">
                      <span className="text-[10px] font-bold text-slate-500 mb-0.5">{order.fuelType}</span>
                      <span className="text-xs font-black text-slate-900">{order.volume}</span>
                    </div>

                    {/* Status Badge (Left) */}
                    <div className="flex justify-end flex-1">
                      <div className={cn(
                        "px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5",
                        order.status === 'قيد التوصيل' ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", order.status === 'قيد التوصيل' ? "bg-green-500" : "bg-slate-400")}></div>
                        {order.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/petrolCompany/order-tracking"
              className="w-full py-3 mt-2 rounded-xl border border-slate-200 text-blue-600 bg-white hover:bg-slate-50 transition-colors font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <img src="/petrolCompany/owner/blueOrder.svg" alt="" className="w-3.5 h-3.5" />
              عرض المزيد
            </Link>
          </div>

        </div>

        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 flex flex-col gap-6">

          {/* Owner Information */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center relative">
            <div className="w-full flex items-center justify-between mb-6">

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <img src="/petrolCompany/owner/user.svg" alt="" className="w-4 h-4" />
                </div>
                <span className="font-black text-slate-900 text-lg">مالك المحطة</span>
              </div>
              <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 12H16M15 16H17C19.2091 16 21 14.2091 21 12C21 9.79086 19.2091 8 17 8H15M9 8H7C4.79086 8 3 9.79086 3 12C3 14.2091 4.79086 16 7 16H9" stroke="#1E5FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center mb-3">
              <img src="/petrolCompany/owner/user.svg" alt="Avatar" className="w-10 h-10 opacity-20" />
            </div>

            <span className="text-base font-black text-slate-900 mb-2">{owner.name}</span>
            <span className="text-xs font-bold text-slate-500 mb-6">رقم الجوال {owner.mobile}</span>

            <button className="w-full py-3 rounded-xl border border-blue-100 text-blue-600 bg-white hover:bg-blue-50 transition-colors font-bold text-sm flex items-center justify-center gap-2">
              <img src="/petrolCompany/transporters/details/phone.svg" alt="" className=' w-4 h-4' />
              تواصل مع المالك
            </button>
          </div>

          {/* Location on Map */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col relative h-full">
            <div className="w-full flex items-center justify-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21C12 21 19 15 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15 12 21 12 21Z" stroke="#1E5FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#1E5FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-black text-slate-900 text-lg">الموقع على الخريطة</span>
            </div>

            <div className="w-full h-[300px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative flex-1">
              {/* Map Controls */}
              <div className="absolute top-4 left-4 w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors z-10 border border-slate-100">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L15 3L21 6V20L15 18L9 21L3 18V4L9 5Z" stroke="#1E5FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 5V21" stroke="#1E5FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 3V18" stroke="#1E5FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <img src="/petrolCompany/orderDetails/map.png" alt="Map" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
