import { useState } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';

export function ProfileCompanyCard() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col gap-8 w-full h-full relative transition-colors ${isEditing ? 'border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,1)]' : 'border-[#E7E9EF]'}`}>
      {/* Top Left Actions */}
      {!isEditing ? (
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-6 left-6 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
        >
          <img src="/transportCompany/profilePage/edit (2).svg" alt="تعديل" className="w-6 h-6 object-contain" />
        </button>
      ) : (
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <button 
            onClick={() => setIsEditing(false)}
            className="w-8 h-8 rounded-lg bg-white border border-red-200 flex items-center justify-center hover:bg-red-50 transition-colors"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
          <button 
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-1.5 px-3 h-8 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] hover:bg-green-100 transition-colors text-xs font-bold"
          >
            حفظ
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-start w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/transportCompany/profilePage/filledTruck.svg" alt="" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-[#162155] font-black text-lg">بيانات الشركة</span>
        </div>
      </div>

      {/* Form / Grid */}
      <div className="flex flex-col gap-6 mt-2">
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* اسم الشركة */}
          <div className="flex flex-col gap-2 text-right">
            <span className="text-[#858C95] text-xs font-bold">اسم الشركة</span>
            {!isEditing ? (
              <span className="text-[#162155] font-black text-sm">شركة النقل المتحدة</span>
            ) : (
              <input 
                type="text" 
                defaultValue="شركة النقل المتحدة"
                className="w-full h-11 border border-[#E7E9EF] rounded-lg px-3 outline-none focus:border-blue-500 transition-colors text-sm font-bold text-[#162155]"
              />
            )}
          </div>
          {/* رقم السجل التجاري */}
          <div className="flex flex-col gap-2 text-right">
            <span className="text-[#858C95] text-xs font-bold">رقم السجل التجاري</span>
            {!isEditing ? (
              <span className="text-[#162155] font-black text-sm">1010445872</span>
            ) : (
              <input 
                type="text" 
                defaultValue="1010445872"
                className="w-full h-11 border border-[#E7E9EF] rounded-lg px-3 outline-none focus:border-blue-500 transition-colors text-sm font-bold text-[#162155]"
              />
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* المدينة / المقر الرئيسي */}
          <div className="flex flex-col gap-2 text-right">
            <span className="text-[#858C95] text-xs font-bold">المدينة / المقر الرئيسي</span>
            {!isEditing ? (
              <span className="text-[#162155] font-black text-sm">جدة - حي الروضة</span>
            ) : (
              <div className="flex items-center justify-between w-full h-11 border border-[#E7E9EF] rounded-lg px-3 bg-white focus-within:border-blue-500 transition-colors cursor-pointer">
                <span className="text-sm font-bold text-[#162155]">جدة - حي الروضة</span>
                <ChevronDown className="w-4 h-4 text-[#858C95]" />
              </div>
            )}
          </div>
          {/* كود الشركة */}
          <div className="flex flex-col gap-2  text-right items-center">
            <div className="flex flex-row items-center justify-start gap-2 mt-1 w-full">
               <span className="text-[#858C95] text-xs font-bold">كود الشركة</span>
               <span className="bg-[#F1F3F5] text-[#858C95] px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                  <img src="/transportCompany/profilePage/filledLock.svg" alt="" className="w-3 h-3 object-contain" />
                  غير قابل للتعديل
               </span>
            </div>
            <span className="text-[#162155] font-black text-sm text-end w-full" dir="ltr">TRN-2024-001</span>
          </div>
        </div>
      </div>
    </div>
  );
}
