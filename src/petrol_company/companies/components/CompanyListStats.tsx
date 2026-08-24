export function CompanyListStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Companies */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 gap-2 flex items-center justify-start shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
          <img src="/petrolCompany/transporters/blueTruck.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 mb-1">الشركات الناقلة</span>
          <span className="text-xl font-black text-slate-900">4</span>
        </div>
      </div>

      {/* Active Transporters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 gap-2 flex items-center justify-start shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#FFF7ED] flex items-center justify-center shrink-0">
          <img src="/petrolCompany/transporters/orangTruck.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 mb-1">الناقلون النشطون</span>
          <span className="text-xl font-black text-slate-900">3</span>
        </div>
      </div>

      {/* Orders per month */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 gap-2 flex items-center justify-start shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#F0FDF4] flex items-center justify-center shrink-0">
          <img src="/petrolCompany/transporters/order.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 mb-1">طلبات الشهر عبر الناقلين</span>
          <span className="text-xl font-black text-slate-900">132</span>
        </div>
      </div>

      {/* Covered Regions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 gap-2 flex items-center justify-start shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
          <img src="/petrolCompany/transporters/pin.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 mb-1">إجمالي المناطق المغطاة</span>
          <span className="text-xl font-black text-slate-900">11</span>
        </div>
      </div>
    </div>
  );
}
