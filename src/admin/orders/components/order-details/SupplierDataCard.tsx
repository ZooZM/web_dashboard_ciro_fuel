export function SupplierDataCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center relative">
      <div className="w-full flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/sideBar/stations.svg" alt="" className="w-5 h-5 opacity-70" />
          </div>
          <h2 className="text-xl font-black text-[#162155]">بيانات المورد</h2>
        </div>
        <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm shrink-0">
          <img src="/transportCompany/orderPage/orderDetails/link.svg" alt="" className="w-5 h-5" />
        </button>
      </div>
      
      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4">
        <img src="/sideBar/petroAman.svg" alt="supplier" className="w-8 h-8 opacity-90" />
      </div>
      <span className="text-[#162155] font-black text-xl mb-1">بترو أمان</span>
      <div className="flex items-center gap-2 text-slate-500 text-sm font-bold mb-8">
        <span>رقم الجوال</span>
        <span className="text-[#162155]" dir="ltr">05xxxxxxx</span>
      </div>
      
      <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-blue-600 px-4 py-3 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm">
        <img src="/transportCompany/orderPage/orderDetails/phone.svg" alt="" className="w-4 h-4" />
        تواصل مع المسؤول
      </button>
    </div>
  );
}
