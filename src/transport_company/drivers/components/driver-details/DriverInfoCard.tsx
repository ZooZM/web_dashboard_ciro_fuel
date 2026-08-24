import { useState } from 'react';
import { Check, X } from 'lucide-react';

export function DriverInfoCard() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col gap-8 w-full relative ${isEditing ? 'border-blue-500' : 'border-slate-200'}`}>
      
      {/* Top Left Action Buttons */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        {isEditing ? (
          <>
            <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 bg-[#DCFCE7] text-[#16A34A] px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-[#bbf7d0] transition-colors shadow-sm">
              <Check className="w-4 h-4" />
              حفظ
            </button>
            <button onClick={() => setIsEditing(false)} className="w-8 h-8 flex items-center justify-center bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-sm">
              <X className="w-4 h-4 text-red-500" />
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <img src="/petrolCompany/station/edit.svg" alt="" className='w-6 h-6' />
          </button>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center justify-start w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/transportCompany/DriverPage/editDriver/user.svg" alt="" />
          </div>
          <span className="text-[#162155] font-black text-lg">معلومات السائق</span>
        </div>
      </div>

      {/* Grid Content */}
      {isEditing ? (
        // EDIT MODE
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Driver Name (Right) */}
            <div className="flex flex-col gap-2 text-right">
              <label className="text-slate-500 font-bold text-sm">اسم السائق</label>
              <input 
                type="text" 
                defaultValue="محمد إبراهيم"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-[#162155] font-bold text-sm"
              />
            </div>

            {/* Driver Code (Left) */}
            <div className="flex flex-col gap-2 text-right">
              <div className="flex items-center gap-2 justify-start w-full">
                <span className="text-slate-500 font-bold text-sm">كود السائق</span>
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <img src="/transportCompany/profilePage/filledLock.svg" alt="" />
                  غير قابل للتعديل
                </span>
              </div>
              <span className="text-slate-600 font-black text-sm pt-2 w-full text-center font-sans">TRN-2024-001</span>
            </div>

            {/* Iqama Number (Right) */}
            <div className="flex flex-col gap-2 text-right">
              <label className="text-slate-500 font-bold text-sm">رقم الإقامة</label>
              <input 
                type="text" 
                defaultValue="2235222243"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-[#162155] font-bold text-sm text-right font-sans"
              />
            </div>

            {/* Phone (Left) */}
            <div className="flex flex-col gap-2 text-right">
              <div className="flex items-center gap-2 justify-start w-full">
                <span className="text-slate-500 font-bold text-sm">رقم الجوال</span>
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <img src="/transportCompany/profilePage/filledLock.svg" alt="" />
                  غير قابل للتعديل
                </span>
              </div>
              <span className="text-[#162155] font-black text-sm pt-2 w-full text-start font-sans">05xxxxxxxx</span>
            </div>

            {/* City (Right) */}
            <div className="flex flex-col gap-2 text-right">
              <label className="text-slate-500 font-bold text-sm">المدينة</label>
              <div className="relative">
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-[#162155] font-bold text-sm appearance-none cursor-pointer bg-white" dir="rtl">
                  <option value="Jeddah">جدة</option>
                  <option value="Riyadh">الرياض</option>
                  <option value="Dammam">الدمام</option>
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>

            {/* Region (Left) */}
            <div className="flex flex-col gap-2 text-right">
              <label className="text-slate-500 font-bold text-sm">المنطقة</label>
              <div className="relative">
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-[#162155] font-bold text-sm appearance-none cursor-pointer bg-white" dir="rtl">
                  <option value="Rawdah">حي الروضة</option>
                  <option value="Safa">حي الصفا</option>
                  <option value="Bawadi">حي البوادي</option>
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>

          </div>

          {/* Notes (Textarea) */}
          <div className="flex flex-col gap-2 text-right w-full mt-2">
            <textarea 
              rows={3}
              placeholder="ملاحظات إضافية عن الحساب..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-[#162155] font-bold text-sm resize-none"
            ></textarea>
          </div>
        </div>
      ) : (
        // READ-ONLY MODE
        <div className="flex flex-col gap-8 w-full mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8">
            
            {/* Driver Name */}
            <div className="flex flex-col gap-2 text-right">
              <span className="text-slate-500 font-bold text-sm">اسم السائق</span>
              <span className="text-[#162155] font-black text-lg">محمد إبراهيم</span>
            </div>

            {/* Driver Code */}
            <div className="flex flex-col gap-2 text-right">
              <div className="flex items-center gap-2 justify-center w-full">
                <span className="text-slate-500 font-bold text-sm">كود السائق</span>
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <img src="/transportCompany/profilePage/filledLock.svg" alt="" />
                  غير قابل للتعديل
                </span>
              </div>
              <span className="text-[#162155] font-black text-lg w-full text-center font-sans">TRN-2024-001</span>
            </div>

            {/* Iqama Number */}
            <div className="flex flex-col gap-2 text-right">
              <span className="text-slate-500 font-bold text-sm">رقم الإقامة</span>
              <span className="text-[#162155] font-black text-lg text-right font-sans">2235222243</span>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2 text-right">
              <div className="flex items-center gap-2 justify-center w-full">
                <span className="text-slate-500 font-bold text-sm">رقم الجوال</span>
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <img src="/transportCompany/profilePage/filledLock.svg" alt="" />
                  غير قابل للتعديل
                </span>
              </div>
              <span className="text-[#162155] font-black text-lg w-full text-center font-sans">05xxxxxxxx</span>
            </div>

            {/* City/Region */}
            <div className="flex flex-col gap-2 text-right">
              <span className="text-slate-500 font-bold text-sm">محل الإقامة</span>
              <span className="text-[#162155] font-black text-lg">جدة - حي الروضة</span>
            </div>

          </div>

          {/* Notes read-only */}
          <div className="w-full border border-dashed border-slate-300 bg-slate-50 rounded-xl p-4 text-center mt-2">
            <span className="text-slate-400 font-bold text-sm">ملاحظات على الحساب أي وجدت.</span>
          </div>
        </div>
      )}
      
    </div>
  );
}
