export function AdminProfileAdditionalData() {
  return (
    <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col gap-6 w-full">
       <div className="flex items-center justify-start w-full">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
             <img src="/transportCompany/profilePage/detail.svg" alt="" className="w-5 h-5 object-contain" />
           </div>
           <span className="text-[#162155] font-black text-lg">بيانات إضافية</span>
         </div>
       </div>

       <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-[#E7E9EF] pb-4">
             <span className="text-[#858C95] text-xs font-bold w-1/2">تاريخ بدء التعاقد مع المنصة</span>
             <span className="text-[#162155] font-black text-sm" dir="ltr">2022/01/15</span>
          </div>

          <div className="flex items-center justify-between pb-2">
             <span className="text-[#858C95] text-xs font-bold w-1/2">عدد المدن المغطاة</span>
             <span className="text-[#162155] font-black text-sm">4 مدن</span>
          </div>
       </div>
    </div>
  );
}
