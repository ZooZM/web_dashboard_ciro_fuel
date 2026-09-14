import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OrderStatusBadge } from '@/transport_company/orders/components/OrderStatusBadge';
import type { Order } from '@/transport_company/orders/types';

/**
 * spec 017 (operator dashboard) T057/FR-017 — the narrow-screen counterpart of
 * `AdminDesktopOrdersTable`, on the same live fields and with the same
 * removals: no platform commission (`Order` carries no such field at all) and
 * no payment-method badge (the mock's value was an index parity, not a field).
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
