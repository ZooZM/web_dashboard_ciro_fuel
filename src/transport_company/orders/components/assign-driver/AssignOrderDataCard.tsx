import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAssignment } from './AssignmentContext';

/**
 * Feature 009 T033/FR-001: shows the real order the operator is assigning — customer,
 * grade, volume, destination — replacing hardcoded sample addresses, fares and a fake
 * tank type this card previously showed unconditionally.
 */
export function AssignOrderDataCard() {
  const { t } = useTranslation();
  const { order, orderId } = useAssignment();
  if (!order) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 w-full h-full">
      <div className="flex flex-col gap-1 text-right">
        <span className="text-[#162155] font-black text-lg" dir="ltr">{orderId}</span>
        {order.station?.name && <span className="text-slate-400 text-xs font-bold">{order.station.name}</span>}
      </div>

      <div className="flex flex-col relative w-full pr-2 h-full justify-between gap-4">
        <div className="z-10 flex flex-col gap-3">
          <div className="border border-slate-200 rounded-xl flex items-center divide-x divide-x-reverse divide-slate-100 bg-white w-full overflow-x-auto">
            <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2 whitespace-nowrap">
              <div className="flex flex-col gap-0.5 text-right">
                <span className="text-slate-400 text-[10px] font-bold">{t('orders.estimatedPrice')}</span>
                <span className="text-slate-800 font-black text-sm">{order.estimatedPrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2 whitespace-nowrap">
              <div className="flex flex-col gap-0.5 text-right">
                <span className="text-slate-400 text-[10px] font-bold">{t('trucks.capacity')}</span>
                <span className="text-slate-800 font-black text-sm" dir="ltr">
                  {order.quantityLiters.toLocaleString()} {t('trucks.liters')}
                </span>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center gap-3 py-3 px-2 whitespace-nowrap">
              <div className="flex flex-col gap-0.5 text-right">
                <span className="text-slate-400 text-[10px] font-bold">{t('orders.fuelType')}</span>
                <span className="text-slate-800 font-black text-sm">{order.fuelType}</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-[#F8FAFC] p-3 rounded-xl border border-[#E7E9EF] flex items-center justify-start gap-2">
            <Info className="w-5 h-5 text-slate-400 shrink-0" />
            <span className="text-slate-500 bg-[#F8FAFC] text-sm font-semibold">
              {order.deliveryAddressText || t('assign.noAddress')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
