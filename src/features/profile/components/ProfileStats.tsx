export function ProfileStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Right Card: السائقين تحت الإدارة */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between w-full">
        <div className="w-12 h-12 rounded-full border-2 border-blue-100 bg-blue-50 flex items-center justify-center shrink-0">
          <img src="/profilePage/truck.svg" alt="" className="w-6 h-6 object-contain" />
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-500 font-bold text-sm">السائقين تحت الإدارة</span>
          <span className="text-[#162155] font-black text-2xl">28</span>
        </div>
      </div>

      {/* Left Card: الطلبات المُدارة */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between w-full">
        <div className="w-12 h-12 rounded-full border-2 border-orange-100 bg-orange-50 flex items-center justify-center shrink-0">
          <img src="/DriverPage/editDriver/invoice.svg" alt="" className="w-6 h-6 object-contain" />
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-500 font-bold text-sm">الطلبات المُدارة (هذا الشهر)</span>
          <span className="text-[#162155] font-black text-2xl">38</span>
        </div>
      </div>
    </div>
  );
}
