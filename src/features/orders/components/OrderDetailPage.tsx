import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOrderDetail, useCancelOrder } from '@/features/orders/hooks/useOrders';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { ApproveOrderDialog } from '@/features/orders/components/ApproveOrderDialog';
import { RejectOrderDialog } from '@/features/orders/components/RejectOrderDialog';
import { ForceCompleteDialog } from '@/features/orders/components/ForceCompleteDialog';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/constants/order-status';

export function OrderDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const orderId = id ?? '';
  const { data: order, isLoading } = useOrderDetail(orderId);
  const cancel = useCancelOrder(orderId);

  if (isLoading || !order) {
    return <p className="text-muted-foreground">{t('common.loading')}</p>;
  }

  const canApproveOrReject = order.status === OrderStatus.PENDING_APPROVAL;
  const canCancel = order.status === OrderStatus.PENDING_APPROVAL || order.status === OrderStatus.APPROVED;
  const canForceComplete = order.status === OrderStatus.IN_TRANSIT || order.status === OrderStatus.UNLOADING;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">{t('orders.detail')}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <dl className="grid grid-cols-2 gap-2 text-sm">
        <dt className="text-muted-foreground">{t('orders.estimatedPrice')}</dt>
        <dd>{order.estimatedPrice}</dd>
        <dt className="text-muted-foreground">{t('orders.finalPrice')}</dt>
        <dd>{order.finalPrice ?? '—'}</dd>
      </dl>

      <div className="flex gap-2">
        {canApproveOrReject ? (
          <>
            <ApproveOrderDialog orderId={order.id} estimatedPrice={order.estimatedPrice} />
            <RejectOrderDialog orderId={order.id} />
          </>
        ) : null}
        {canCancel ? (
          <Button variant="outline" onClick={() => cancel.mutate()} disabled={cancel.isPending}>
            {t('orders.cancel')}
          </Button>
        ) : null}
        {canForceComplete ? <ForceCompleteDialog orderId={order.id} /> : null}
      </div>

      <div>
        <h2 className="mb-2 font-medium">{t('orders.status')}</h2>
        <ul className="flex flex-col gap-1 text-sm">
          {order.statusHistory.map((event, index) => (
            <li key={`${event.status}-${index}`} className="flex items-center gap-2">
              <OrderStatusBadge status={event.status} />
              <span className="text-muted-foreground">{new Date(event.at).toLocaleString()}</span>
              {event.manualOverride ? (
                <span className="rounded bg-destructive/15 px-1.5 py-0.5 text-xs text-destructive">
                  {event.overrideReason}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
