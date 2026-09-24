import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentMethodPill } from './PaymentMethodPill';
import { fuelTypeLabelKey, isAssignableOrderStatus } from '@/constants/order-status';
import type { Order } from '@/transport_company/orders/types';

export function MobileOrdersList({ orders }: { orders: Order[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function openOrder(order: Order): void {
    navigate(isAssignableOrderStatus(order.status) ? `/transport/orders/${order._id}/assign` : `/transport/orders/${order._id}`);
  }

  return (
    <div className="lg:hidden flex flex-col gap-4">
      {orders.map((order) => (
        <div
          key={order._id}
          onClick={() => openOrder(order)}
          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-800 font-bold text-sm" dir="ltr">{order._id}</span>
            <div className="flex items-center gap-2">
              <PaymentMethodPill method={order.paymentMethod} />
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5 text-right">
              <span className="text-slate-800 font-bold text-xs">{t(fuelTypeLabelKey(order.fuelType))}</span>
              <span className="text-slate-400 text-[10px]" dir="ltr">
                {order.quantityLiters.toLocaleString()} {t('trucks.liters')}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-slate-500 text-[10px]">{t('drivers.title')}</span>
              <span className="text-slate-800 font-bold text-xs">{order.driverSummary?.fullName ?? '—'}</span>
            </div>
          </div>

          {order.deliveryAddressText && (
            <p className="text-slate-500 text-[11px] truncate">{order.deliveryAddressText}</p>
          )}
        </div>
      ))}
    </div>
  );
}
