import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OrderStatusBadge } from '@/petrol_company/orders/components/OrderStatusBadge';
import type { Order } from '@/transport_company/orders/types';

// Feature 013 T044: mirrors DesktopOrdersTable's field set — real Order fields only,
// the fabricated owner/transporter/commission/fuel-invoice fields are gone (FR-048).
export function MobileOrdersList({ orders }: { orders: Order[] }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="lg:hidden flex flex-col gap-4">
      {orders.map((order) => (
        <div
          key={order._id}
          onClick={() => navigate(`/petrolCompany/orders/${order._id}`)}
          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4 cursor-pointer hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-800 font-bold text-sm" dir="ltr">
              {order._id.slice(-8).toUpperCase()}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-900 font-bold text-[13px]">
                {order.station?.name ?? order.station?.addressText ?? order.deliveryAddressText}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="bg-[#FFEDD5] text-[#EA580C] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                {order.fuelType}
              </span>
              <span className="text-slate-600 font-bold text-[11px]">
                {order.quantityLiters.toLocaleString()} L
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-slate-400 text-[10px]">{t('orders.estimatedPrice')}</span>
            <span className="text-blue-600 font-black text-[13px]">
              {(order.finalPrice ?? order.estimatedPrice).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
