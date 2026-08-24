import { useState } from 'react';
import { Check, X } from 'lucide-react';

export function ProfileAccountCard() {
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
            <img src="/transportCompany/profilePage/user.svg" alt="" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-[#162155] font-black text-lg">بيانات المسؤول</span>
        </div>
      </div>

      {/* Form / Grid */}
      <div className="flex flex-col gap-6 mt-2">
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* الاسم الكامل */}
          <div className="flex flex-col gap-2 text-right">
            <span className="text-[#858C95] text-xs font-bold">الاسم الكامل</span>
            {!isEditing ? (
              <span className="text-[#162155] font-black text-sm">عباس أبو الحسن</span>
            ) : (
              <input 
                type="text" 
                defaultValue="عباس أبو الحسن"
                className="w-full h-11 border border-[#E7E9EF] rounded-lg px-3 outline-none focus:border-blue-500 transition-colors text-sm font-bold text-[#162155]"
              />
            )}
          </div>
          {/* المسمى الوظيفي */}
          <div className="flex flex-col gap-2 text-right">
            <span className="text-[#858C95] text-xs font-bold">المسمى الوظيفي</span>
            {!isEditing ? (
              <span className="text-[#162155] font-black text-sm">مدير العمليات</span>
            ) : (
              <input 
                type="text" 
                defaultValue="مدير العمليات"
                className="w-full h-11 border border-[#E7E9EF] rounded-lg px-3 outline-none focus:border-blue-500 transition-colors text-sm font-bold text-[#162155]"
              />
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* رقم الجوال */}
          <div className="flex flex-col gap-2 text-right">
            <span className="text-[#858C95] text-xs font-bold">رقم الجوال</span>
            <span className="text-[#162155] font-black text-sm" dir="ltr">05xxxxxxxx</span>
          </div>
          {/* البريد الإلكتروني */}
          <div className="flex flex-col gap-2 text-right">
            <span className="text-[#858C95] text-xs font-bold">البريد الإلكتروني</span>
            {!isEditing ? (
              <span className="text-[#162155] font-black text-sm">ahmed.subaie@trn.sa</span>
            ) : (
              <input 
                type="text" 
                defaultValue="ahmed.subaie@trn.sa"
                className="w-full h-11 border border-[#E7E9EF] rounded-lg px-3 outline-none focus:border-blue-500 transition-colors text-sm font-bold text-[#162155] text-left"
                dir="ltr"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
