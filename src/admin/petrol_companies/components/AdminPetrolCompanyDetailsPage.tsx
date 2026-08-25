import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AdminPetrolCompanyInfoCard } from './AdminPetrolCompanyInfoCard';
import { CompanyContactCard } from '@/petrol_company/companies/components/CompanyContactCard';
import { FuelPriceCard } from '@/petrol_company/fuel_prices/components/FuelPriceCard';
import { type FuelData, FUEL_DATA } from '@/petrol_company/fuel_prices/components/FuelPricesPage';

export function AdminPetrolCompanyDetailsPage() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const [fuelData, setFuelData] = useState<FuelData[]>(FUEL_DATA);

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-[calc(100vh-6rem)] border border-[#E7E9EF] rounded-2xl" dir="rtl">

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={() => navigate('/admin/petrol-companies')}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E9EF] rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/requests/details/chevronRight.svg" alt="Back" className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          شركات البترول / بترو أمان
        </span>
      </div>

      {/* Header Card */}
      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm overflow-hidden p-1">
            <img src="/Admin/Brands/petroAman.jpg " alt="Logo" className="w-full h-full object-contain" onError={(e) => {
              (e.target as HTMLImageElement).src = '/petrolCompany/station/station2.svg';
            }} />
          </div>

          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-[#162155]">بترو أمان</span>
              <span
                className={cn(
                  "px-4 py-1.5 rounded-xl text-xs font-bold",
                  isActive
                    ? "bg-green-100/50 text-green-600"
                    : "bg-red-50 text-red-600"
                )}>
                {isActive ? 'نشط' : 'موقوف'}
              </span>
            </div>
            <span className="text-sm font-bold text-slate-400 mt-0.5">DRV-2024-011 - تاريخ الانضمام 2022/01/15</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              isActive
                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 shadow-sm"
                : "bg-green-100 text-green-600 hover:bg-green-200 border border-green-200 shadow-sm"
            )}>
            {isActive ? (
              <img src="/petrolCompany/owner/pause (1).svg" alt="" className="w-4 h-4" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                <path d="M7.5 6C7.5 6 7 8 7 12C7 16 7.5 18 7.5 18C7.5 18 9.5 17.5 13 15.5C16.5 13.5 17.5 12 17.5 12C17.5 12 16.5 10.5 13 8.5C9.5 6.5 7.5 6 7.5 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {isActive ? "إيقاف" : "تشغيل"}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
          <div className="flex flex-col text-right order-2">
            <span className="text-[#858C95] text-xs font-bold mb-1">الإيرادات الشهرية</span>
            <span className="text-[#162155] text-2xl font-black flex items-center gap-1">84,500 <span className="text-sm font-bold text-[#858C95]">ر.س</span></span>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 order-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.75 13.75H10.75C11.4167 13.75 12.75 13.35 12.75 11.75C12.75 10.15 11.4167 9.75 10.75 9.75H8.75C8.08333 9.75 6.75 9.35 6.75 7.75C6.75 6.15 8.08333 5.75 8.75 5.75H9.75M9.75 13.75H6.75M9.75 13.75V15.75M12.75 5.75H9.75M9.75 5.75V3.75M18.75 9.75C18.75 14.7206 14.7206 18.75 9.75 18.75C4.77944 18.75 0.75 14.7206 0.75 9.75C0.75 4.77944 4.77944 0.75 9.75 0.75C14.7206 0.75 18.75 4.77944 18.75 9.75Z" stroke="#1E5FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          </div>
        </div>

        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
          <div className="flex flex-col text-right order-2">
            <span className="text-[#858C95] text-xs font-bold mb-1">ملاك المحطات</span>
            <span className="text-[#162155] text-2xl font-black">34</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0 order-1">
           <img src="/Admin/Brands/group.svg" alt="" />
          </div>
        </div>

        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
          <div className="flex flex-col text-right order-2">
            <span className="text-[#858C95] text-xs font-bold mb-1">إجمالي المحطات</span>
            <span className="text-[#162155] text-2xl font-black">97</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0 order-1">
            <img src="/Admin/Brands/station.svg" alt="" className="w-6 h-6" onError={(e) => {
              (e.target as HTMLImageElement).src = '/petrolCompany/station/station2.svg';
            }} />
          </div>
        </div>

        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
          <div className="flex flex-col text-right order-2">
            <span className="text-[#858C95] text-xs font-bold mb-1">طلبات هذا الشهر</span>
            <span className="text-[#162155] text-2xl font-black">612</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0 order-1">
            <img src="/Admin/Brands/order.svg" alt="" className="w-6 h-6 object-contain" />
          </div>
        </div>

      </div>

      {/* Fuel Prices Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-6">
        {fuelData.map((fuel) => (
          <FuelPriceCard
            key={fuel.id}
            fuel={fuel}
            onEdit={() => { }}
            onToggleActive={(id) => setFuelData(prev => prev.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f))}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start pb-6">

        {/* Right Column (Wider) - Info */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <AdminPetrolCompanyInfoCard />

          {/* Station Owners */}
          <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <img src="/petrolCompany/station/group.svg" alt="" />
                </div>
                <h3 className="text-base font-black text-[#162155]">ملاك المحطات والمحطات التابعة</h3>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
                <span className="text-xs font-bold text-green-600">6 ملاك</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {[1, 2].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-[#E7E9EF] rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4 text-right">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                      <img src="/petrolCompany/orderDetails/profile.jpg" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-[#162155] mb-1">عبدالله الفهد</span>
                      <span className="text-[10px] font-bold text-slate-400">OPC-2024-011 - مالك منذ 2022/01/15</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-slate-500">3 محطات</span>
                    <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-lg text-[10px] font-bold">نشط</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Log */}
          <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="w-full flex items-center justify-start gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <img src="/petrolCompany/requests/date.svg" alt="" />
              </div>
              <span className="font-black text-[#162155] text-lg">سجل الطلبات الأخيرة</span>
            </div>

            <div className="flex flex-col gap-4 mb-4">
              {[
                { id: 'ORD-2024-256', status: 'قيد التوصيل', color: 'green' },
                { id: 'ORD-2024-256', status: 'مكتمل', color: 'slate' },
                { id: 'ORD-2024-256', status: 'مكتمل', color: 'slate' }
              ].map((order, index) => (
                <div key={index} className={`flex items-center justify-between pb-4 w-full ${index !== 2 ? 'border-b border-[#E7E9EF]' : ''}`}>
                   <div className="flex flex-col items-start flex-1 text-right">
                    <span className="text-xs font-black text-[#162155] mb-0.5">{order.id}</span>
                    <span className="text-[10px] font-bold text-slate-400">محمد أحمد - محطة الرحاب</span>
                  </div>

                  <div className="flex flex-col items-center justify-center flex-1">
                    <span className="text-[10px] font-bold text-slate-500 mb-0.5">بنزين 95</span>
                    <span className="text-xs font-black text-[#162155]">20,000 لتر</span>
                  </div>
                

                   <div className="flex justify-end flex-1">
                    <div className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 ${order.color === 'green' ? "bg-green-50 text-green-600 border border-green-200" : "bg-slate-50 text-slate-500 border border-slate-200"
                      }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${order.color === 'green' ? "bg-green-500" : "bg-slate-400"}`}></div>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-3 mt-2 rounded-xl border border-[#E7E9EF] text-blue-600 bg-white hover:bg-slate-50 transition-colors font-bold text-xs flex items-center justify-center gap-2 shadow-sm">
              <img src="/petrolCompany/requests/date.svg" alt="" />
              عرض المزيد
            </button>
          </div>
        </div>

        {/* Left Column (Narrower) - Contact & Map */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 self-start">
          <CompanyContactCard />

          {/* Location on Map */}
          <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-base font-black text-[#162155]">الموقع على الخريطة</h3>
            </div>

            <div className="w-full h-[200px] rounded-xl overflow-hidden relative border border-slate-200">
              <img src="/petrolCompany/orderDetails/map.png" alt="Map Location" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-white border border-slate-200 rounded-lg shadow-sm p-1.5 cursor-pointer hover:bg-slate-50">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
