import { cn } from '@/lib/utils';

export function TrackingTimelineCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden hidden md:block">
      <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <img src="/transportCompany/orderPage/orderDetails/truck.svg" alt="" className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900">حالة الطلب وتتبع التنفيذ</h2>
          </div>
          <button className="text-blue-600 text-sm font-bold hover:underline">عرض التفاصيل</button>
      </div>

      <div className="relative w-full px-2 overflow-x-auto pb-4">
          <div className="min-w-[700px] relative flex justify-between items-start">
            {/* Connecting Line */}
            <div className="absolute right-5 left-5 top-5 h-[2px] bg-slate-200 z-0"></div>
            {/* Active Line (progress) */}
            <div className="absolute right-5 w-[25%] top-5 h-[2px] bg-green-500 z-0"></div>

            {/* Steps */}
            {[
              { label: 'مراجعة', active: true, done: true, icon: '/transportCompany/orderPage/orderDetails/rightCheck.svg', border: 'border-green-500' ,color:'bg-green-100' },
              { label: 'إسناد', active: true, done: true, icon: '/transportCompany/orderPage/orderDetails/steering.svg', border: 'border-green-500' ,color:'bg-green-100' },
              { label: 'الدفع', active: true, done: false, icon: '/transportCompany/orderPage/orderDetails/payment.svg', border: 'border-blue-500'  ,color:'bg-green-100'},
              { label: 'في الطريق للتحميل', active: false },
              { label: 'تم التحميل', active: false },
              { label: 'في الطريق للتوصيل', active: false },
              { label: 'وصل', active: false },
              { label: 'تم التسليم', active: false },
              { label: 'مكتمل', active: false },
            ].map((step, idx) => (
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
    </div>
  );
}
