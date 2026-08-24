export function OrderDataCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <img src="/transportCompany/orderPage/orderDetails/invoice.svg" alt="" className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-black text-[#162155]">بيانات الطلب</h2>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-[#DCFCE7] px-3 py-1.5 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></div>
          <span className="text-[#16A34A] text-xs font-bold">جديد</span>
        </div>
      </div>

      {/* Top Grid (2x2) */}
      <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-8 border-b border-slate-100 pb-8 px-2">
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-sm font-bold">الكمية</span>
            <span className="text-[#162155] text-lg font-black">20,000 لتر</span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-sm font-bold">أجرة النقل</span>
            <span className="text-[#162155] text-lg font-black">650 ر.س</span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-sm font-bold">الشركة</span>
            <span className="text-[#162155] text-lg font-black">بترو أمان</span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-sm font-bold">نوع الوقود</span>
            <span className="text-[#162155] text-lg font-black">بنزين 95</span>
          </div>
      </div>

      {/* Locations */}
      <div className="grid grid-cols-2 gap-4 mb-8 px-2">
          <div className="flex items-center justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
              <img src="/transportCompany/orderPage/orderDetails/gunStation.svg" alt="" className="w-6 h-6" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-slate-400 text-xs font-bold mb-1">موقع التحميل</span>
              <span className="text-[#162155] font-black text-sm">مستودع جدة الرئيسي</span>
            </div>
          </div>
          <div className="flex items-center justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
              <img src="/transportCompany/orderPage/orderDetails/station.svg" alt="" className="w-6 h-6" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-slate-400 text-xs font-bold mb-1">موقع التسليم</span>
              <span className="text-[#162155] font-black text-sm">محطة محمد - طريق مكة القديم</span>
            </div>
          </div>
      </div>

      {/* Delivery Details */}
      <div className="grid grid-cols-3 gap-4 mb-8 px-2">
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-xs font-bold">موعد التسليم المطلوب</span>
            <span className="text-[#162155] font-black text-sm">اليوم، 04:30 م</span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-xs font-bold">الوقت المتوقع</span>
            <span className="text-[#162155] font-black text-sm">28 دقيقة</span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-xs font-bold">المسافة</span>
            <span className="text-[#162155] font-black text-sm">18.4 كم</span>
          </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-3 px-2">
          <div className="flex items-center gap-2">
            <img src="/transportCompany/orderPage/orderDetails/comment.svg" alt="" className="w-4 h-4 opacity-50" />
            <span className="text-slate-400 text-xs font-bold">ملاحظات</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-slate-500 text-sm font-semibold">يرجى الالتزام بموعد التسليم والتواصل قبل الوصول بـ 15 دقيقة.</p>
          </div>
      </div>
    </div>
  );
}
