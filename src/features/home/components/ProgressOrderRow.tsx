import { cn } from '@/lib/utils';

export interface ProgressOrder {
  id: string;
  branch: string;
  time: string;
  quantity: string;
  fuelType: string;
  status: string;
  statusClass: string;
}

interface ProgressOrderRowProps {
  order: ProgressOrder;
}

export function ProgressOrderRow({ order }: ProgressOrderRowProps) {
  return (
    <div className="flex items-center py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors px-1 gap-2">

      {/* Far Right: Order ID & Branch */}
      <div className="flex flex-col text-right min-w-0 flex-1">
        <span className="text-[13px] font-bold text-[#1e293b] truncate">{order.id}</span>
        <span className="text-[11px] text-[#64748b] truncate">{order.branch}</span>
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

      {/* Status Badge */}
      <div className="shrink-0 w-[78px] flex justify-center">
        <span className={cn('px-2 py-1.5 rounded-xl text-[10px] font-bold text-center w-full whitespace-nowrap', order.statusClass)}>
          {order.status}
        </span>
      </div>

    </div>
  );
}
