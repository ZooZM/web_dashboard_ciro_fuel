import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useOrderDetailContext } from './OrderDetailContext';
import { useInvoiceDetail } from '@/petrol_company/invoices/hooks/useInvoices';
import { SettleInvoiceModal } from '@/petrol_company/invoices/components/SettleInvoiceModal';

// Feature 013 T106/FR-042/FR-043/R4: wired to the order's own platform `Invoice`
// (`Order.invoiceId`, issued at approval — never at delivery, R4) via `GET /invoices/:id`,
// reusing the same `useInvoiceDetail` hook the invoices list screen uses (T104's "no
// second fetch path"). Distinct from the SUPPLIER (Aramco) invoice reconciliation flow,
// which is Phase 14 (US11) scope and does not exist yet — this card only ever shows the
// platform's own invoice, never a fabricated supplier figure (FR-047/FR-048).
export function LinkedInvoicesCard() {
  const { t } = useTranslation();
  const { order } = useOrderDetailContext();
  const { data: invoice, isLoading } = useInvoiceDetail(order?.invoiceId);
  const [isSettling, setIsSettling] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
          <img src="/transportCompany/orderPage/orderDetails/greenInvoice.svg" alt="" className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-xl font-black text-[#162155]">{t('invoices.title')}</h2>
      </div>

      {!order?.invoiceId ? (
        <p className="text-sm text-slate-400">{t('invoices.empty')}</p>
      ) : isLoading || !invoice ? (
        <p className="text-sm text-slate-400">{t('common.loading')}</p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('invoices.amount')}</span>
              <span className="text-lg font-black text-[#162155]">{invoice.amount.toLocaleString()} ر.س</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('invoices.method')}</span>
              <span className="text-sm font-bold text-slate-700">{t(`invoices.methodLabel.${invoice.method}`)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={cn(
              "px-4 py-1 rounded-full text-[11px] font-bold whitespace-nowrap",
              invoice.state === 'SETTLED' ? "bg-[#DCFCE7] text-[#16A34A]"
                : invoice.state === 'VOID' ? "bg-slate-100 text-slate-500"
                : "bg-[#FFEDD5] text-[#EA580C]",
            )}>
              {t(`invoices.state.${invoice.state}`)}
            </span>

            {invoice.method === 'CREDIT' && invoice.state === 'ISSUED' && (
              <button
                onClick={() => setIsSettling(true)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                {t('invoices.settle')}
              </button>
            )}
          </div>
        </div>
      )}

      {isSettling && invoice && (
        <SettleInvoiceModal
          invoice={invoice}
          onClose={() => setIsSettling(false)}
          onSettled={() => {
            toast.success(t('invoices.settleSuccess'));
            setIsSettling(false);
          }}
        />
      )}
    </div>
  );
}
