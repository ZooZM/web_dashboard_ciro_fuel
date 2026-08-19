export function ProfileCompanyCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-8 w-full h-full relative">
      {/* Header */}
      <div className="flex items-center justify-start w-full pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <img src="/profilePage/station.svg" alt="" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-[#162155] font-black text-lg">بيانات الشركة</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center justify-center flex-1 gap-2">
        <div className="w-16 h-16 rounded-full border border-slate-200 overflow-hidden flex items-center justify-center mb-2 shadow-sm p-1">
          <img src="/profilePage/petroAman.jpg" alt="Company Logo" className="w-full h-full object-contain rounded-full" />
        </div>
        <span className="text-[#162155] font-black text-base">شركة النقل المتحدة</span>
        <span className="text-slate-400 font-bold text-xs">TRN-2024-001</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between w-full mt-auto">
         <span className="text-[#162155] font-black text-sm">جدة - حي الروضة</span>
         <span className="text-slate-400 font-bold text-xs">مقر الإقامة</span>
      </div>
    </div>
  );
}
