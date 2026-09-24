import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderStatusBadge } from '@/transport_company/orders/components/OrderStatusBadge';
import { PaymentMethodPill } from '@/transport_company/orders/components/PaymentMethodPill';
import type { Order } from '@/transport_company/orders/types';

/**
 * spec 017 (operator dashboard) T057/T060/FR-017 — one row per order, on live
 * fields.
 *
 * **The platform-commission column is REMOVED** (FR-022, FR-024, FR-078, and
 * recorded in this feature's Removals table). `Order` carries no commission
 * field of any kind: the platform records commission as `COMMISSION_CHARGED`
 * movements on a COMPANY ledger, sourced from an invoice, never from an order.
 * So FR-022's "where the platform records one" is never satisfied for an order,
 * and the element is always absent — a determinate outcome rather than a
 * runtime condition, which is why the column is deleted rather than
 * conditionally hidden.
 *
 * The mock's separate `paymentMethod` badge column rendered an index parity
 * (`index % 2`) as "Sadad" vs "bank transfer" — neither is an order's payment
 * method. The refreshed design's payment-method column is kept, but shows the
 * order's real `paymentMethod` (`DIRECT | DEFERRED | CREDIT`) through the
 * transport screen's `PaymentMethodPill`.
 */
export function AdminDesktopOrdersTable({ orders }: { orders: Order[] }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="hidden lg:block overflow-hidden w-[100%]">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f8f9fa] hover:bg-[#f8f9fa] w-full">
            <TableHead className="font-bold text-slate-700 text-[12px] text-right py-3 pr-4 pl-2 min-w-[110px]">
              {t('adminOrders.columns.reference')}
            </TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-right py-3 px-2 min-w-[150px]">
              {t('adminOrders.columns.client')}
            </TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[110px]">
              {t('adminOrders.columns.fuelAndQuantity')}
            </TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[170px]">
              {t('adminOrders.columns.destination')}
            </TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[110px]">
              {t('adminOrders.columns.driver')}
            </TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[110px]">
              {t('adminOrders.columns.createdAt')}
            </TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[90px]">
              {t('adminOrders.columns.status')}
            </TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 pl-4 pr-2 min-w-[110px]">
              {t('adminOrders.columns.value')}
            </TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 pl-4 pr-2 min-w-[100px]">
              {t('orders.paymentMethod')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order._id}
              onClick={() => navigate(`/admin/orders/${order._id}`)}
              className="hover:bg-slate-50 border-b border-slate-100 last:border-0 cursor-pointer transition-colors"
            >
              <TableCell className="align-middle py-3 pr-4 pl-2">
                {/*
                  `Order` has no human reference field — the identifier IS the
                  reference, which is also why search is by identifier alone
                  (FR-016a, research R13). Truncated with the full value on
                  hover, so a row stays readable and the id stays copyable.
                */}
                <span
                  className="text-slate-800 font-bold text-[12px] whitespace-nowrap font-mono"
                  title={order._id}
                >
                  …{order._id.slice(-8)}
                </span>
              </TableCell>

              <TableCell className="align-middle py-3 px-2">
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-900 font-bold text-[12px] truncate">
                    {order.clientSummary?.fullName ?? '—'}
                  </span>
                  <span className="text-slate-400 text-[10px] mt-0.5 truncate max-w-[170px]">
                    {order.station?.addressText || order.deliveryAddressText || '—'}
                  </span>
                </div>
              </TableCell>

              <TableCell className="align-middle text-center py-3 px-2">
                <div className="flex flex-col items-center gap-1">
                  <span className="bg-[#FFEDD5] text-[#EA580C] px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap">
                    {t(`fuelType.${order.fuelType}`)}
                  </span>
                  <span className="text-slate-600 font-bold text-[11px] whitespace-nowrap">
                    {order.quantityLiters.toLocaleString()} {t('common.litre')}
                  </span>
                </div>
              </TableCell>

              <TableCell className="align-middle text-center py-3 px-2">
                <span className="text-slate-800 font-bold text-[11px] max-w-[170px] leading-tight block truncate">
                  {order.warehouseSummary?.name ?? '—'}
                </span>
                <span className="text-slate-400 text-[10px] max-w-[170px] leading-tight block truncate">
                  {order.deliveryAddressText || '—'}
                </span>
              </TableCell>

              <TableCell className="align-middle text-center py-3 px-2">
                <span className="text-slate-800 font-bold text-[11px] leading-tight">
                  {order.driverSummary?.fullName ?? '—'}
                </span>
              </TableCell>

              <TableCell className="align-middle text-center py-3 px-2">
                <span className="text-slate-800 font-bold text-[11px] whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </TableCell>

              <TableCell className="align-middle text-center py-3 px-2">
                <OrderStatusBadge status={order.status} />
              </TableCell>

              <TableCell className="align-middle text-center py-3 pl-4 pr-2">
                <span className="text-green-600 font-black text-[12px]">
                  {(order.finalPrice ?? order.estimatedPrice).toLocaleString()}
                </span>
              </TableCell>

              <TableCell className="align-middle text-center py-3 pl-4 pr-2">
                <PaymentMethodPill method={order.paymentMethod} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
