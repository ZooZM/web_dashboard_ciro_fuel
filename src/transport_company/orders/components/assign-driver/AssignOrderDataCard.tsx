import { Info } from 'lucide-react';

export function AssignOrderDataCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 w-full h-full">
      
      {/* Header */}
      <div className="flex flex-col gap-1 text-right">
        <span className="text-[#162155] font-black text-lg">ORD-2024-256</span>
        <span className="text-slate-400 text-xs font-bold">شركة بترو أمان - محطة محمد</span>
      </div>

      {/* Route Info & Stats Sandwiched */}
      <div className="flex flex-col relative w-full pr-2 h-full justify-between">
        {/* Dotted Line */}
        <div className="absolute right-6 top-10 bottom-12 w-[2px] mb-2 border-r-2 border-dashed border-[#16A34A]"></div>
        {/* Down Arrow at the end of the dotted line */}
        <div className="absolute right-[19px] text-xl font-bold bottom-8 mb-3.5 text-[#16A34A]">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </div>

        {/* From */}
        <div className="flex items-start gap-4 mb-4 z-10">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white">
            <img src="/transportCompany/orderPage/AssignPage/greenPin.svg" alt="من" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[#16A34A] text-xs font-bold pb-4 mb-1">من</span>
              <div className='flex flex-col gap-0.5 text-right'>
                <span className="text-slate-800 font-bold text-sm">شركة الزيت العربية السعودية</span>
                <span className="text-slate-400 text-xs font-medium">الظهران، حي غرب الظهران، الجادة الشرقية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Box (Sandwiched) */}
        <div className="z-10 mr-12 mb-4 flex flex-col gap-3">
          <div className="border border-slate-200 rounded-xl flex items-center divide-x divide-x-reverse divide-slate-100 bg-white w-full overflow-x-auto">
                
                {/* Delivery Day */}
                <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2 whitespace-nowrap">
                   <img src="/transportCompany/orderPage/AssignPage/date.svg" alt="يوم التسليم" className="w-6 h-6 object-contain shrink-0" />
                   <div className="flex flex-col gap-0.5 text-right">
                     <span className="text-slate-400 text-[10px] font-bold">يوم التسليم</span>
                     <span className="text-slate-800 font-black text-sm" dir="ltr">12/12/2026</span>
                   </div>
                </div>

                {/* Delivery Time */}
                <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2 whitespace-nowrap">
                   <img src="/transportCompany/orderPage/AssignPage/hour.svg" alt="ساعة التسليم" className="w-6 h-6 object-contain shrink-0" />
                   <div className="flex flex-col gap-0.5 text-right">
                     <span className="text-slate-400 text-[10px] font-bold">ساعة التسليم</span>
                     <span className="text-slate-800 font-black text-sm" dir="ltr">04:30 م</span>
                   </div>
                </div>

                {/* Transport Fare */}
                <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2 whitespace-nowrap">
                   <img src="/transportCompany/orderPage/AssignPage/dollar.svg" alt="أجرة النقل" className="w-6 h-6 object-contain shrink-0" />
                   <div className="flex flex-col gap-0.5 text-right">
                     <span className="text-slate-400 text-[10px] font-bold">أجرة النقل</span>
                     <span className="text-slate-800 font-black text-sm">650 <span className="text-xs font-normal">ر.س</span></span>
                   </div>
                </div>

                {/* Tank Type */}
                <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2 whitespace-nowrap">
                   <img src="/transportCompany/orderPage/AssignPage/drop.svg" alt="نوع التانك" className="w-6 h-6 object-contain shrink-0" />
                   <div className="flex flex-col gap-0.5 text-right">
                     <span className="text-slate-400 text-[10px] font-bold">نوع التانك</span>
                     <span className="text-slate-800 font-black text-sm">حديد</span>
                   </div>
                </div>

                {/* Quantity */}
                <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2 whitespace-nowrap">
                   <img src="/transportCompany/orderPage/AssignPage/gunStation.svg" alt="الكمية" className="w-6 h-6 object-contain shrink-0" />
                   <div className="flex flex-col gap-0.5 text-right">
                     <span className="text-slate-400 text-[10px] font-bold">الكمية</span>
                     <span className="text-slate-800 font-black text-sm">20,000 <span className="text-xs font-normal text-slate-800">لتر</span></span>
                   </div>
                </div>

                {/* Fuel */}
                <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2 whitespace-nowrap">
                   <img src="/transportCompany/orderPage/AssignPage/95gasoline.svg" alt="الوقود" className="w-6 h-6 object-contain shrink-0" />
                   <div className="flex flex-col gap-0.5 text-right">
                     <span className="text-slate-400 text-[10px] font-bold">الوقود</span>
                     <span className="text-slate-800 font-black text-sm">بنزين 95</span>
                   </div>
                </div>

              </div>
              
              {/* Note Box */}
              <div className="w-full bg-[#F8FAFC] p-3 rounded-xl border border-slate-200 flex items-center justify-start gap-2 border border-[#E7E9EF] rounded-2xl">
                 <Info className="w-5 h-5 text-slate-400 shrink-0" />
                 <span className="text-slate-500 bg-[#F8FAFC] text-sm font-semibold">يرجى الالتزام بموعد التسليم والتواصل قبل الوصول بـ 15 دقيقة.</span>
              </div>
        </div>

        {/* To */}
        <div className="flex items-start gap-4 z-10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white">
            <img src="/transportCompany/orderPage/AssignPage/station.svg" alt="إلى" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col gap-1 pt-1">
             <div className="flex items-center gap-2">
              <span className="text-[#16A34A] text-xs font-bold pb-4">الى</span>
              <div className="flex flex-col gap-0.5 text-right">
                <span className="text-slate-800 font-bold text-sm">مؤسسة بترو أمان للوقود</span>
                <span className="text-slate-400 text-xs font-medium">الزلفي، اليمامة، طريق الملك عبدالعزيز</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
