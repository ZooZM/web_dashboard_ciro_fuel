import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useSettleInvoice } from '@/transport_company/invoices/hooks/useInvoices';
import type { Invoice } from '@/transport_company/invoices/types';

/**
 * Feature 009 T115/SC-005: real invoices — company/station/owner/delivery-fee columns are
 * dropped (none is a field on `Invoice`); settlement is a real action (`POST /invoices/:id/
 * settle`), offered only for an outstanding DEFERRED invoice, which is what this company
 * actually owes.
 */
export function DesktopInvoicesTable({ invoices }: { invoices: Invoice[] }) {
  const { t } = useTranslation();
  const settle = useSettleInvoice();

  return (
    <div className="hidden lg:block overflow-hidden w-[100%]">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f8f9fa] hover:bg-[#f8f9fa] w-full border-b border-slate-100">
            <TableHead className="font-bold text-slate-700 text-[12px] text-right py-4 pr-6 pl-2">{t('invoices.title')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-right py-4 px-2">{t('orders.title')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 px-2">{t('invoices.amount')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 px-2">{t('invoices.issued')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 px-2">{t('orders.status')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 pl-6 pr-2">{t('invoices.action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice._id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors">
              <TableCell className="align-middle py-4 pr-6 pl-2">
                <span className="text-slate-500 font-medium text-[12px] whitespace-nowrap" dir="ltr">{invoice._id}</span>
              </TableCell>
              <TableCell className="align-middle py-4 px-2 text-right">
                <span className="text-slate-500 font-medium text-[12px] whitespace-nowrap" dir="ltr">{invoice.orderId}</span>
              </TableCell>
              <TableCell className="align-middle text-center py-4 px-2">
                <span className="text-slate-800 font-bold text-[12px]">{invoice.amount.toLocaleString()}</span>
              </TableCell>
              <TableCell className="align-middle text-center py-4 px-2">
                <span className="text-slate-500 text-[11px]" dir="ltr">{new Date(invoice.createdAt).toLocaleDateString()}</span>
              </TableCell>
              <TableCell className="align-middle text-center py-4 px-2">
                <span
                  className={
                    invoice.state === 'SETTLED'
                      ? 'bg-[#DCFCE7] text-[#16A34A] px-2 py-1 rounded-full text-[10px] font-bold'
                      : invoice.state === 'VOID'
                        ? 'bg-slate-100 text-slate-500 px-2 py-1 rounded-full text-[10px] font-bold'
                        : 'bg-[#FFEDD5] text-[#EA580C] px-2 py-1 rounded-full text-[10px] font-bold'
                  }
                >
                  {t(`invoices.state.${invoice.state}`)}
                </span>
              </TableCell>
              <TableCell className="align-middle text-center py-4 pl-6 pr-2">
                {invoice.state === 'ISSUED' && invoice.method === 'DEFERRED' && (
                  <Button size="sm" variant="outline" disabled={settle.isPending} onClick={() => settle.mutate({ id: invoice._id })}>
                    {t('invoices.settle')}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
