

export interface NewOrder {
  id?: string;
  logo: string;
  companyName: string;
  location: string;
  time: string;
  quantity: string;
  fuelType: string;
}

import { Link } from 'react-router-dom';

interface NewOrderRowProps {
  order: NewOrder;
}

export function NewOrderRow({ order }: NewOrderRowProps) {
  const orderId = order.id || '1'; // Defaulting to 1 if no id is provided in mock data

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 sm:py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors px-2 gap-4 sm:gap-2">

      {/* Top Row on Mobile: Logo + Company + Button */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:flex-1 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-full border border-slate-200 shrink-0 bg-white flex items-center justify-center overflow-hidden">
            <img
              src={order.logo}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="flex flex-col text-right min-w-0">
            <span className="text-[13px] font-bold text-[#1e293b] truncate">{order.companyName}</span>
            <span className="text-[11px] text-[#64748b] truncate">{order.location}</span>
          </div>
        </div>
        
        {/* Button (visible here on mobile, hidden on desktop) */}
        <div className="sm:hidden shrink-0 ml-1">
          <Link to={`/transport/orders/${orderId}`}>
            <button className="px-3 py-1.5 rounded-xl text-[12px] font-bold bg-[#E8F5E9] text-[#12A150] border border-[#12A150]/20 hover:bg-[#d1fae5] transition-colors whitespace-nowrap">
              مراجعة
            </button>
          </Link>
        </div>
      </div>

      {/* Bottom Row on Mobile: Time + Fuel */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-2">
        <div className="shrink-0 text-center whitespace-nowrap">
          <span className="text-[11px] text-[#64748b]">{order.time}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
          <div className="flex flex-col items-center gap-0.5">
            <img src="/transportCompany/home/station.svg" className="w-5 h-5" />
            <span className="text-[10px] text-[#64748b]">{order.fuelType}</span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[10px] text-[#64748b]">الكمية</span>
            <span className="text-[13px] font-bold text-[#1e293b]" dir="ltr">{order.quantity}</span>
          </div>
        </div>

        {/* Button (hidden on mobile, visible on desktop) */}
        <div className="hidden sm:flex shrink-0 w-[68px] justify-center mr-2">
          <Link to={`/transport/orders/${orderId}`}>
            <button className="px-3 py-1.5 rounded-xl text-[12px] font-bold bg-[#E8F5E9] text-[#12A150] border border-[#12A150]/20 hover:bg-[#d1fae5] transition-colors whitespace-nowrap">
              مراجعة
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}
