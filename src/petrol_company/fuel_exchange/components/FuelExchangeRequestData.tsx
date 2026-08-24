interface FuelExchangeRequestDataProps {
  isAccepted: boolean;
}

export function FuelExchangeRequestData({ isAccepted }: FuelExchangeRequestDataProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      
      {/* Card Header */}
      <div className="flex items-center justify-start gap-2 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
          <img src="/petrolCompany/requests/details/details.svg" alt="" className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-black text-slate-900">بيانات الطلب</h2>
      </div>

      {/* Supplier / Receiver (Only when Accepted) */}
      {isAccepted && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Supplier (Right) */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-white p-1 shrink-0">
                <img src="/petrolCompany/requests/petro-aman.jpg" alt="الطاقة الحديثة" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col items-start text-right">
                <span className="text-xs font-bold text-slate-400 mb-1">المورد</span>
                <span className="text-sm font-black text-slate-900">الطاقة الحديثة</span>
              </div>
            </div>
            
            {/* Receiver (Left) */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-white p-1 shrink-0">
                <img src="/petrolCompany/requests/petro-aman.jpg" alt="بترو أمان" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col items-start text-right">
                <span className="text-xs font-bold text-slate-400 mb-1">المستلم</span>
                <span className="text-sm font-black text-slate-900">بترو أمان</span>
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-slate-100 mb-6"></div>
        </>
      )}

      {/* Data Grid */}
      <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-right">
        {/* Right Column: Volume */}
        <div className="flex flex-col items-start">
          <span className="text-xs font-bold text-slate-400 mb-1">الكمية</span>
          <span className="text-base font-black text-slate-900">20,000 لتر</span>
        </div>
        {/* Left Column: Fuel Type */}
        <div className="flex flex-col items-start">
          <span className="text-xs font-bold text-slate-400 mb-1">نوع الوقود</span>
          <span className="text-base font-black text-slate-900">بنزين 95</span>
        </div>
        
        {/* Right Column: Price per liter */}
        <div className="flex flex-col items-start">
          <span className="text-xs font-bold text-slate-400 mb-1">سعر اللتر</span>
          <span className="text-base font-black text-slate-900">2.30 ر.س</span>
        </div>
        {/* Left Column: Estimated Total */}
        <div className="flex flex-col items-start">
          <span className="text-xs font-bold text-slate-400 mb-1">الإجمالي التقديري</span>
          <span className="text-base font-black text-slate-900">96,600 ر.س</span>
        </div>
      </div>

      <div className="h-px w-full bg-slate-100 my-6"></div>

      {/* Location & Date */}
      <div className="grid grid-cols-2 gap-4 text-right mb-6">
        {/* Right Column: Location */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
            <img src="/petrolCompany/requests/details/gunStation.svg" alt="" className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold text-slate-400 mb-1">الموقع</span>
            <span className="text-sm font-black text-slate-900">جدة - طريق مكة القديم</span>
          </div>
        </div>
        
        {/* Left Column: Date */}
        <div className="flex flex-col items-start pt-1">
          <span className="text-xs font-bold text-slate-400 mb-1">موعد التسليم</span>
          <span className="text-sm font-black text-slate-900">اليوم، 04:30 م</span>
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-start gap-2">
          <img src="/petrolCompany/requests/details/comment.svg" alt="" className="w-4 h-4 opacity-50" />
          <span className="text-xs font-bold text-slate-400">ملاحظات</span>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 text-sm font-semibold text-slate-500 text-right border border-slate-100">
          يرجى الالتزام بموعد التسليم والتواصل قبل الوصول بـ 15 دقيقة.
        </div>
      </div>

    </div>
  );
}
