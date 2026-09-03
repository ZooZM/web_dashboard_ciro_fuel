import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderStatusBadge } from '@/petrol_company/orders/components/OrderStatusBadge';
import type { Order } from '@/transport_company/orders/types';

// Feature 013 T044: every column is a real `Order` field. The previous mock table's
// "owner", "commission" and "fuel invoice" columns are gone outright (FR-048) — none of
// the three exists on the platform's order response before a driver is assigned, and
// per-order commission/invoice figures are not something the platform computes at all
// (commission is a company-level accrual, Story 9; an invoice's own settlement screen,
// not a per-row "fuel invoice amount" on the orders list, is Story 6).
export function DesktopOrdersTable({ orders }: { orders: Order[] }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="hidden lg:block overflow-hidden w-[100%]">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f8f9fa] hover:bg-[#f8f9fa] w-full">
            <TableHead className="font-bold text-slate-700 text-[12px] text-right py-3 pr-4 pl-2 min-w-[90px]">{t('orders.title')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-right py-3 px-2 min-w-[140px]">{t('clients.stationLocation')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[100px]">{t('drivers.fuelTypes')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[100px]">{t('orders.estimatedPrice')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 pl-4 pr-2 min-w-[80px]">{t('orders.status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order._id}
              onClick={() => navigate(`/petrolCompany/orders/${order._id}`)}
              className="hover:bg-slate-50 border-b border-slate-100 last:border-0 cursor-pointer transition-colors"
            >
              <TableCell className="align-middle py-3 pr-4 pl-2">
                <span className="text-slate-800 font-bold text-[12px] whitespace-nowrap" dir="ltr">
                  {order._id.slice(-8).toUpperCase()}
                </span>
              </TableCell>

              <TableCell className="align-middle py-3 px-2">
                <span className="text-slate-800 font-bold text-[12px]">
                  {order.station?.name ?? order.station?.addressText ?? order.deliveryAddressText}
                </span>
              </TableCell>

              <TableCell className="align-middle text-center py-3 px-2">
                <div className="flex flex-col items-center gap-1">
                  <span className="bg-[#FFEDD5] text-[#EA580C] px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap">
                    {order.fuelType}
                  </span>
                  <span className="text-slate-600 font-bold text-[11px] whitespace-nowrap">
                    {order.quantityLiters.toLocaleString()} L
                  </span>
                </div>
              </TableCell>

              <TableCell className="align-middle text-center py-3 px-2">
                <span className="text-[#2563EB] font-black text-[12px]">
                  {(order.finalPrice ?? order.estimatedPrice).toLocaleString()}
                </span>
              </TableCell>

              <TableCell className="align-middle text-center py-3 pl-4 pr-2">
                <OrderStatusBadge status={order.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
