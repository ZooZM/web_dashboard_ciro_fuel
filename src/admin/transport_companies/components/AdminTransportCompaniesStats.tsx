export function AdminTransportCompaniesStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* Total Companies */}
      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex flex-col text-right order-2">
          <span className="text-[#858C95] text-xs font-bold mb-1">الشركات الناقلة</span>
          <span className="text-[#162155] text-2xl font-black">4</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 order-1">
          <img src="/Admin/transporter/blueTruck.svg" alt="" className="w-6 h-6 object-contain" />
        </div>
      </div>

      {/* Active Transporters */}
      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex flex-col text-right order-2">
          <span className="text-[#858C95] text-xs font-bold mb-1">الناقلون النشطون</span>
          <span className="text-[#162155] text-2xl font-black">3</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0 order-1">
          <img src="/Admin/transporter/orangeTruck.svg" alt="" className="w-6 h-6 object-contain" />
        </div>
      </div>

      {/* Orders this month */}
      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex flex-col text-right order-2">
          <span className="text-[#858C95] text-xs font-bold mb-1">طلبات الشهر عبر الناقلين</span>
          <span className="text-[#162155] text-2xl font-black">132</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0 order-1">
          <img src="/Admin/transporter/order.svg" alt="" className="w-6 h-6 object-contain" onError={(e) => {
            (e.target as HTMLImageElement).src = '/petrolCompany/transporters/details/receipt.svg';
          }} />
        </div>
      </div>

      {/* Covered Areas */}
      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex flex-col text-right order-2">
          <span className="text-[#858C95] text-xs font-bold mb-1">إجمالي المناطق المغطاة</span>
          <span className="text-[#162155] text-2xl font-black">11</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0 order-1">
          <img src="/Admin/transporter/pin.svg" alt="" className="w-6 h-6 object-contain filter" style={{ filter: 'invert(53%) sepia(66%) saturate(2222%) hue-rotate(329deg) brightness(97%) contrast(89%)' }} />
        </div>
      </div>

    </div>
  );
}
