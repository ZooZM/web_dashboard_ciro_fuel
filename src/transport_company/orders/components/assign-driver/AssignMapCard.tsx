export function AssignMapCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-[#162155]">الموقع على الخريطة</h2>
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <img src="/transportCompany/orderPage/AssignPage/location.svg" alt="" className="w-5 h-5" />
        </div>
      </div>
      <div className="flex-1 w-full rounded-xl overflow-hidden border border-slate-200 relative min-h-[250px]">
        <img src="/transportCompany/orderPage/orderDetails/map.png" alt="Map" className="w-full h-full object-cover" />
        <button className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:bg-white transition-colors">
          <img src="/transportCompany/orderPage/orderDetails/buttonMap.svg" alt="" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
