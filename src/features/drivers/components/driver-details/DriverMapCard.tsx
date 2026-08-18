export function DriverMapCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4 w-full h-fit">
      {/* Header */}
      <div className="flex items-center  w-full border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/DriverPage/editDriver/pin.svg" alt="" className="w-6 h-4 object-contain" />
          </div>
          <span className="text-[#162155] font-black text-lg">الموقع على الخريطة</span>
        </div>
      </div>

      {/* Map Image */}
      <div className="w-full rounded-xl overflow-hidden border border-slate-200 h-[180px] relative">
        <img src="/orderPage/orderDetails/map.png" alt="Map" className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3  flex items-center justify-center">
          <img src="/DriverPage/editDriver/map.svg" alt="" className="w-full h-full object-contain" />
        </div>
      </div>


      {/* Track Button */}
      <button className="flex items-center justify-center gap-2 bg-blue-600 text-white w-full py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm mt-2">
        <img src="/DriverPage/editDriver/mapButton.svg" alt="" className="w-4 h-4 object-contain" />
        تتبع الشاحنة
      </button>
    </div>
  );
}
