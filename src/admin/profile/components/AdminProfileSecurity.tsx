interface AdminProfileSecurityProps {
  onOpenPhoneModal: () => void;
}

export function AdminProfileSecurity({ onOpenPhoneModal }: AdminProfileSecurityProps) {
  return (
    <div className="bg-gradient-to-b from-orange-100 via-orange-50 to-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col gap-6 w-full">
       <div className="flex items-center justify-start w-full">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
              <img src="/transportCompany/profilePage/lock.svg" alt="" className="w-6 h-6 object-contain" />
           </div>
           <span className="text-[#162155] font-black text-lg">الأمان وتسجيل الدخول</span>
         </div>
       </div>

       <div className="flex flex-col gap-5">
          <div className="bg-white border border-[#E7E9EF] rounded-lg px-3 py-3">
            <span className="text-[#858C95] text-xs font-medium block text-center">
               الدخول يتم دائماً برقم الجوال ورمز تحقق (OTP) دون كلمة مرور
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-[#E7E9EF] pb-4">
             <span className="text-[#858C95] text-xs font-bold">رقم الدخول المعتمد</span>
             <span className="text-[#162155] font-black text-sm" dir="ltr">+966 55xxxxxxx</span>
          </div>

          <div className="flex items-center justify-between border-b border-[#E7E9EF] pb-4">
             <span className="text-[#858C95] text-xs font-bold">آخر تسجيل دخول</span>
             <span className="text-[#162155] font-black text-sm">اليوم 08:52 ص</span>
          </div>

          <div className="flex items-center justify-between pb-2">
             <span className="text-[#858C95] text-xs font-bold">الجلسات النشطة</span>
             <span className="text-[#162155] font-black text-sm">جلستان</span>
          </div>

          <button 
            onClick={onOpenPhoneModal}
            className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg py-3 transition-colors font-bold text-sm"
          >
             <img src="/transportCompany/profilePage/orangeEdit.svg" alt="" className="w-4 h-4 object-contain" />
             تغيير رقم الجوال
          </button>
       </div>
    </div>
  );
}
