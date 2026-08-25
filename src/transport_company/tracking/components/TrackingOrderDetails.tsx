import { ArrowLeft, MessageCircle, Star } from 'lucide-react';
import { FuelIcon } from './FuelIcon';

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
        <div className="z-10 mr-12 mb-4 flex flex-col gap-3">
          <div className="border border-slate-200 rounded-xl flex items-center divide-x divide-x-reverse divide-slate-100 bg-white w-full overflow-x-auto">
                
                {/* Delivery Day */}
                <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2 whitespace-nowrap">
                   <svg className="w-6 h-6" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.5003 2.08325V5.41659M7.50033 2.08325V5.41659M17.0691 9.58325H2.93144M2.93144 9.58325C2.92168 9.85062 2.91699 10.1283 2.91699 10.4166C2.91699 15.8333 4.58366 17.4999 10.0003 17.4999C15.417 17.4999 17.0837 15.8333 17.0837 10.4166C17.0837 10.1283 17.0789 9.85062 17.0691 9.58325C16.8956 4.82723 15.1287 3.33325 10.0003 3.33325C4.87196 3.33325 3.105 4.82723 2.93144 9.58325Z" stroke="#12A150" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                   <div className="flex flex-col gap-0.5 text-right">
                     <span className="text-slate-400 text-[10px] font-bold">يوم التسليم</span>
                     <span className="text-slate-800 font-black text-sm" dir="ltr">12/12/2026</span>
                   </div>
                </div>

                {/* Delivery Time */}
                <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2 whitespace-nowrap">
                   <img src="/transportCompany/trackingPage/hour.svg" alt="" className="w-6 h-6 object-contain" />
                   <div className="flex flex-col gap-0.5 text-right">
                     <span className="text-slate-400 text-[10px] font-bold">ساعة التسليم</span>
                     <span className="text-slate-800 font-black text-sm" dir="ltr">04:30 م</span>
                   </div>
                </div>

                {/* Transport Fare */}
                <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2 whitespace-nowrap">
                   <img src="/transportCompany/trackingPage/dollarSign.svg" alt="" className="w-6 h-6 object-contain" />
                   <div className="flex flex-col gap-0.5 text-right">
                     <span className="text-slate-400 text-[10px] font-bold">أجرة النقل</span>
                     <span className="text-slate-800 font-black text-sm">650 <span className="text-xs font-normal">ر.س</span></span>
                   </div>
                </div>

                {/* Tank Type */}
                <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2 whitespace-nowrap">
                   <svg className="w-6 h-6" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.5585 6.49419L10.9424 6.17394L10.5838 5.74389L10.1969 6.1488L10.5585 6.49419ZM10.5585 13.3305V12.8305V12.8305V13.3305ZM2.60526 15.376L2.40522 15.8342C2.42044 15.8409 2.43598 15.8468 2.45179 15.8519L2.60526 15.376ZM8.10234 10.8457H8.60234C8.60234 10.5058 8.72254 10.0884 8.93887 9.62674C9.15211 9.17166 9.44124 8.71003 9.73817 8.29158C10.0341 7.87461 10.331 7.50983 10.5545 7.24897C10.6659 7.11882 10.7585 7.01523 10.8227 6.94472C10.8548 6.90948 10.8797 6.88255 10.8963 6.86475C10.9046 6.85585 10.9109 6.84923 10.9149 6.845C10.9169 6.84288 10.9183 6.84137 10.9192 6.84046C10.9196 6.84001 10.9199 6.8397 10.92 6.83956C10.9201 6.83948 10.9201 6.83945 10.9201 6.83945C10.9201 6.83945 10.9201 6.83949 10.9201 6.83949C10.9201 6.83953 10.92 6.83958 10.5585 6.49419C10.1969 6.1488 10.1969 6.14887 10.1968 6.14895C10.1968 6.14899 10.1967 6.14908 10.1966 6.14916C10.1964 6.14932 10.1962 6.14952 10.196 6.14976C10.1956 6.15024 10.195 6.15087 10.1942 6.15166C10.1927 6.15324 10.1906 6.15544 10.188 6.15824C10.1827 6.16385 10.1751 6.17189 10.1654 6.18225C10.1461 6.20297 10.1183 6.23302 10.0832 6.27155C10.0131 6.3486 9.91374 6.45977 9.79495 6.59847C9.55785 6.8753 9.24079 7.26453 8.92264 7.71287C8.60554 8.15973 8.28064 8.67469 8.03335 9.20244C7.78915 9.7236 7.60234 10.2954 7.60234 10.8457H8.10234ZM10.5585 6.49419C10.1745 6.81444 10.1745 6.8144 10.1744 6.81437C10.1744 6.81438 10.1744 6.81436 10.1744 6.81437C10.1744 6.81438 10.1745 6.81444 10.1746 6.81454C10.1747 6.81475 10.1751 6.81512 10.1755 6.81566C10.1764 6.81673 10.1778 6.81847 10.1798 6.82086C10.1838 6.82564 10.1898 6.83302 10.1979 6.84287C10.2141 6.86258 10.2381 6.89216 10.269 6.93065C10.3308 7.00764 10.4197 7.12009 10.5266 7.26009C10.7409 7.54062 11.0257 7.92927 11.3096 8.36347C11.5945 8.79926 11.8723 9.2717 12.0773 9.72081C12.2873 10.181 12.3977 10.5674 12.3977 10.8457H12.8977H13.3977C13.3977 10.3505 13.2156 9.80632 12.987 9.30558C12.7534 8.79376 12.4465 8.275 12.1466 7.81627C11.8456 7.35595 11.5456 6.94677 11.3213 6.65308C11.209 6.50598 11.1151 6.38722 11.049 6.3048C11.0159 6.26357 10.9897 6.23139 10.9716 6.20926C10.9625 6.19819 10.9555 6.18963 10.9506 6.18371C10.9481 6.18074 10.9462 6.17844 10.9448 6.1768C10.9442 6.17599 10.9436 6.17534 10.9432 6.17486C10.943 6.17462 10.9429 6.17442 10.9427 6.17427C10.9427 6.17419 10.9426 6.17411 10.9426 6.17407C10.9425 6.174 10.9424 6.17394 10.5585 6.49419ZM10.5585 13.3305C10.5585 12.8305 10.5587 12.8305 10.5589 12.8305C10.559 12.8305 10.5592 12.8305 10.5594 12.8305C10.5596 12.8305 10.5598 12.8305 10.56 12.8305C10.5604 12.8305 10.5606 12.8305 10.5607 12.8305C10.5609 12.8305 10.5605 12.8305 10.5596 12.8305C10.5577 12.8305 10.5537 12.8304 10.5477 12.8302C10.5357 12.8298 10.5157 12.8289 10.489 12.827C10.4353 12.8231 10.3552 12.8151 10.2578 12.7987C10.0607 12.7654 9.80543 12.6999 9.55609 12.5737C9.30884 12.4487 9.07594 12.2686 8.90361 12.0071C8.73316 11.7484 8.60234 11.3806 8.60234 10.8457H8.10234H7.60234C7.60234 11.5532 7.77854 12.1172 8.06861 12.5574C8.3568 12.9947 8.73794 13.2805 9.10472 13.4661C9.46942 13.6506 9.82816 13.7403 10.0916 13.7847C10.2244 13.8071 10.3363 13.8185 10.4169 13.8244C10.4573 13.8273 10.4901 13.8288 10.514 13.8296C10.526 13.83 10.5358 13.8303 10.5433 13.8304C10.547 13.8304 10.5501 13.8305 10.5527 13.8305C10.5539 13.8305 10.5551 13.8305 10.556 13.8305C10.5565 13.8305 10.557 13.8305 10.5574 13.8305C10.5576 13.8305 10.5578 13.8305 10.5579 13.8305C10.5582 13.8305 10.5585 13.8305 10.5585 13.3305ZM10.5585 13.3305C10.5585 13.8305 10.5587 13.8305 10.559 13.8305C10.5591 13.8305 10.5594 13.8305 10.5596 13.8305C10.56 13.8305 10.5605 13.8305 10.561 13.8305C10.562 13.8305 10.5631 13.8305 10.5644 13.8305C10.5669 13.8305 10.5701 13.8304 10.5737 13.8304C10.5811 13.8302 10.5907 13.83 10.6024 13.8296C10.6258 13.8288 10.6577 13.8272 10.6968 13.8242C10.7749 13.8183 10.8829 13.8067 11.0111 13.784C11.2653 13.739 11.6112 13.6481 11.9626 13.4615C12.3165 13.2735 12.6812 12.9853 12.9557 12.548C13.2312 12.109 13.3977 11.5484 13.3977 10.8457H12.8977H12.3977C12.3977 11.3854 12.2717 11.7566 12.1087 12.0164C11.9445 12.278 11.7244 12.4557 11.4935 12.5783C11.2601 12.7023 11.0212 12.7667 10.8368 12.7993C10.7457 12.8155 10.671 12.8233 10.6212 12.8271C10.5963 12.829 10.5779 12.8298 10.567 12.8302C10.5616 12.8304 10.5581 12.8305 10.5566 12.8305C10.5559 12.8305 10.5556 12.8305 10.556 12.8305C10.5561 12.8305 10.5564 12.8305 10.5568 12.8305C10.557 12.8305 10.5573 12.8305 10.5575 12.8305C10.5577 12.8305 10.5579 12.8305 10.558 12.8305C10.5582 12.8305 10.5585 13.8305 10.5585 13.3305ZM4.00877 4.33228V4.83228H16.9912V4.33228V3.83228H4.00877V4.33228ZM16.9912 15.6677V15.1677H4.00877V15.6677V16.1677H16.9912V15.6677ZM0.5 12.1619H1V7.83808H0.5H0V12.1619H0.5ZM20.5 12.1619H20C20 13.8216 18.6533 15.1677 16.9912 15.1677V15.6677V16.1677C19.2048 16.1677 21 14.3747 21 12.1619H20.5ZM16.9912 4.33228V4.83228C18.6533 4.83228 20 6.17842 20 7.83808H20.5H21C21 5.62534 19.2048 3.83228 16.9912 3.83228V4.33228ZM4.00877 4.33228V3.83228C1.79519 3.83228 0 5.62534 0 7.83808H0.5H1C1 6.17842 2.34667 4.83228 4.00877 4.83228V4.33228ZM4.00877 15.6677V15.1677C3.82776 15.1677 3.53076 15.11 3.24242 15.0371C3.10612 15.0027 2.98403 14.9681 2.89602 14.9421C2.85214 14.9291 2.81705 14.9184 2.79328 14.911C2.7814 14.9073 2.77237 14.9045 2.7665 14.9026C2.76357 14.9017 2.76143 14.901 2.76012 14.9006C2.75947 14.9004 2.75902 14.9002 2.75879 14.9002C2.75867 14.9001 2.75861 14.9001 2.7586 14.9001C2.7586 14.9001 2.75861 14.9001 2.75863 14.9001C2.75864 14.9001 2.75867 14.9001 2.75867 14.9001C2.7587 14.9001 2.75874 14.9001 2.60526 15.376C2.45179 15.8519 2.45183 15.8519 2.45187 15.8519C2.45189 15.8519 2.45194 15.8519 2.45198 15.8519C2.45206 15.852 2.45215 15.852 2.45225 15.852C2.45247 15.8521 2.45273 15.8522 2.45305 15.8523C2.45369 15.8525 2.45455 15.8528 2.45563 15.8531C2.45777 15.8538 2.46077 15.8547 2.46458 15.856C2.47221 15.8584 2.4831 15.8618 2.49693 15.8661C2.52457 15.8747 2.56404 15.8867 2.61276 15.9011C2.70993 15.9298 2.84515 15.9681 2.99735 16.0066C3.28601 16.0796 3.69076 16.1677 4.00877 16.1677V15.6677ZM2.60526 15.376L2.80531 14.9178C1.74152 14.4534 1 13.3935 1 12.1619H0.5H0C0 13.8056 0.990543 15.2167 2.40522 15.8342L2.60526 15.376ZM20.5 7.83808H20V8.18866H20.5H21V7.83808H20.5ZM20.5 8.18866H20V12.1619H20.5H21V8.18866H20.5Z" fill="#1E5FFF"/>
                   </svg>
                   <div className="flex flex-col gap-0.5 text-right">
                     <span className="text-slate-400 text-[10px] font-bold">نوع التانك</span>
                     <span className="text-[#162155] font-black text-sm">حديد</span>
                   </div>
                </div>

                {/* Quantity */}
                <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2 whitespace-nowrap">
                   <img src="/transportCompany/trackingPage/gunStatin.svg" alt="" className="w-6 h-6 object-contain" />
                   <div className="flex flex-col gap-0.5 text-right">
                     <span className="text-slate-400 text-[10px] font-bold">الكمية</span>
                     <span className="text-[#162155] font-black text-sm">20,000 <span className="text-xs font-normal text-slate-800">لتر</span></span>
                   </div>
                </div>

                {/* Fuel */}
                <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2 whitespace-nowrap">
                   <FuelIcon type="بنزين 95" className="w-6 h-6 object-contain" />
                   <div className="flex flex-col gap-0.5 text-right">
                     <span className="text-slate-400 text-[10px] font-bold">الوقود</span>
                     <span className="text-[#162155] font-black text-sm">بنزين 95</span>
                   </div>
                </div>

             </div>
             
             {/* Note Box */}
             <div className="w-full bg-[#F8FAFC] p-3 rounded-xl border border-slate-200 flex items-start justify-start gap-2 border border-[#E7E9EF] rounded-2xl">
                <MessageCircle className="w-5 h-5 text-slate-400" />
            <input className="text-slate-500 text-sm font-semibold w-full bg-[#F8FAFC]" placeholder="يرجى الالتزام بموعد التسليم والتواصل قبل الوصول بـ 15 دقيقة."></input>
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
