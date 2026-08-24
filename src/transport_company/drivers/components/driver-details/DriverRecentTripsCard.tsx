import { cn } from '@/lib/utils';

export function DriverRecentTripsCard() {
  const TRIPS = [
    { id: 1, orderNum: 'ORD-2024-256', client: 'محمد أحمد - محطة الرحاب', fuel: 'بنزين 95', amount: '20,000 لتر', status: 'قيد التوصيل', isComplete: false },
    { id: 2, orderNum: 'ORD-2024-256', client: 'محمد أحمد - محطة الرحاب', fuel: 'بنزين 95', amount: '20,000 لتر', status: 'مكتمل', isComplete: true },
    { id: 3, orderNum: 'ORD-2024-256', client: 'محمد أحمد - محطة الرحاب', fuel: 'بنزين 95', amount: '20,000 لتر', status: 'مكتمل', isComplete: true },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex items-center w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/transportCompany/DriverPage/editDriver/order.svg" alt="" className="w-6 h-6 object-contain" />
          </div>
          <span className="text-[#162155] font-bold text-base">سجل الرحلات الأخيرة</span>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col">
        {TRIPS.map((trip, idx) => (
          <div 
            key={trip.id} 
            className={cn(
              "flex flex-col-reverse sm:flex-row-reverse items-start sm:items-center justify-between py-4 gap-4",
              idx !== TRIPS.length - 1 ? "border-b border-slate-100" : ""
            )}
          >
            {/* Status (Left on Desktop, Bottom on Mobile) */}
            <div className="order-3 sm:order-1 flex justify-start sm:justify-start w-full sm:w-auto">
              <div className={cn(
                "px-3 py-1.5 rounded-full flex items-center justify-center gap-2 text-xs font-bold w-fit",
                trip.isComplete ? "bg-slate-100 text-slate-500" : "bg-[#DCFCE7] text-[#16A34A]"
              )}>
                {!trip.isComplete && <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />}
                {trip.status}
              </div>
            </div>

            {/* Fuel Info (Middle) */}
            <div className="order-2 sm:order-2 flex flex-col gap-1 text-center w-full sm:w-1/3">
              <span className="text-slate-400 text-xs font-bold">{trip.fuel}</span>
              <span className="text-[#162155] font-black text-sm">{trip.amount}</span>
            </div>

            {/* Order Info (Right) */}
            <div className="order-1 sm:order-3 flex flex-col gap-1 text-right w-full sm:w-auto">
              <span className="text-slate-800 font-black text-sm">{trip.orderNum}</span>
              <span className="text-slate-400 text-xs font-bold">{trip.client}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
