export function CompanyContactCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-start gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <img src="/petrolCompany/transporters/details/detail.svg" alt="" className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-black text-slate-900">معلومات التواصل</h2>
      </div>

      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 mb-3 bg-slate-50">
          <img src="/petrolCompany/transporters/details/profile.png" alt="أحمد السبيعي" className="w-full h-full object-cover" />
        </div>
        <span className="text-base font-black text-slate-900">أحمد السبيعي</span>
        <span className="text-xs font-bold text-slate-400 mt-1">مدير عمليات</span>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col items-start text-right w-full">
          <span className="text-xs font-bold text-slate-400 mb-1 w-full">رقم الجوال</span>
          <span className="text-sm font-black text-slate-900 w-full text-left" dir="ltr">920-xxxxxx</span>
        </div>
        <div className="flex flex-col items-start text-right w-full">
          <span className="text-xs font-bold text-slate-400 mb-1 w-full">البريد الإلكتروني</span>
          <span className="text-sm font-black text-slate-900 w-full text-left">support@cirofuel.sa</span>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-blue-200 text-blue-600 bg-white hover:bg-blue-50 transition-colors text-sm font-bold">
        <img src="/petrolCompany/transporters/details/phone.svg" alt="Phone" className="w-4 h-4" />
        <span>تواصل مع المسؤول</span>
      </button>
    </div>
  );
}
