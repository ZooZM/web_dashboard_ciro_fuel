import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { PaymentMethod } from '@/transport_company/orders/types';

// The transport UI refresh drew this column as "Sadad" vs "bank transfer". Neither is an
// order's payment method: Sadad is one channel a client may use to pay a DIRECT order, and
// bank transfer is a settlement method. The pill keeps that design and shows the platform's
// real `paymentMethod` instead.
const STYLES: Record<PaymentMethod, string> = {
  DIRECT: 'bg-[#eff6ff] border-blue-100 text-[#3b82f6]',
  DEFERRED: 'bg-[#faf5ff] border-purple-100 text-[#a855f7]',
  CREDIT: 'bg-slate-50 border-slate-200 text-slate-600',
};

export function PaymentMethodPill({ method }: { method: PaymentMethod | undefined }) {
  const { t } = useTranslation();
  if (!method || !(method in STYLES)) return <span className="text-slate-400 text-[11px]">—</span>;

  return (
    <div className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border', STYLES[method])}>
      {method === 'DIRECT' ? (
        <img src="/transportCompany/orderPage/orderDetails/invoice.svg" className="w-4 h-4" alt="" />
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 14H4L10 20M4 10H20L14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <span className="text-[11px] font-bold whitespace-nowrap">{t(`invoices.methodLabel.${method}`)}</span>
    </div>
  );
}
