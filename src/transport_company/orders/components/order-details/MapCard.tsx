export function MapCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/orderPage/orderDetails/pin.svg" alt="" className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-black text-[#162155]">الموقع على الخريطة</h2>
      </div>
      <div className="w-full h-[180px] bg-slate-100 rounded-xl mb-4 relative overflow-hidden border border-slate-200">
        {/* Mock Map Image */}
        <img src="/orderPage/orderDetails/map.png" alt="Map" className="w-full h-full object-cover opacity-60" />
        <div className="absolute top-3 left-3 bg-white rounded-xl p-2 shadow-sm border border-slate-100">
            <img src="/orderPage/orderDetails/map.svg" alt="" className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
        <img src="/orderPage/orderDetails/buttonMap.svg" alt="" className="w-5 h-5" />
        تتبع الشاحنة
      </button>
    </div>
  );
}
