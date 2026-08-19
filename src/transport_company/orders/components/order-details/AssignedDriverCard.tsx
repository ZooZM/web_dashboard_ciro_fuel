import { Star, Phone, Info } from 'lucide-react';

export function AssignedDriverCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      
      {/* 1. Header (Title) */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <img src="/orderPage/orderDetails/driver.svg" alt="" className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-black text-[#162155]">السائق المسند</h2>
      </div>

      {/* 2. Driver Info & Link Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
            <img src="https://i.pravatar.cc/150?img=12" alt="driver" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col text-right gap-0.5">
            <span className="text-[#162155] font-black text-lg">محمد إبراهيم</span>
            <div className="flex items-center justify-end gap-1" dir="ltr">
              <span className="text-[#162155] font-bold text-sm">4.1</span>
              <Star className="w-3.5 h-3.5 text-orange-500" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm shrink-0">
          <img src="/orderPage/orderDetails/link.svg" alt="" className="w-5 h-5" />
        </button>
      </div>

      {/* 3. Grid Data */}
      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
        <div className="flex flex-col gap-1.5 text-right">
            <span className="text-slate-400 text-sm font-bold">كود السائق</span>
            <span className="text-[#162155] font-black text-base">8774371</span>
        </div>
        <div className="flex flex-col gap-1.5 text-right">
            <span className="text-slate-400 text-sm font-bold">رقم الجوال</span>
            <span className="text-[#162155] font-black text-base" dir="ltr">05xxxxxxx</span>
        </div>
        <div className="flex flex-col gap-1.5 text-right">
            <span className="text-slate-400 text-sm font-bold">الشاحنة</span>
            <span className="text-[#162155] font-black text-base">أ ب ت - 1234</span>
        </div>
        <div className="flex flex-col gap-1.5 text-right">
            <span className="text-slate-400 text-sm font-bold">السعة</span>
            <span className="text-[#162155] font-black text-base">20,000 لتر</span>
        </div>
        <div className="flex flex-col gap-1.5 text-right">
            <span className="text-slate-400 text-sm font-bold">وقت الوصول المتوقع</span>
            <span className="text-[#162155] font-black text-base">04:25 م</span>
        </div>
        <div className="flex flex-col gap-1.5 text-right">
            <span className="text-slate-400 text-sm font-bold">وقت النقل</span>
            <span className="text-[#162155] font-black text-base">04:25 م</span>
        </div>
      </div>

      {/* 4. Customer Evaluation */}
      <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 text-sm font-bold">تقييم العميل</span>
          <div className="flex items-center gap-1.5" dir="ltr">
            <span className="text-[#162155] font-black text-sm">4.1</span>
            <Star className="w-4 h-4 text-orange-500" strokeWidth={2.5} />
          </div>
        </div>
        <div className="bg-[#EEF2FF] rounded-lg p-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-slate-400 shrink-0" />
          <span className="text-slate-500 text-sm font-medium pt-0.5">سائق ممتاز و نفذ المطلوب في تعليمات الطلب.</span>
        </div>
      </div>

      {/* 5. Contact Button */}
      <button className="w-full border border-slate-200 rounded-xl py-3.5 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
        <Phone className="w-4 h-4 text-blue-600" />
        <span className="text-blue-600 font-bold text-sm">تواصل مع السائق</span>
      </button>

    </div>
  );
}
