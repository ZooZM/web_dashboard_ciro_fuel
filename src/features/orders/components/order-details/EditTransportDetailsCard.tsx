import { Check, X } from 'lucide-react';

export function EditTransportDetailsCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/orderPage/orderDetails/edit.svg" alt="" className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-black text-[#162155]">تعديل تفاصيل النقل</h2>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-2 text-right">
          <label className="text-sm font-bold text-slate-500">أجرة النقل</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <img src="/orderPage/editOrder/dollarSign.svg" alt="" className="w-5 h-5 " />
            </div>
            <input
              type="text"
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-[#162155] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              placeholder="أجرة النقل"
              defaultValue=""
              dir="rtl"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2 text-right">
          <label className="text-sm font-bold text-slate-500">موعد التسليم المطلوب</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <img src="/orderPage/editOrder/date.svg" alt="" className="w-5 h-5 " />
            </div>
            <div className="w-full bg-white border border-slate-200 rounded-xl py-2 px-4 flex flex-col items-start justify-center cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="text-[#162155] font-bold text-sm">تحديد موعد التسليم</span>
              <span className="text-slate-400 text-xs">اليوم، 04:30 م</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <button className="flex-1 flex justify-center items-center gap-2 bg-[#E8F5E9] text-[#2E7D32] border border-green-200 py-3 rounded-xl text-sm font-bold hover:bg-green-100 transition-colors" onClick={() => window.history.back()}>
          <Check className="w-5 h-5" />
          إرسال التعديل
        </button>
        <button className="flex-1 flex justify-center items-center gap-2 bg-white border border-red-200 text-red-500 py-3 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors" onClick={() => window.history.back()}>
          <X className="w-5 h-5" />
          إلغاء
        </button>
      </div>
    </div>
  );
}
