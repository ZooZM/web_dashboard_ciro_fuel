import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useSettleInvoice } from '@/transport_company/invoices/hooks/useInvoices';
import type { Invoice } from '@/transport_company/invoices/types';

export function MobileInvoicesList({ invoices }: { invoices: Invoice[] }) {
  const { t } = useTranslation();
  const settle = useSettleInvoice();

  return (
    <div className="flex flex-col gap-4 lg:hidden w-full">
      {invoices.map((invoice) => (
        <div key={invoice._id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-500 font-bold text-sm" dir="ltr">{invoice._id}</span>
            <span
              className={
                invoice.state === 'SETTLED'
                  ? 'bg-[#DCFCE7] text-[#16A34A] px-3 py-1 rounded-full text-[11px] font-bold'
                  : invoice.state === 'VOID'
                    ? 'bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[11px] font-bold'
                    : 'bg-[#FFEDD5] text-[#EA580C] px-3 py-1 rounded-full text-[11px] font-bold'
              }
            >
              {t(`invoices.state.${invoice.state}`)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-2">
            <div className="flex flex-col gap-1 text-right">
              <span className="text-slate-400 text-[10px] font-bold">{t('invoices.amount')}</span>
              <span className="text-slate-800 font-bold text-sm">{invoice.amount.toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-slate-400 text-[10px] font-bold">{t('invoices.issued')}</span>
              <span className="text-slate-800 font-bold text-sm" dir="ltr">{new Date(invoice.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {invoice.state === 'ISSUED' && invoice.method === 'DEFERRED' && (
            <Button size="sm" variant="outline" disabled={settle.isPending} onClick={() => settle.mutate({ id: invoice._id })}>
              {t('invoices.settle')}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
