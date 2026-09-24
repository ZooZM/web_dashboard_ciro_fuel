import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { Invoice } from '@/petrol_company/invoices/api/invoices.api';
import { PaymentMethodPill } from '@/transport_company/orders/components/PaymentMethodPill';

// Feature 013 T103/FR-041/FR-098: wired to real `Invoice` documents. Dropped: an
// "invoice number" (only `_id` exists), station/owner/transporter display names (a list
// row has no batch endpoint to resolve them without N extra fetches per page), a platform
// commission figure (invoice-level, not tracked — Phase 12 scope), "سداد/تحويل بنكي"
// payment-method labels (fabricated; the real values are DIRECT/DEFERRED/CREDIT; the refresh's
// pill design is kept via `PaymentMethodPill`, keyed on the real `method`) and an
// export action (no export capability exists anywhere on the platform).
interface DesktopInvoicesTableProps {
  invoices: Invoice[];
  onSettle: (invoice: Invoice) => void;
}

export function DesktopInvoicesTable({ invoices, onSettle }: DesktopInvoicesTableProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="hidden lg:block overflow-hidden w-[100%]">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f8f9fa] hover:bg-[#f8f9fa] w-full border-b border-slate-100">
            <TableHead className="font-bold text-slate-700 text-[12px] text-right py-4 pr-6 pl-2 min-w-[120px]">{t('invoices.order')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 px-2 min-w-[100px]">{t('invoices.amount')}<br/><span className="text-[10px] text-slate-400 font-normal">(ر.س)</span></TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 px-2 min-w-[140px]">{t('invoices.method')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 px-2 min-w-[120px]">{t('invoices.issued')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 px-2 min-w-[100px]">{t('orders.status')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 pl-6 pr-2 min-w-[100px]">{t('invoices.action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow
              key={invoice._id}
              className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors cursor-pointer"
              onClick={() => navigate(`/petrolCompany/orders/${invoice.orderId}`)}
            >
              <TableCell className="align-middle py-4 pr-6 pl-2">
                <span className="text-slate-500 font-medium text-[12px] whitespace-nowrap">{invoice.orderId}</span>
              </TableCell>

              <TableCell className="align-middle text-center py-4 px-2">
                <span className="text-[#162155] font-black text-[13px]">{invoice.amount.toLocaleString()}</span>
              </TableCell>

              <TableCell className="align-middle text-center py-4 px-2">
                <PaymentMethodPill method={invoice.method} />
              </TableCell>

              <TableCell className="align-middle text-center py-4 px-2">
                <span className="text-slate-500 text-[11px] whitespace-nowrap" dir="ltr">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </span>
              </TableCell>

              <TableCell className="align-middle text-center py-4 px-2">
                <span className={cn(
                  "px-4 py-1 rounded-full text-[11px] font-bold whitespace-nowrap",
                  invoice.state === 'SETTLED' ? "bg-[#DCFCE7] text-[#16A34A]"
                    : invoice.state === 'VOID' ? "bg-slate-100 text-slate-500"
                    : "bg-[#FFEDD5] text-[#EA580C]",
                )}>
                  {t(`invoices.state.${invoice.state}`)}
                </span>
              </TableCell>

              <TableCell className="align-middle text-center py-4 pl-6 pr-2" onClick={(e) => e.stopPropagation()}>
                {invoice.method === 'CREDIT' && invoice.state === 'ISSUED' && (
                  <button
                    onClick={() => onSettle(invoice)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors"
                  >
                    {t('invoices.settle')}
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
