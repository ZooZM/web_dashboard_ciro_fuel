import { OrderStatus } from '@/constants/order-status';
import { cn } from '@/lib/utils';

// Feature 009 Slice 1: OrderStatus gained 4 values the transport dashboard was missing
// (AWAITING_ROUTING, ROUTED_TO_TRANSPORT, ASSIGNED_TO_DRIVER, LOADING). This screen is not
// otherwise touched by that feature (FR-076), so this is the minimal mechanical addition
// needed to keep the exhaustive Record compiling — not a retrofit of this screen's design.
const STATUS_STYLES: Record<OrderStatus, string> = {
  [OrderStatus.PENDING_APPROVAL]: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
  [OrderStatus.APPROVED]: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  [OrderStatus.AWAITING_ROUTING]: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
  [OrderStatus.ROUTED_TO_TRANSPORT]: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  [OrderStatus.ASSIGNED_TO_DRIVER]: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  [OrderStatus.PENDING_PAYMENT]: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  [OrderStatus.LOADING]: 'bg-purple-500/15 text-purple-700 dark:text-purple-400',
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
