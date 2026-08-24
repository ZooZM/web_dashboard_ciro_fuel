export function CompanyDetailStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Regions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-start gap-2 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
          <img src="/petrolCompany/transporters/details/bluePin.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 mb-1">المناطق المغطاة</span>
          <span className="text-xl font-black text-slate-900">5</span>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-start gap-2 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#FFF7ED] flex items-center justify-center shrink-0">
          <img src="/petrolCompany/transporters/details/order.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 mb-1">طلبات الشهر</span>
          <span className="text-xl font-black text-slate-900">86</span>
        </div>
      </div>

      {/* Delivery Time */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-start gap-2 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#F0FDF4] flex items-center justify-center shrink-0">
          <img src="/petrolCompany/transporters/details/hour.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 mb-1">متوسط وقت التسليم</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900">27</span>
            <span className="text-sm font-bold text-slate-900">د</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-start gap-2 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
          <img src="/petrolCompany/transporters/details/star.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 mb-1">تقييم الأداء</span>
          <span className="text-xl font-black text-slate-900">4.7</span>
        </div>
      </div>
    </div>
  );
}
