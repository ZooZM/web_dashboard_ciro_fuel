import React from 'react';

interface AddTankFormProps {
  onCancel: () => void;
  entityName: string;
}

export function AddTankForm({ onCancel, entityName }: AddTankFormProps) {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Row: Capacity & Code */}
      <div className="flex gap-6 w-full">
        {/* Right Input: Tank Code (كود التانك) */}
        <div className="flex flex-col flex-1 gap-2">
          <span className="text-xs font-bold text-slate-400 text-right">كود التانك</span>
          <input 
            type="text" 
            placeholder="كود التانك" 
            className="w-full h-[60px] border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm" 
            style={{ textAlign: 'right' }}
          />
        </div>

        {/* Left Input: Capacity (السعة) */}
        <div className="flex flex-col flex-1 gap-2">
          <span className="text-xs font-bold text-slate-400 text-right">السعة</span>
          <div className="flex items-center justify-between border border-slate-200 rounded-xl bg-white p-2 h-[60px] shadow-sm">
            <button className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm font-black text-slate-900" dir="ltr">20,000</span>
              <span className="text-[10px] font-bold text-slate-400">لتر</span>
            </div>
            <button className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Body Type (نوع الهيكل) */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-400 text-right">نوع الهيكل</span>
        <div className="flex gap-6 w-full">
          
          {/* Aluminum (Right in RTL) */}
          <button className="flex-1 flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-200 transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
              <img src="/petrolCompany/orderDetails/aluminum.svg" alt="Aluminum" className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-700">ألومنيوم</span>
          </button>
          
          {/* Iron (Left in RTL) */}
          <button className="flex-1 flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-200 transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
              <img src="/petrolCompany/orderDetails/iron.svg" alt="Iron" className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-700">حديد</span>
          </button>
          
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-2">
        <button 
          onClick={onCancel}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 px-6 py-2.5 rounded-xl transition-colors text-sm font-bold" dir="ltr"
        >
          <span dir="rtl">إلغاء</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-colors text-sm font-bold shadow-sm" dir="ltr">
          <span dir="rtl">إضافة {entityName}</span>
          <img src="/transportCompany/trucks/whitePlus.svg" alt="Add" className="w-4 h-4" />
        </button>
      </div>
      
    </div>
  );
}
