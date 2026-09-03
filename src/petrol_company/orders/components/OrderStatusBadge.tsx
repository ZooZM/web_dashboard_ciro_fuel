import { useTranslation } from 'react-i18next';
import { orderStatusLabelKey, orderStatusTone, type OrderStatusTone } from '@/constants/order-status';
import { cn } from '@/lib/utils';

// Feature 013 T044/FR-011/R1: this file previously had its own hand-rolled status→style
// map missing the same four stages the platform's own vocabulary was missing dashboard-
// wide (AWAITING_ROUTING, ROUTED_TO_TRANSPORT, ASSIGNED_TO_DRIVER, LOADING), plus a
// dead, zero-consumer `ArabicStatusBadge` matching hardcoded mock strings ('جديد',
// 'تم الأسناد', …) — deleted outright. Now delegates to the same total, tested
// `orderStatusTone`/`orderStatusLabelKey` functions `transport_company`'s own
// `OrderStatusBadge` already uses, so a status this dashboard hasn't been taught yet
// still renders, conspicuously, rather than being silently absorbed into a neighbour's
// styling or omitted.
const TONE_STYLES: Record<OrderStatusTone, string> = {
  pending: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
  info: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  actionable: 'bg-amber-500/20 text-amber-800 dark:text-amber-400',
  progress: 'bg-purple-500/15 text-purple-700 dark:text-purple-400',
  success: 'bg-green-500/15 text-green-700 dark:text-green-400',
  danger: 'bg-red-500/15 text-red-700 dark:text-red-400',
  neutral: 'bg-gray-500/15 text-gray-700 dark:text-gray-400',
  unknown: 'bg-red-500/10 text-red-800 border border-dashed border-red-400 dark:text-red-300',
};

export function OrderStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const tone = orderStatusTone(status);

  return (
    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', TONE_STYLES[tone])}>
      {t(orderStatusLabelKey(status))}
    </span>
  );
}
