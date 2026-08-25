export function AdminOrderDataCard() {
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
      <div className="grid grid-cols-2 gap-y-8  mb-8 border-b border-slate-100 pb-8 px-2">
          {/* Row 1 */}
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-sm font-bold">الكمية</span>
            <span className="text-[#162155] text-lg font-black">20,000 لتر</span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-sm font-bold">العمولة لكل لتر</span>
            <span className="text-[#162155] text-lg font-black">0.13 ر.س / لتر</span>
          </div>
          {/* Row 2 */}
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-sm font-bold">المحطة</span>
            <span className="text-[#162155] text-lg font-black">جدة - الرحاب</span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-sm font-bold">نوع الوقود</span>
            <span className="text-[#162155] text-lg font-black">بنزين 95</span>
          </div>
      </div>

      {/* Locations */}
      <div className="grid grid-cols-2 gap-4 px-2">
          <div className="flex flex-row text-right justify-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                <img src="/transportCompany/orderPage/orderDetails/gunStation.svg" alt="" className="w-5 h-5" />
              </div>
            <div className="flex flex-col items-start mb-8 gap-3 justify-center">
            <span className="text-slate-400 text-xs font-bold">موقع التحميل</span>
              <span className="text-[#162155] font-black text-sm">مستودع جدة الرئيسي</span>
            </div>
          </div>
          <div className="flex text-right justify-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                <img src="/transportCompany/orderPage/orderDetails/station.svg" alt="" className="w-5 h-5" />
              </div>
            <div className="flex flex-col items-start  mb-8 gap-3 justify-center">
            <span className="text-slate-400 text-xs font-bold">موقع التسليم</span>
              <span className="text-[#162155] font-black text-sm">محطة محمد - طريق مكة القديم</span>
            </div>
          </div>
      </div>
    </div>
  );
}
