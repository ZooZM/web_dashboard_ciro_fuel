import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { Invoice } from '@/petrol_company/invoices/api/invoices.api';

interface MobileInvoicesListProps {
  invoices: Invoice[];
  onSettle: (invoice: Invoice) => void;
}

export function MobileInvoicesList({ invoices, onSettle }: MobileInvoicesListProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 lg:hidden w-full">
      {invoices.map((invoice) => (
        <div
          key={invoice._id}
          onClick={() => navigate(`/petrolCompany/orders/${invoice.orderId}`)}
          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-500 font-bold text-sm">{invoice.orderId}</span>
            <span className={cn(
              "px-3 py-1 rounded-full text-[11px] font-bold",
              invoice.state === 'SETTLED' ? "bg-[#DCFCE7] text-[#16A34A]"
                : invoice.state === 'VOID' ? "bg-slate-100 text-slate-500"
                : "bg-[#FFEDD5] text-[#EA580C]",
            )}>
              {t(`invoices.state.${invoice.state}`)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <div className="flex flex-col gap-1 text-right">
              <span className="text-slate-400 text-[10px] font-bold">{t('invoices.amount')} (ر.س)</span>
              <span className="text-[#162155] font-black text-sm">{invoice.amount.toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-slate-400 text-[10px] font-bold">{t('invoices.method')}</span>
              <span className="text-[#162155] font-bold text-xs mt-1">{t(`invoices.methodLabel.${invoice.method}`)}</span>
            </div>
            <div className="flex flex-col gap-1 text-right col-span-2">
              <span className="text-slate-400 text-[10px] font-bold">{t('invoices.issued')}</span>
              <span className="text-slate-600 font-bold text-xs" dir="ltr">{new Date(invoice.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {invoice.method === 'CREDIT' && invoice.state === 'ISSUED' && (
            <div className="flex items-center justify-end pt-3 border-t border-slate-100 mt-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onSettle(invoice)}
                className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                {t('invoices.settle')}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
