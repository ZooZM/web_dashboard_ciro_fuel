export function AdminTransportCompanyInfoCard() {
  return (
    <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <img src="/petrolCompany/transporters/addTransporter/about.svg" alt="" className="w-4 h-4 filter" style={{ filter: 'invert(27%) sepia(91%) saturate(2311%) hue-rotate(210deg) brightness(97%) contrast(92%)' }} />
          </div>
          <h3 className="text-base font-black text-[#162155]">معلومات الشركة</h3>
        </div>

        <button className="w-8 h-8 rounded-full border border-[#E7E9EF] bg-white flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/admin/petrolCompany/details/edit.svg" alt="Edit" className="w-4 h-4" onError={(e) => {
            (e.target as HTMLImageElement).src = '/petrolCompany/station/edit.svg';
          }} />
        </button>
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">

        {/* Row 1 */}
        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-[#858C95] mb-1">اسم الشركة</span>
          <span className="text-sm font-black text-[#162155]">شركة النقل المتحدة</span>
        </div>

        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2 justify-start mb-1">
            <span className="text-[11px] font-bold text-[#858C95]">كود الشركة</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500">
              <img src="/petrolCompany/transporters/details/lock.svg" alt="" className="w-2.5 h-2.5  " />
              غير قابل للتعديل
            </div>
          </div>
          <span className="text-sm font-black text-[#162155]" dir="ltr">TRN-2024-001</span>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-[#858C95] mb-1">الاسم المسؤول الكامل</span>
          <span className="text-sm font-black text-[#162155]">أحمد السبيعي</span>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-[#858C95] mb-1">المسمى الوظيفي</span>
          <span className="text-sm font-black text-[#162155]">مدير العمليات</span>
        </div>

        {/* Row 3 */}
        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-[#858C95] mb-1">البريد الإلكتروني</span>
          <span className="text-sm font-black text-[#162155] break-all" dir="ltr">ahmed.subaie@trn.sa</span>
        </div>

        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2 justify-start mb-1">
            <span className="text-[11px] font-bold text-[#858C95]">رقم الجوال</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500">
              <img src="/petrolCompany/transporters/details/lock.svg" alt="" className="w-2.5 h-2.5  " />
              غير قابل للتعديل
            </div>
          </div>
          <span className="text-sm font-black text-[#162155]" dir="ltr">05xxxxxxxx</span>
        </div>

      </div>

      {/* Footer Notes Box */}
      <div className="w-full mt-auto bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-xl p-3 text-center">
        <span className="text-[11px] font-bold text-[#858C95]">ملاحظات على الحساب أي وجدت.</span>
      </div>

    </div>
  );
}
