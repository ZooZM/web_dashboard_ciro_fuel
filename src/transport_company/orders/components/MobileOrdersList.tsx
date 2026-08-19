import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function MobileOrdersList({ orders }: { orders: any[] }) {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden flex flex-col gap-4">
      {orders.map((order) => (
        <div 
          key={`mobile-${order.id}`} 
          onClick={() => navigate(`/orders/${order.id}`)}
          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4 cursor-pointer hover:border-blue-300 transition-colors"
        >
          {/* Header: Order Num & Status */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-800 font-bold text-sm">{order.num}</span>
            <div className="inline-flex items-center gap-1.5 bg-[#DCFCE7] px-2.5 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></div>
              <span className="text-[#16A34A] text-[10px] font-bold">{order.status}</span>
            </div>
          </div>
          
          {/* Company, Owner & Fuel Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0">
                <Shield className="w-5 h-5 text-[#3b82f6]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-900 font-bold text-[13px]">{order.company}</span>
                <span className="text-slate-500 text-[11px] font-medium">{order.owner}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="bg-[#FFEDD5] text-[#EA580C] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                {order.fuel}
              </span>
              <span className="text-slate-600 font-bold text-[11px]">{order.fuelLiters}</span>
            </div>
          </div>
          
          {/* Locations (From -> To) */}
          <div className="flex flex-col bg-[#F8FAFC] border border-slate-100 rounded-xl p-3 gap-2">
            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
              <span className="text-slate-700 text-[12px] font-semibold leading-tight">{order.locationFrom}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
              <span className="text-slate-700 text-[12px] font-semibold leading-tight">{order.locationTo}</span>
            </div>
          </div>
          
          {/* Driver, Date & Prices Grid */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-2 border-t border-slate-100">
            <div className="flex flex-col">
              <span className="text-slate-400 text-[10px] mb-1">السائق / الشاحنة</span>
              <span className="text-slate-800 font-bold text-[12px]">{order.driver}</span>
              <span className="text-slate-500 text-[11px] mt-0.5">{order.driverId}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-[10px] mb-1">موعد التسليم</span>
              <span className="text-slate-800 font-bold text-[12px]">{order.timeDate}</span>
              <span className="text-slate-500 text-[11px] mt-0.5">{order.timeAmPm}</span>
            </div>
            <div className="flex flex-col bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
              <span className="text-slate-500 text-[10px] mb-0.5">أجرة النقل</span>
              <span className="text-blue-600 font-black text-[13px]">{order.transportFare} ر.س</span>
            </div>
            <div className="flex flex-col bg-green-50/50 p-2 rounded-lg border border-green-100/50">
              <span className="text-slate-500 text-[10px] mb-0.5">فاتورة الوقود</span>
              <span className="text-green-600 font-black text-[13px]">{order.fuelInvoice} ر.س</span>
            </div>
          </div>
          
        </div>
      ))}
    </div>
  );
}
