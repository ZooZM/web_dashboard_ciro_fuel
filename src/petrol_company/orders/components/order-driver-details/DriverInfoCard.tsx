import { Lock, Edit } from 'lucide-react';

export function DriverInfoCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 w-full h-fit">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/transportCompany/DriverPage/editDriver/user.svg" alt="" className="w-6 h-6 object-contain" />
          </div>
          <span className="text-[#162155] font-bold text-base">معلومات السائق</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">

        {/* اسم السائق */}
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-400 text-xs font-bold">اسم السائق</span>
          <span className="text-[#162155] font-black text-sm">محمد إبراهيم</span>
        </div>

        {/* كود السائق */}
        <div className="flex flex-col gap-1 text-right">
          <div className="flex items-center justify-start gap-1.5">
            <span className="text-slate-400 text-xs font-bold">كود السائق</span>
          </div>
          <span className="text-slate-800 font-black text-sm">TRN-2024-001</span>
        </div>

        {/* رقم الإقامة */}
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-400 text-xs font-bold">رقم الإقامة</span>
          <span className="text-[#162155] font-black text-sm">2235222243</span>
        </div>

        {/* رقم الجوال */}
        <div className="flex flex-col gap-1 text-right">
          <div className="flex items-center justify-start gap-1.5">
            <span className="text-slate-400 text-xs font-bold">رقم الجوال</span>
          </div>
          <span className="text-[#162155] font-black text-sm" dir="ltr">05xxxxxxxx</span>
        </div>

        {/* محل الإقامة */}
        <div className="flex flex-col gap-1 text-right col-span-2">
          <span className="text-slate-400 text-xs font-bold">محل الإقامة</span>
          <span className="text-[#162155] font-black text-sm">جدة - حي الروضة</span>
        </div>

      </div>
    </div>
  );
}
