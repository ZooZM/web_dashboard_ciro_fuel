export function AdminProfilePermissions() {
  return (
    <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col gap-6 w-full relative">
       <div className="flex items-center justify-start w-full">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
             <img src="/transportCompany/profilePage/rightCheck.svg" alt="" className="w-5 h-5 object-contain" />
           </div>
           <span className="text-[#162155] font-black text-lg">الصلاحيات</span>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "تسجيل الشركات",
            "إدارة النزاعات والبلاغات",
            "الوصول للتقارير المالية الكاملة",
            "تعليق/إيقاف أي حساب",
            "إرسال إشعارات للمنصة"
          ].map((permission, index) => (
            <div key={index} className={`bg-[#F8FAFC] rounded-lg p-3 flex items-center justify-start gap-2 border border-[#E7E9EF] ${index === 4 ? 'md:col-span-2' : ''}`}>
               <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                 <img src="/transportCompany/profilePage/whiteRightCheck.svg" alt="" className="w-3 h-3 object-contain" />
               </div>
               <span className="text-[#858C95] text-sm font-bold">{permission}</span>
            </div>
          ))}
       </div>
    </div>
  );
}
