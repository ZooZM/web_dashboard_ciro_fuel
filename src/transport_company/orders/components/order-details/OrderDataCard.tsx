import { useTranslation } from 'react-i18next';
import { useOrderDetailContext } from './OrderDetailContext';
import { OrderStatusBadge } from '../OrderStatusBadge';
import { fuelTypeLabelKey } from '@/constants/order-status';

/**
 * Feature 009 T033/SC-005: real order fields only — transport fare, loading-location name
 * and distance had no backing field and are dropped; ETA uses the platform's own
 * `etaMinutes` (already computed server-side) rather than a fabricated number.
 *
 * The transport UI refresh added "commission per litre" and a second "+ N litres" quantity
 * to this card; neither has a field on the order, so both are left out. Its "station" field
 * is real (`order.station`) and is shown.
 */
export function OrderDataCard() {
  const { t } = useTranslation();
  const { order } = useOrderDetailContext();
  if (!order) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-[#162155]">{t('orders.detail')}</h2>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-8 border-b border-slate-100 pb-8 px-2">
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-400 text-xs font-bold">{t('orders.quantity')}</span>
          <span className="text-[#162155] text-base font-black" dir="ltr">
            {order.quantityLiters.toLocaleString()} {t('trucks.liters')}
          </span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-400 text-xs font-bold">{t('orders.estimatedPrice')}</span>
          <span className="text-[#162155] text-base font-black">{order.estimatedPrice.toLocaleString()}</span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-400 text-xs font-bold">{t('orders.station')}</span>
          <span className="text-[#162155] text-base font-black">{order.station?.name ?? '—'}</span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-400 text-xs font-bold">{t('orders.fuelType')}</span>
          <span className="text-[#162155] text-base font-black">{t(fuelTypeLabelKey(order.fuelType))}</span>
        </div>
        {order.etaMinutes != null && (
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-xs font-bold">{t('assign.eta')}</span>
            <span className="text-[#162155] text-base font-black">{order.etaMinutes} {t('assign.minutes')}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 mb-2 px-2">
        <div className="flex flex-col text-right">
          <span className="text-slate-400 text-xs font-bold mb-1">{t('assign.destinationMap')}</span>
          <span className="text-[#162155] font-black text-sm">{order.deliveryAddressText || '—'}</span>
        </div>
      </div>
    </div>
  );
}
