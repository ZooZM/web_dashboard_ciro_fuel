import { cn } from '@/lib/utils';

export interface NewOrder {
  logo: string;
  companyName: string;
  location: string;
  time: string;
  quantity: string;
  fuelType: string;
}

interface NewOrderRowProps {
  order: NewOrder;
}

export function NewOrderRow({ order }: NewOrderRowProps) {
  return (
    <div className="flex items-center py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors px-1 gap-2">

      {/* Far Right: Logo + Company */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full border border-slate-200 shrink-0 bg-white flex items-center justify-center overflow-hidden">
          <img
            src={order.logo}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
        <div className="flex flex-col text-right min-w-0 flex-1">
          <span className="text-[13px] font-bold text-[#1e293b]">{order.companyName}</span>
          <span className="text-[11px] text-[#64748b]">{order.location}</span>
        </div>
      </div>

      {/* Time */}
      <div className="shrink-0 text-center whitespace-nowrap px-1">
        <span className="text-[11px] text-[#64748b]">{order.time}</span>
      </div>

      {/* Fuel + Quantity */}
      <div className="flex items-center gap-3 shrink-0 whitespace-nowrap px-1">
        <div className="flex flex-col items-center gap-0.5">
          <img src="/home/station.svg" className="w-5 h-5" />
          <span className="text-[10px] text-[#64748b]">{order.fuelType}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] text-[#64748b]">الكمية</span>
          <span className="text-[13px] font-bold text-[#1e293b]" dir="ltr">{order.quantity}</span>
        </div>
      </div>

      {/* مراجعة Button */}
      <div className="shrink-0 w-[68px] flex justify-center">
        <button className="px-3 py-1.5 rounded-xl text-[12px] font-bold bg-[#E8F5E9] text-[#12A150] border border-[#12A150]/20 hover:bg-[#d1fae5] transition-colors whitespace-nowrap">
          مراجعة
        </button>
      </div>

    </div>
  );
}
