import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentMethodPill } from './PaymentMethodPill';
import { fuelTypeLabelKey, isAssignableOrderStatus } from '@/constants/order-status';
import type { Order } from '@/transport_company/orders/types';

/**
 * Feature 009 T031/FR-001/FR-009/SC-005: wired to real orders — company/owner/transport-
 * fare/fuel-invoice columns removed (this is the transporter's own single-tenant list, and
 * none of those four had a real value to show). `ROUTED_TO_TRANSPORT` rows open directly
 * into assignment in one click (FR-009); assigned rows show the real driver.
 */
export function DesktopOrdersTable({ orders }: { orders: Order[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function openOrder(order: Order): void {
    if (isAssignableOrderStatus(order.status)) {
      navigate(`/transport/orders/${order._id}/assign`);
    } else {
      navigate(`/transport/orders/${order._id}`);
    }
  }

  return (
    <div className="hidden lg:block overflow-hidden w-[100%]">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f8f9fa] hover:bg-[#f8f9fa] w-full">
            <TableHead className="font-bold text-slate-700 text-[12px] text-right py-3 pr-4 pl-2">{t('orders.title')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2">{t('orders.fuelType')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2">{t('assign.destinationMap')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2">{t('drivers.title')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2">{t('orders.status')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 pl-4 pr-2">{t('orders.paymentMethod')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order._id}
              onClick={() => openOrder(order)}
              className="hover:bg-slate-50 border-b border-slate-100 last:border-0 cursor-pointer transition-colors"
            >
              <TableCell className="align-middle py-3 pr-4 pl-2">
                <span className="text-slate-800 font-bold text-[12px] whitespace-nowrap" dir="ltr">{order._id}</span>
              </TableCell>
              <TableCell className="align-middle text-center py-3 px-2">
                <div className="flex flex-col items-center gap-1">
                  <span className="bg-[#FFEDD5] text-[#EA580C] px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap">
                    {t(fuelTypeLabelKey(order.fuelType))}
                  </span>
                  <span className="text-slate-600 font-bold text-[11px] whitespace-nowrap" dir="ltr">
                    {order.quantityLiters.toLocaleString()} {t('trucks.liters')}
                  </span>
                </div>
              </TableCell>
              <TableCell className="align-middle text-center py-3 px-2">
                <span className="text-slate-600 text-[11px] max-w-[160px] inline-block truncate">
                  {order.deliveryAddressText || '—'}
                </span>
              </TableCell>
              <TableCell className="align-middle text-center py-3 px-2">
                <span className="text-slate-800 font-bold text-[11px] whitespace-nowrap">
                  {order.driverSummary?.fullName ?? '—'}
                </span>
              </TableCell>
              <TableCell className="align-middle text-center py-3 px-2">
                <OrderStatusBadge status={order.status} />
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
