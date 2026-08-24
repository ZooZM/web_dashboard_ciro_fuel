export interface NewFuelRequestFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export function NewFuelRequestForm({ onCancel, onSubmit }: NewFuelRequestFormProps) {
  return (
    <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 flex flex-col gap-6 w-full mb-6 font-sans shadow-sm" dir="rtl">
      
      {/* Row 1: Delivery Date & Fuel Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Date */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 mr-1">موعد التسليم</label>
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-300 transition-colors">
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-900">موعد التسليم</span>
              <span className="text-xs font-semibold text-slate-400 mt-0.5">تحديد اليوم و الوقت</span>
            </div>
            <img src="/petrolCompany/requests/date.svg" alt="" className="w-5 h-5" />
          </div>
        </div>

        {/* Fuel Type */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 mr-1">نوع الوقود</label>
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 h-full cursor-pointer hover:border-blue-300 transition-colors">
            <span className="text-sm font-black text-slate-900">بنزين 98</span>
            <img src="/petrolCompany/requests/chevronDown.svg" alt="" className="w-4 h-4 " />
          </div>
        </div>
      </div>

      {/* Row 2: Volume */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-500 mr-1">الكمية</label>
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-2 py-2">
          <button className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
            <img src="/petrolCompany/requests/minus.svg" alt="Minus" className="w-4 h-4" />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-lg font-black text-slate-900">20,000</span>
            <span className="text-xs font-bold text-slate-400">لتر</span>
          </div>

          <button className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
            <img src="/petrolCompany/requests/add.svg" alt="Add" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 3: City & Region */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 mr-1">المدينة</label>
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-300 transition-colors">
            <span className="text-sm font-black text-slate-900">جدة</span>
            <img src="/petrolCompany/requests/chevronDown.svg" alt="" className="w-4 h-4 " />
          </div>
        </div>

        {/* Region */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 mr-1">المنطقة</label>
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-300 transition-colors">
            <span className="text-sm font-black text-slate-900">حي الروضة</span>
            <img src="/petrolCompany/requests/chevronDown.svg" alt="" className="w-4 h-4 " />
          </div>
        </div>
      </div>

      {/* Row 4: Location Link */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-500 mr-1">رابط الموقع</label>
        <div className="flex items-center justify-start bg-white border border-slate-200 rounded-xl px-4 py-3 cursor-text focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <img src="/petrolCompany/requests/pin.svg" alt="" className="w-5 h-5  ml-2" />
          <input 
            type="text" 
            placeholder="رابط الموقع الجغرافي" 
            className="w-full text-sm font-semibold text-center focus:outline-none placeholder:text-slate-400 bg-transparent"
          />
        </div>
      </div>

      {/* Row 5: Notes */}
      <div className="flex flex-col gap-2">
        <textarea 
          placeholder="ملاحظات إضافية عن الطلب..." 
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 min-h-[120px] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none placeholder:text-slate-400 transition-all"
        ></textarea>
      </div>

      {/* Row 6: Estimated Total */}
      <div className="flex items-center justify-between bg-[#EFF6FF] border border-blue-100 rounded-xl px-5 py-4">
        <span className="text-sm font-bold text-slate-700">الإجمالي التقديري</span>
        <span className="text-lg font-black text-blue-600" style={{ direction: 'rtl' }}>0 ر.س</span>
      </div>

      {/* Row 7: Actions */}
      <div className="flex items-center justify-end gap-3 mt-2">
        <button 
          onClick={onCancel}
          className="flex items-center justify-center gap-2 bg-red-50 text-red-500 px-6 py-3 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
        >
          <span className="mb-0.5">إلغاء</span>
          <img src="/petrolCompany/requests/X.svg" alt="" className="w-3 h-3" />
        </button>

        <button 
          onClick={onSubmit}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <img src="/petrolCompany/requests/add.svg" alt="" className="w-4 h-4 brightness-0 invert" />
          <span>أرسل الطلب</span>
        </button>
      </div>

    </div>
  );
}
