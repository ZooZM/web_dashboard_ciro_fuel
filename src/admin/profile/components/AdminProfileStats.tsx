export function AdminProfileStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center gap-4 justify-start">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <img src="/petrolCompany/station/group.svg" alt="" className="w-6 h-6 filter brightness-0 invert-0" style={{ filter: 'invert(46%) sepia(85%) saturate(1430%) hue-rotate(193deg) brightness(96%) contrast(92%)' }} />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[#858C95] text-xs font-bold mb-1 text-right">ملاك المحطات</span>
          <span className="text-[#162155] text-2xl font-black text-right">6</span>
        </div>
      </div>
      
      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
          <img src="/transportCompany/HelpPage/station.svg" alt="" className="w-6 h-6 filter" style={{ filter: 'invert(52%) sepia(50%) saturate(1750%) hue-rotate(345deg) brightness(101%) contrast(93%)' }} />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[#858C95] text-xs font-bold mb-1 text-right">شركات البترول</span>
          <span className="text-[#162155] text-2xl font-black text-right">14</span>
        </div>
      </div>
      
      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
          <img src="/petrolCompany/truck.svg" alt="" className="w-6 h-6 filter" style={{ filter: 'invert(54%) sepia(35%) saturate(543%) hue-rotate(93deg) brightness(96%) contrast(91%)' }} />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[#858C95] text-xs font-bold mb-1 text-right">شركات النقل</span>
          <span className="text-[#162155] text-2xl font-black text-right">4</span>
        </div>
      </div>

      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
          <img src="/Admin/Brands/order.svg" alt="" className="w-6 h-6 filter" style={{ filter: 'invert(53%) sepia(66%) saturate(2222%) hue-rotate(329deg) brightness(97%) contrast(89%)' }} />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[#858C95] text-xs font-bold mb-1 text-right">حجم الطلبات (الشهر)</span>
          <span className="text-[#162155] text-2xl font-black text-right">132</span>
        </div>
      </div>
    </div>
  );
}
