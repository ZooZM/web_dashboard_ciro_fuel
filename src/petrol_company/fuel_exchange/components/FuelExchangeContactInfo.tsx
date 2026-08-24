export function FuelExchangeContactInfo() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

      {/* Card Header */}
      <div className="flex items-center justify-start gap-2 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
          <img src="/petrolCompany/requests/details/details.svg" alt="" className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-black text-slate-900">معلومات التواصل</h2>
      </div>

      {/* User Info */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 mb-3 bg-slate-50">
          <img src="/petrolCompany/requests/details/profile.png" alt="عبدالله حسين" className="w-full h-full object-cover" />
        </div>
        <span className="text-base font-black text-slate-900">عبدالله حسين</span>
        <span className="text-xs font-bold text-slate-400 mt-1">مدير عمليات</span>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-slate-400 mb-1">رقم الجوال</span>
          <span className="text-sm font-black text-slate-900">920-xxxxxx</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-slate-400 mb-1">البريد الإلكتروني</span>
          <span className="text-sm font-black text-slate-900">support@cirofuel.sa</span>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-blue-200 text-blue-600 bg-white hover:bg-blue-50 transition-colors text-sm font-bold">
        <img src="/transportCompany/orderPage/orderDetails/phone.svg" alt="تواصل مع المسؤول" className="w-5 h-5 ml-2" />
        <span>تواصل مع المسؤول</span>
      </button>

    </div>
  );
}
