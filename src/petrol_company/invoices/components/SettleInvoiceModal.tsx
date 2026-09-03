import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@/lib/api/api-error';
import type { Invoice } from '@/petrol_company/invoices/api/invoices.api';
import { useSettleInvoice } from '@/petrol_company/invoices/hooks/useInvoices';

// Feature 013 T105/FR-043: `POST /invoices/:id/settle` — offered only for CREDIT invoices
// still ISSUED (the DIRECT/DEFERRED cases the backend itself refuses for this role are
// never rendered as an option here in the first place, matching the callers in
// `DesktopInvoicesTable`/`MobileInvoicesList`). A 409 (already settled by someone else in
// the meantime) surfaces as the platform's own message, not a generic failure.
interface SettleInvoiceModalProps {
  invoice: Invoice;
  onClose: () => void;
  onSettled: () => void;
}

export function SettleInvoiceModal({ invoice, onClose, onSettled }: SettleInvoiceModalProps) {
  const { t } = useTranslation();
  const settleInvoice = useSettleInvoice(invoice._id);
  const [paymentReference, setPaymentReference] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setError(null);
    try {
      await settleInvoice.mutateAsync(paymentReference.trim() || undefined);
      onSettled();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] w-full max-w-[360px] overflow-hidden shadow-2xl" dir="rtl">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <span className="font-bold text-[#162155] text-base">{t('invoices.settleTitle')}</span>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="bg-[#F1F5F9] rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">{t('invoices.amount')}</span>
            <span className="font-black text-[#162155] text-lg">{invoice.amount.toLocaleString()} ر.س</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-500">{t('invoices.paymentReference')}</span>
            <input
              type="text"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              dir="ltr"
            />
          </div>

          {error && <p className="text-sm font-bold text-red-500">{error}</p>}
        </div>

        <div className="p-5 pt-0 flex items-center gap-3">
          <button
            onClick={handleConfirm}
            disabled={settleInvoice.isPending}
            className="flex-1 py-2.5 rounded-xl bg-[#1E5FFF] text-white font-bold hover:bg-blue-700 transition-colors text-sm disabled:opacity-60"
          >
            {t('invoices.settle')}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[#1E5FFF] font-bold hover:bg-slate-50 transition-colors bg-white text-sm">
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
