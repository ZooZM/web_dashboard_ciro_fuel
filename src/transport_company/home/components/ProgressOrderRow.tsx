import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FuelIcon } from '../../tracking/components/FuelIcon';

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
  const { t } = useTranslation();
  return (
    <Link to={`/transport/orders/${order.id}`} className="block">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 sm:py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors px-2 gap-4 sm:gap-2">

        {/* Top Row on Mobile: Order ID + Branch + Status */}
        <div className="flex items-center justify-between w-full sm:w-auto sm:flex-1 min-w-0">
          <div className="flex flex-col text-right min-w-0 flex-1">
            <span className="text-[13px] font-bold text-[#1e293b] truncate">{order.id}</span>
            <span className="text-[11px] text-[#64748b] truncate">{order.branch}</span>
          </div>
          
          {/* Status Badge (visible here on mobile, hidden on desktop) */}
          <div className="sm:hidden shrink-0 ml-1 w-[78px] flex justify-center">
            <span className={cn('px-2 py-1.5 rounded-xl text-[10px] font-bold text-center w-full whitespace-nowrap', order.statusClass)}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Bottom Row on Mobile: Time + Fuel */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-2">
          <div className="shrink-0 text-center whitespace-nowrap">
            <span className="text-[11px] text-[#64748b]">{order.time}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <div className="flex flex-col items-center gap-0.5">
              <FuelIcon type={order.fuelType} className="w-5 h-5" />
              <span className="text-[10px] text-[#64748b]">{order.fuelType}</span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[10px] text-[#64748b]">{t('common.quantity')}</span>
              <span className="text-[13px] font-bold text-[#1e293b]" dir="ltr">{order.quantity}</span>
            </div>
          </div>

          {/* Status Badge (hidden on mobile, visible on desktop) */}
          <div className="hidden sm:flex shrink-0 w-[78px] justify-center mr-2">
            <span className={cn('px-2 py-1.5 rounded-xl text-[10px] font-bold text-center w-full whitespace-nowrap', order.statusClass)}>
              {order.status}
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}
