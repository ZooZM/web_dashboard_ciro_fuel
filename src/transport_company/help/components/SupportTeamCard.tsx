import { Star } from 'lucide-react';

export function SupportTeamCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center ">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <img src="/HelpPage/support.svg" className="w-5 h-5 object-contain" alt="" />
        </div>
        <span className="text-[#162155] font-black text-sm">فريق الدعم</span>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1 items-start">
        <div className="flex items-center justify-start gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-slate-800 font-bold text-sm">الفريق متصل الآن</span>
        </div>
        <span className="text-slate-500 font-bold text-[11px] mt-1 mr-4">
          متاح يومياً من 8 ص إلى 12 م
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-1">
          <span className="text-slate-400 font-bold text-[10px]">متوسط وقت الرد</span>
          <span className="text-[#162155] font-black text-sm">4 <span className="font-medium text-xs">دقائق</span></span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-slate-400 font-bold text-[10px]">تقييم الدعم</span>
          <div className="flex items-center gap-1 text-[#162155] font-black text-sm">
            <Star className="w-3.5 h-3.5 text-amber-400 " />
            4.1
          </div>
        </div>
      </div>

    </div>
  );
}
