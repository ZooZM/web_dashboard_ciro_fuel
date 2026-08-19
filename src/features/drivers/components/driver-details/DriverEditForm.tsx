import { Check, X, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

export function DriverEditForm({ onCancel }: { onCancel: () => void }) {
  const [capacity, setCapacity] = useState('20,000');

  const adjustCapacity = (delta: number) => {
    const current = Number(capacity.replace(/,/g, '')) || 0;
    const next = Math.max(0, current + delta);
    setCapacity(next.toLocaleString('en-US'));
  };

  return (
    <div className="flex flex-col gap-6 mt-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-[#162155] font-black text-xl text-right w-full">تعديل البيانات</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        
        {/* Right Card: الصورة والبيانات الأساسية */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-8 w-full">
          {/* Header */}
          <div className="flex items-center justify-start w-full pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <img src="/DriverPage/editDriver/user.svg" alt="" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-[#162155] font-black text-lg">الصورة والبيانات الأساسية</span>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col items-center gap-6">
            
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm">
                  <img src="/DriverPage/editDriver/profile.jpg" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-0 left-0 bg-blue-50 p-1 rounded-full border border-blue-100 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm">
                   <img src="/DriverPage/editDriver/blueEdit.svg" alt="Edit" className="w-4 h-4 object-contain" />
                </button>
              </div>
              <span className="text-slate-400 font-normal text-xs">بحد أقصى 2 MB - PNG أو JPG</span>
            </div>

            {/* Name Input */}
            <div className="flex flex-col gap-2 w-full text-right">
              <label className="text-slate-500 font-bold text-sm">الاسم ثلاثي</label>
              <input 
                type="text" 
                defaultValue="محمد إبراهيم"
                placeholder="إسم السائق"
                className="w-full text-right px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 font-bold text-sm placeholder:text-slate-300"
              />
            </div>

          </div>
        </div>

        {/* Left Card: بيانات الشاحنة */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-8 w-full">
          {/* Header */}
          <div className="flex items-center justify-start w-full pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <img src="/DriverPage/editDriver/truck.svg" alt="" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-[#162155] font-black text-lg">بيانات الشاحنة</span>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-6">
            
            {/* Truck Number Input */}
            <div className="flex flex-col gap-2 w-full text-right">
              <label className="text-slate-500 font-bold text-sm">رقم اللوحة</label>
              <input 
                type="text" 
                defaultValue="أ ب ت - 1234"
                className="w-full text-center px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-400 font-bold text-sm"
              />
            </div>

            {/* Capacity Input */}
            <div className="flex flex-col gap-2 w-full text-right mt-auto">
              <label className="text-slate-500 font-bold text-sm">السعة</label>
              <div className="flex items-center border border-slate-200 rounded-xl p-1 h-[48px]">
                <button type="button" onClick={() => adjustCapacity(-1000)} className="w-10 h-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
                  <Minus className="w-5 h-5 text-slate-400" />
                </button>
                <div className="flex-1 flex flex-col items-center justify-center h-full">
                   <span className="text-[#162155] font-black text-sm">{capacity}</span>
                   <span className="text-slate-400 font-bold text-[10px]">لتر</span>
                </div>
                <button type="button" onClick={() => adjustCapacity(1000)} className="w-10 h-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-slate-400">
                  <Plus className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center flex-col sm:flex-col md:flex-col lg:flex-row gap-4 justify-end w-full">
         <button 
           onClick={onCancel} 
           className="flex items-center justify-center gap-2 bg-white text-red-500 border border-red-200 px-8 py-3 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors shadow-sm"
         >
           إلغاء
           <X className="w-4 h-4" />
         </button>
         <button 
           onClick={onCancel}
           className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
         >
           حفظ البيانات
           <Check className="w-4 h-4" />
         </button>
      </div>

    </div>
  );
}
