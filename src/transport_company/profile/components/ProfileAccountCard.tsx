export function ProfileAccountCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-8 w-full h-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3 justify-start">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/transportCompany/profilePage/user.svg" alt="" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-[#162155] font-black text-lg">بيانات الحساب</span>
        </div>
        <span className="bg-[#DCFCE7] text-[#16A34A] px-3 py-1 rounded-full text-xs font-bold shrink-0">نشط</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-y-8 gap-x-4">
        {/* Left: المسمى الوظيفي */}
        <div className="flex flex-col gap-1 text-center">
          <span className="text-slate-400 text-xs font-bold">المسمى الوظيفي</span>
          <span className="text-[#162155] font-black text-sm">مدير العمليات</span>
        </div>
        {/* Right: الاسم الكامل */}
        <div className="flex flex-col gap-1 text-center">
          <span className="text-slate-400 text-xs font-bold">الاسم الكامل</span>
          <span className="text-[#162155] font-black text-sm">أحمد السبيعي</span>
        </div>
        
        {/* Left: البريد الإلكتروني */}
        <div className="flex flex-col gap-1 text-center">
          <span className="text-slate-400 text-xs font-bold">البريد الإلكتروني</span>
          <span className="text-[#162155] font-black text-sm">ahmed.subaie@trn.sa</span>
        </div>
        {/* Right: رقم الجوال */}
        <div className="flex flex-col gap-1 text-center">
          <span className="text-slate-400 text-xs font-bold">رقم الجوال</span>
          <span className="text-[#162155] font-black text-sm">05xxxxxxxxxx</span>
        </div>
      </div>
    </div>
  );
}
