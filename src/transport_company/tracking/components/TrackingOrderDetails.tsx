import { ArrowLeft } from 'lucide-react';

export function TrackingOrderDetails() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 w-full">
      
      {/* Header */}
      <div className="flex flex-row-reverse items-start justify-between">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shrink-0">
          تفقد الطلب
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[#162155] font-black text-lg">ORD-2024-256</span>
          <span className="text-slate-400 text-xs font-bold">شركة بترو أمان - محطة محمد</span>
        </div>
      </div>

      {/* Route Info & Stats Sandwiched */}
      <div className="flex flex-col relative w-full pr-2">
        {/* Dotted Line */}
        <div className="absolute right-6  top-14 bottom-16 w-[2px] mb-2 border-r-2 border-dashed border-[#16A34A]"></div>
        {/* Down Arrow at the end of the dotted line */}
        <div className="absolute right-[19px] text-xl font-bold bottom-12  mb-3.5 text-[#16A34A]">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </div>

        {/* From */}
        <div className="flex items-start gap-4 mb-4 z-10">
          <div className="w-8 h-8 rounded-full  flex items-center justify-center shrink-0 bg-white">
            <img src="/transportCompany/trackingPage/pin.svg" alt="من" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[#16A34A] text-xs font-bold pb-4 mb-1">من</span>
              <div className='flex flex-col gap-0.5'>
              <span className="text-slate-800 font-bold text-sm">شركة الزيت العربية السعودية</span>
            <span className="text-slate-400 text-xs font-medium">الظهران, حي غرب الظهران, الحاده الشرقيه</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Box (Sandwiched) */}
        <div className="z-10 mr-12 mb-4">
          <div className="border border-slate-200 rounded-xl flex items-center divide-x divide-x-reverse divide-slate-100 bg-white w-full overflow-hidden">
            
            {/* Transport Fare */}
            <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2">
               <img src="/transportCompany/trackingPage/dollarSign.svg" alt="" className="w-6 h-6 object-contain" />
               <div className="flex flex-col gap-0.5 text-right">
                 <span className="text-slate-400 text-[10px] font-bold">أجرة النقل</span>
                 <span className="text-slate-800 font-black text-sm">650 <span className="text-xs font-normal">ر.س</span></span>
               </div>
            </div>

            {/* Delivery Time */}
            <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2">
               <img src="/transportCompany/trackingPage/hour.svg" alt="" className="w-6 h-6 object-contain" />
               <div className="flex flex-col gap-0.5 text-right">
                 <span className="text-slate-400 text-[10px] font-bold">موعد التسليم</span>
                 <span className="text-slate-800 font-black text-sm" dir="ltr">04:30 م</span>
               </div>
            </div>

            {/* Quantity */}
            <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2">
               <img src="/transportCompany/trackingPage/gunStatin.svg" alt="" className="w-6 h-6 object-contain" />
               <div className="flex flex-col gap-0.5 text-right">
                 <span className="text-slate-400 text-[10px] font-bold">الكمية</span>
                 <span className="text-[#16A34A] font-black text-sm">20,000 <span className="text-xs font-normal text-slate-800">لتر</span></span>
               </div>
            </div>

            {/* Fuel */}
            <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2">
               <img src="/transportCompany/trackingPage/gasoline95.svg" alt="" className="w-6 h-6 object-contain" />
               <div className="flex flex-col gap-0.5 text-right">
                 <span className="text-slate-400 text-[10px] font-bold">الوقود</span>
                 <span className="text-[#162155] font-black text-sm">بنزين 95</span>
               </div>
            </div>

          </div>
        </div>

        {/* To */}
        <div className="flex items-start gap-4 z-10">
          <div className="w-8 h-8 rounded-lg  flex items-center justify-center shrink-0 bg-white">
            <img src="/transportCompany/trackingPage/station.svg" alt="إلى" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col gap-1 pt-1">
             <div className="flex items-center gap-2">
              <span className="text-[#16A34A] text-xs font-bold pb-4">الى</span>
              <div className="flex flex-col gap-0.5 ">
                <span className="text-slate-800 font-bold text-sm">مؤسسة بترو أمان للوقود</span>
                <span className="text-slate-400 text-xs font-medium">الزلفي, اليمامة, طريق الملك عبدالعزيز</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
