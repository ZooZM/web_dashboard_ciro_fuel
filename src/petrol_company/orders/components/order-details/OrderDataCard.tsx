import { useTranslation } from 'react-i18next';
import { useOrderDetailContext } from './OrderDetailContext';
import { OrderStatusBadge } from '../OrderStatusBadge';

// Feature 013 T054/FR-020/FR-098: itemised cost from the order's own `priceBreakdown`
// (immutable, R2 — never re-derived from the company's current pricing) — absent, not
// invented, on an order placed before this field existed. Every fabricated field (fake
// commission-per-litre, fake ETA/distance, fake note) is gone (FR-047/FR-048).
export function OrderDataCard() {
  const { t } = useTranslation();
  const { order } = useOrderDetailContext();

  if (!order) return null;
  const { priceBreakdown } = order;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <img src="/transportCompany/orderPage/orderDetails/invoice.svg" alt="" className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-black text-[#162155]">{t('orders.detail')}</h2>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-8 border-b border-slate-100 pb-8 px-2">
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-400 text-xs font-bold">{t('orders.quantity')}</span>
          <span className="text-[#162155] text-base font-black">{order.quantityLiters.toLocaleString()} L</span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-400 text-xs font-bold">{t('drivers.fuelTypes')}</span>
          <span className="text-[#162155] text-base font-black">{order.fuelType}</span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-400 text-xs font-bold">{t('clients.stationLocation')}</span>
          <span className="text-[#162155] text-base font-black">
            {order.station?.name ?? order.station?.addressText ?? order.deliveryAddressText}
          </span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-400 text-xs font-bold">{t('orders.finalPrice')}</span>
          <span className="text-[#162155] text-base font-black">
            {(order.finalPrice ?? order.estimatedPrice).toLocaleString()}
          </span>
        </div>
      </div>

      {priceBreakdown && (
        <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-8 border-b border-slate-100 pb-8 px-2">
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-xs font-bold">{t('orders.fuelLineTotal')}</span>
            <span className="text-[#162155] text-sm font-black">
              {priceBreakdown.fuelLineTotal.toLocaleString()} {priceBreakdown.currency}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-xs font-bold">{t('orders.deliveryFee')}</span>
            <span className="text-[#162155] text-sm font-black">
              {priceBreakdown.deliveryFee.toLocaleString()} {priceBreakdown.currency}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-xs font-bold">
              {t('orders.serviceFee')} ({priceBreakdown.serviceFeePercent}%)
            </span>
            <span className="text-[#162155] text-sm font-black">
              {priceBreakdown.serviceFee.toLocaleString()} {priceBreakdown.currency}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-xs font-bold">
              {t('orders.tax')} ({priceBreakdown.taxRatePercent}%)
            </span>
            <span className="text-[#162155] text-sm font-black">
              {priceBreakdown.tax.toLocaleString()} {priceBreakdown.currency}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 px-2">
        <div className="flex items-center justify-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
            <img src="/transportCompany/orderPage/orderDetails/station.svg" alt="" className="w-6 h-6" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-slate-400 text-xs font-bold mb-1">{t('clients.stationLocation')}</span>
            <span className="text-[#162155] font-black text-sm">{order.deliveryAddressText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
