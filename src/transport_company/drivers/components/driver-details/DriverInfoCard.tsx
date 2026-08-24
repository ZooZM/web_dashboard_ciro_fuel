export function DriverInfoCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/transportCompany/DriverPage/editDriver/user.svg" alt="" className="w-6 h-6 object-contain" />
          </div>
          <span className="text-[#162155] font-bold text-base">بيانات السائق</span>
        </div>
        <div className="flex items-center gap-2 bg-[#DCFCE7] px-3 py-1 rounded-full shrink-0">
          <span className="text-[#16A34A] text-xs font-bold">نشط</span>
        </div>
      </div>

      {/* Details Row */}
      <div className="flex flex-col-reverse sm:flex-row-reverse items-center justify-between gap-4 w-full">
        <div className="flex flex-col gap-1 text-center w-full sm:w-1/3">
          <span className="text-slate-400 text-xs font-bold">مدينة الإقامة</span>
          <span className="text-slate-800 font-black text-sm">جدة - حي الروضة</span>
        </div>
        <div className="flex flex-col gap-1 text-center w-full sm:w-1/3">
          <span className="text-slate-400 text-xs font-bold">رقم الإقامة</span>
          <span className="text-slate-800 font-black text-sm">2235222243</span>
        </div>
        <div className="flex flex-col gap-1 text-center w-full sm:w-1/3">
          <span className="text-slate-400 text-xs font-bold">رقم الجوال</span>
          <span className="text-slate-800 font-black text-sm" dir="ltr">05xxxxxxxx</span>
        </div>
      </div>
    </div>
  );
}
