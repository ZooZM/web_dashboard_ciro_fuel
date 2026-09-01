import { useTranslation } from 'react-i18next';
import { useOrdersList } from '@/transport_company/orders/hooks/useOrders';
import { OrderStatusBadge } from '@/transport_company/orders/components/OrderStatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

/** Read-only, all-tenant order visibility for the Super Admin (FR-003). Reuses the same
 *  orders hook — the backend scopes the response by role, so no client-side tenant filter
 *  is composed here. */
export function PlatformOrdersPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useOrdersList({});

  const orders = data?.items ?? [];

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">{t('orders.title')}</h1>
      {isLoading ? (
        <p className="text-muted-foreground">{t('common.loading')}</p>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground">{t('orders.empty')}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('orders.status')}</TableHead>
              <TableHead>{t('orders.finalPrice')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>{order.finalPrice ?? order.estimatedPrice}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
