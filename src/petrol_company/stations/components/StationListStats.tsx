export function StationListStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Total Owners */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
          <img src="/petrolCompany/station/group.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-slate-500 mb-1">ملاك المحطات</span>
          <span className="text-2xl font-black text-slate-900">4</span>
        </div>
      </div>

      {/* Total Stations */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
          <img src="/petrolCompany/station/orangeStation.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-slate-500 mb-1">إجمالي المحطات</span>
          <span className="text-2xl font-black text-slate-900">14</span>
        </div>
      </div>

      {/* Active Stations */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
          <img src="/petrolCompany/station/gunStation.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-slate-500 mb-1">محطات نشطة</span>
          <span className="text-2xl font-black text-slate-900">13</span>
        </div>
      </div>

      {/* Monthly Requests */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <img src="/petrolCompany/station/order.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-slate-500 mb-1">طلبات الشهر من الملاك</span>
          <span className="text-2xl font-black text-slate-900">132</span>
        </div>
      </div>

    </div>
  );
}
