import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useOrdersList } from '@/features/orders/hooks/useOrders';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import type { OrderStatus } from '@/constants/order-status';

export function OrdersListPage() {
  const { t } = useTranslation();
  const [page] = useState(1);
  const { data, isLoading } = useOrdersList({ page });

  if (isLoading) {
    return <p className="text-muted-foreground">{t('common.loading')}</p>;
  }

  const orders = data?.items ?? [];

  if (orders.length === 0) {
    return <p className="text-muted-foreground">{t('orders.empty')}</p>;
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">{t('orders.title')}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('orders.status')}</TableHead>
            <TableHead>{t('orders.estimatedPrice')}</TableHead>
            <TableHead>{t('orders.finalPrice')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Link to={`/orders/${order.id}`} className="hover:underline">
                  <OrderStatusBadge status={order.status as OrderStatus} />
                </Link>
              </TableCell>
              <TableCell>{order.estimatedPrice}</TableCell>
              <TableCell>{order.finalPrice ?? '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
