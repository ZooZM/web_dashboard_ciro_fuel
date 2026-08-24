export function DriverTruckCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 w-full h-fit">
      {/* Header */}
      <div className="flex items-center  w-full border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/transportCompany/DriverPage/editDriver/truck.svg" alt="" className="w-6 h-6 object-contain" />
          </div>
          <span className="text-[#162155] font-black text-lg">الشاحنة الحالية</span>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-2 gap-y-6 gap-x-4">


        {/* Right Col (رقم اللوحة) */}
        <div className="flex flex-col gap-1 text-center">
          <span className="text-slate-400 text-xs font-bold">رقم اللوحة</span>
          <span className="text-slate-800 font-black text-sm">أ ب ت - 1234</span>
        </div>
        {/* Left Col (السعة) */}
        <div className="flex flex-col gap-1 text-center">
          <span className="text-slate-400 text-xs font-bold">السعة</span>
          <span className="text-[#162155] font-black text-sm">20,000 لتر</span>
        </div>


        {/* Right Col (رقم التانك) */}
        <div className="flex flex-col gap-1 text-center">
          <span className="text-slate-400 text-xs font-bold">رقم التانك</span>
          <span className="text-slate-800 font-black text-sm">264659</span>
        </div>
        {/* Left Col (نوع التانك) */}
        <div className="flex flex-col gap-1 text-center">
          <span className="text-slate-400 text-xs font-bold">نوع التانك</span>
          <span className="text-slate-800 font-black text-sm">حديد</span>
        </div>
      </div>
    </div>
  );
}
