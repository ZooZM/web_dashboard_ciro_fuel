import { useState } from 'react';
import { cn } from '@/lib/utils';

export function TrackingTimelineCard() {
  const [showDetails, setShowDetails] = useState(false);

  const horizontalSteps = [
    { label: 'مراجعة', active: true, done: true, icon: '/transportCompany/orderPage/orderDetails/rightCheck.svg', border: 'border-green-500' ,color:'bg-green-100' },
    { label: 'إسناد', active: true, done: true, icon: '/transportCompany/orderPage/orderDetails/steering.svg', border: 'border-green-500' ,color:'bg-green-100' },
    { label: 'الدفع', active: true, done: false, icon: '/transportCompany/orderPage/orderDetails/payment.svg', border: 'border-blue-500'  ,color:'bg-green-100'},
    { label: 'في الطريق للتحميل', active: false },
    { label: 'تم التحميل', active: false },
    { label: 'في الطريق للتوصيل', active: false },
    { label: 'وصل', active: false },
    { label: 'تم التسليم', active: false },
    { label: 'مكتمل', active: false },
  ];

  const verticalSteps = [
    { label: 'وصل', status: 'pending' },
    { label: 'توقف في الطريق', status: 'error', date: '06/06/2026', time: '06:35 ص' },
    { label: 'في الطريق للتوصيل', status: 'success', date: '06/06/2026', time: '06:35 ص' },
    { label: 'تم التحميل', status: 'success', date: '06/06/2026', time: '06:35 ص' },
    { label: 'في الطريق للتحميل', status: 'success', date: '06/06/2026', time: '06:35 ص' },
    { label: 'إسناد السائق', status: 'success', date: '06/06/2026', time: '06:35 ص' },
    { label: 'تعديل الطلب', status: 'success', date: '06/06/2026', time: '06:35 ص' },
    { label: 'مراجعة', status: 'success', date: '06/06/2026', time: '06:35 ص' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
              <img src="/transportCompany/orderPage/orderDetails/truck.svg" alt="" className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-[#162155]">حالة الطلب وتتبع التنفيذ</h2>
          </div>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 text-sm font-bold hover:underline"
          >
            {showDetails ? "إخفاء التفاصيل" : "عرض التفاصيل"}
          </button>
      </div>

      {!showDetails ? (
        <div className="relative w-full px-2 overflow-x-auto pb-4">
            <div className="min-w-[700px] relative flex justify-between items-start">
              {/* Connecting Line */}
              <div className="absolute right-5 left-5 top-5 h-[2px] bg-slate-200 z-0"></div>
              {/* Active Line (progress) */}
              <div className="absolute right-5 w-[25%] top-5 h-[2px] bg-green-500 z-0"></div>

              {/* Steps */}
              {horizontalSteps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 z-10 relative w-16">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white shrink-0",
                      step.active ? (step.border || 'border-blue-100') : "border-slate-200",
                      step.color ?  (step.done?step.color : "bg-blue-100") : "bg-white",
                    )}>
                      {step.active && step.icon && (
                        <img src={step.icon} alt="" className="w-5 h-5" />
                      )}
                    </div>
                    <span className={cn(
                      "text-[11px] font-bold text-center leading-tight whitespace-nowrap",
                      step.active ? "text-slate-800" : "text-slate-400"
                    )}>
                      {step.label}
                    </span>
                </div>
              ))}
            </div>
        </div>
      ) : (
        <div className="flex flex-col relative w-full pb-4 animate-in fade-in duration-300">
            {/* Connecting Line */}
            <div className="absolute right-[11px] top-6 bottom-6 w-px border-r border-dashed border-slate-300 z-0"></div>

            {verticalSteps.map((step, idx) => (
              <div key={idx} className="flex justify-between items-center w-full py-4 relative z-10">
                 
                 {/* Right Side (Icon and Label - goes right in RTL) */}
                 <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white shrink-0 shadow-sm relative z-10",
                      step.status === 'success' ? "border-[#22C55E]" :
                      step.status === 'error' ? "border-[#EF4444]" : "border-slate-300"
                    )}>
                      {step.status === 'success' && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.5 4L4 6.5L8.5 1.5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {step.status === 'error' && <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />}
                    </div>
                    <span className={cn(
                      "text-xs font-bold",
                      step.status === 'success' ? "text-[#22C55E]" :
                      step.status === 'error' ? "text-[#EF4444]" : "text-slate-400"
                    )}>
                      {step.label}
                    </span>
                 </div>

                 {/* Left Side (Date and Time - goes left in RTL) */}
                 <div className="flex items-center gap-6 text-slate-500">
                    {step.date && (
                        <div className="flex items-center gap-2">
                          <img src="/petrolCompany/requests/date.svg" alt="" />
                          <span className="text-[11px] font-bold tracking-wider" dir="ltr">{step.date}</span>
                        </div>
                    )}
                    {step.time && (
                        <div className="flex items-center gap-2">
                          <img src="/transportCompany/DriverPage/hour.svg" alt="" />
                          <span className="text-[11px] font-bold tracking-wider" dir="ltr">{step.time}</span>
                        </div>
                    )}
                 </div>

              </div>
            ))}
        </div>
      )}
    </div>
  );
}
