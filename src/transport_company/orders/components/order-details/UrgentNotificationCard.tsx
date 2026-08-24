import { AlertCircle } from 'lucide-react';

export function UrgentNotificationCard() {
  return (
    <div className="bg-[#FFF5F5] border-2 border-red-300 rounded-2xl p-6 border-dashed relative">
      <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className='flex flex-col'>
                <h2 className="text-[#162155] text-lg font-black ">أخطار عاجل</h2>
                <span className="text-slate-500 text-xs font-bold ">منذ 6 دقائق</span>
              </div>
          </div>
      </div>

      <p className="text-slate-900 font-bold mb-2 leading-relaxed text-center lg:text-right">
        توقف السائق <span className="text-red-600 mx-1">محمد إبراهيم</span> عن الحركة لأكثر من 10 دقائق أثناء تنفيذ طلب نقل الوقود.
      </p>
      <p className="text-red-400 text-sm font-medium mb-8 text-center lg:text-right">
        قد يحتاج دعماً أو تكون هناك مشكلة في الطريق.
      </p>

      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm font-bold flex-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">الموقع الحالي:</span>
              <span className="text-slate-800">طريق مكة القديم - جدة</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">المسافة المتبقية:</span>
              <span className="text-slate-800">0.8 كم</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">الشاحنة:</span>
              <span className="text-slate-800">أ ب ت - 1234</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">رقم السائق:</span>
              <span className="text-slate-800 text-left" dir="ltr">05xxxxxxx</span>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 text-red-600 bg-transparent border border-red-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 shadow-sm shrink-0">
            <img src="/transportCompany/orderPage/orderDetails/share.svg" alt="" className="w-4 h-4" />
            مشاركة الموقع
          </button>
      </div>

      <button className="w-full mt-4 flex items-center justify-center gap-2 text-red-600 bg-red-50/80 border border-red-200 px-4 py-3 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors">
          <img src="/transportCompany/orderPage/orderDetails/redRightCheck.svg" alt="" className="w-4 h-4 " />
          تم التعامل مع الأمر
      </button>
    </div>
  );
}
