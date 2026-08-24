export function ContactInfoCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-start gap-2">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <img src="/transportCompany/HelpPage/comment.svg" className="w-5 h-5 object-contain" alt="" />
        </div>
        <span className="text-[#162155] font-black text-sm">معلومات التواصل</span>
      </div>

      {/* Info List */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-slate-400 font-bold text-[11px]">رقم الدعم المباشر</span>
          <span className="text-[#162155] flex flex-end justify-end font-black text-sm" dir="ltr">920-xxxxxx</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-slate-400 font-bold text-[11px]">البريد الإلكتروني</span>
          <span className="text-[#162155] font-black text-sm">support@cirofuel.sa</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-slate-400 font-bold text-[11px]">ساعات العمل</span>
          <span className="text-[#162155] font-black text-sm">يومياً من 8 ص إلى 12 م</span>
        </div>
      </div>

    </div>
  );
}
