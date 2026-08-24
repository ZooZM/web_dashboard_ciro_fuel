import { OrderStatus } from '@/constants/order-status';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<OrderStatus, string> = {
  [OrderStatus.PENDING_APPROVAL]: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
  [OrderStatus.APPROVED]: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  [OrderStatus.PENDING_PAYMENT]: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  [OrderStatus.IN_TRANSIT]: 'bg-purple-500/15 text-purple-700 dark:text-purple-400',
  [OrderStatus.UNLOADING]: 'bg-purple-500/15 text-purple-700 dark:text-purple-400',
  [OrderStatus.DELIVERED]: 'bg-green-500/15 text-green-700 dark:text-green-400',
  [OrderStatus.REJECTED]: 'bg-red-500/15 text-red-700 dark:text-red-400',
  [OrderStatus.CANCELLED]: 'bg-gray-500/15 text-gray-700 dark:text-gray-400',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', STATUS_STYLES[status])}>
      {status.replaceAll('_', ' ')}
    </span>
  );
}
