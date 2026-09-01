import { useTranslation } from 'react-i18next';
import { orderStatusLabelKey, orderStatusTone, type OrderStatusTone } from '@/constants/order-status';
import { cn } from '@/lib/utils';

// Feature 009 Slice 1 (T015-T017): keyed on tone rather than directly on OrderStatus, so this
// component is total over every stage the platform can ever send — including one this
// dashboard's vocabulary has not been taught yet (FR-011). `unknown` renders as a visibly
// distinct, conspicuous state; it is never absorbed into an existing status's styling.
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
