import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OrderStatusBadge } from '@/transport_company/orders/components/OrderStatusBadge';
import { PaymentMethodPill } from '@/transport_company/orders/components/PaymentMethodPill';
import type { Order } from '@/transport_company/orders/types';

/**
 * spec 017 (operator dashboard) T057/FR-017 — the narrow-screen counterpart of
 * `AdminDesktopOrdersTable`, on the same live fields and with the same
 * removals: no platform commission (`Order` carries no such field at all). The
 * payment-method row shows the order's real `paymentMethod`, not the design's
 * "Sadad" vs "bank transfer" (see the desktop table's comment).
 */
export function AdminMobileOrdersList({ orders }: { orders: Order[] }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="lg:hidden flex flex-col gap-4">
      {orders.map((order) => (
        <div
          key={`mobile-${order._id}`}
          onClick={() => navigate(`/admin/orders/${order._id}`)}
          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4 cursor-pointer hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-800 font-bold text-[12px] font-mono" title={order._id}>
              …{order._id.slice(-8)}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="flex flex-col gap-2 text-right">
            <Row
              label={t('adminOrders.columns.client')}
              value={order.clientSummary?.fullName ?? '—'}
            />
            <Row
              label={t('adminOrders.columns.fuelAndQuantity')}
              value={`${t(`fuelType.${order.fuelType}`)} · ${order.quantityLiters.toLocaleString()} ${t('common.litre')}`}
            />
            <Row
              label={t('adminOrders.columns.destination')}
              value={order.deliveryAddressText || '—'}
            />
            <Row
              label={t('adminOrders.columns.driver')}
              value={order.driverSummary?.fullName ?? '—'}
            />
            <Row
              label={t('adminOrders.columns.value')}
              value={(order.finalPrice ?? order.estimatedPrice).toLocaleString()}
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-slate-500 text-[11px] font-bold">{t('orders.paymentMethod')}</span>
            <PaymentMethodPill method={order.paymentMethod} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] font-semibold text-slate-500 shrink-0">{label}</span>
      <span className="text-[12px] font-bold text-slate-800 truncate">{value}</span>
    </div>
  );
}
