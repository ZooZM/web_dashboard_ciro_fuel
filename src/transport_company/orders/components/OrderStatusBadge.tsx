import { useTranslation } from 'react-i18next';
import { isKnownOrderStatus, orderStatusLabelKey, OrderStatus } from '@/constants/order-status';
import { cn } from '@/lib/utils';

// Feature 009 Slice 1 (T015-T017): total over every stage the platform can ever send —
// including one this dashboard's vocabulary has not been taught yet (FR-011). `unknown`
// renders as a visibly distinct, conspicuous state; it is never absorbed into an existing
// status's styling.
//
// The pill-with-dot design comes from the transport UI refresh. That design keyed its colours
// on Arabic display strings ('جديد', 'قيد التحميل', …), which the platform never sends — every
// real order would have fallen through to the grey default. It is keyed on `OrderStatus` here,
// and the label stays the platform's own stage name.
interface PillStyle {
  bg: string;
  text: string;
  dot: string;
  pulse?: boolean;
}

const IN_PREPARATION: PillStyle = { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]', dot: 'bg-[#D97706]' };

const STATUS_STYLES: Record<OrderStatus, PillStyle> = {
  PENDING_APPROVAL: IN_PREPARATION,
  APPROVED: IN_PREPARATION,
  AWAITING_ROUTING: IN_PREPARATION,
  PENDING_PAYMENT: IN_PREPARATION,
  // "New" from the transporter's side: routed here and waiting for a driver.
  ROUTED_TO_TRANSPORT: { bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]', dot: 'bg-[#16A34A]', pulse: true },
  ASSIGNED_TO_DRIVER: { bg: 'bg-[#eff6ff]', text: 'text-[#2563eb]', dot: 'bg-[#2563eb]' },
  LOADING: { bg: 'bg-[#fff7ed]', text: 'text-[#ea580c]', dot: 'bg-[#ea580c]' },
  IN_TRANSIT: { bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]', dot: 'bg-[#16A34A]' },
  UNLOADING: { bg: 'bg-[#f1f5f9]', text: 'text-[#475569]', dot: 'bg-[#475569]' },
  DELIVERED: { bg: 'bg-[#f8fafc]', text: 'text-[#64748b]', dot: 'bg-[#94a3b8]' },
  REJECTED: { bg: 'bg-[#FEE2E2]', text: 'text-[#EF4444]', dot: 'bg-[#EF4444]' },
  CANCELLED: { bg: 'bg-[#fef2f2]', text: 'text-[#dc2626]', dot: 'bg-[#dc2626]' },
};

const UNKNOWN_STYLE: PillStyle = {
  bg: 'bg-red-500/10 border border-dashed border-red-400',
  text: 'text-red-800',
  dot: 'bg-red-500',
};

export function OrderStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const style = isKnownOrderStatus(status) ? STATUS_STYLES[status] : UNKNOWN_STYLE;

  return (
    <div className={cn('inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full', style.bg)}>
      <div className="relative flex h-1.5 w-1.5 shrink-0 items-center justify-center">
        {style.pulse && (
          <span className={cn('absolute inline-flex h-full w-full rounded-full animate-ping opacity-75', style.dot)} />
        )}
        <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', style.dot)} />
      </div>
      <span className={cn('text-[10px] font-bold whitespace-nowrap', style.text)}>{t(orderStatusLabelKey(status))}</span>
    </div>
  );
}
