export function CustomerDataCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center relative">
      <div className="w-full flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/orderPage/orderDetails/user.svg" alt="" className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-black text-[#162155]">بيانات العميل</h2>
      </div>
      
      <div className="w-10 h-10 rounded-full bg-slate-100 mb-4 overflow-hidden border-2 border-white shadow-sm">
        <img src="/orderPage/orderDetails/profile.png" alt="avatar" className="w-full h-full object-cover" />
      </div>
      <span className="text-[#162155] font-black text-xl mb-1">محمد أحمد</span>
      <div className="flex items-center gap-2 text-slate-500 text-sm font-bold mb-8">
        <span>رقم الجوال</span>
        <span className="text-[#162155]" dir="ltr">05xxxxxxx</span>
      </div>
      
      <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-blue-600 px-4 py-3 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm">
        <img src="/orderPage/orderDetails/phone.svg" alt="" className="w-4 h-4" />
        تواصل مع العميل
      </button>
    </div>
  );
}
