import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllInvoices, useFuelCompaniesList } from '@/admin/petrol_companies/hooks/useFuelCompanies';

type FilterValue = 'ALL' | 'ISSUED' | 'SETTLED' | 'VOID';
const FILTERS: FilterValue[] = ['ALL', 'ISSUED', 'SETTLED', 'VOID'];

// Feature 013 T248 (Phase 17 polish): real `GET /invoices`, unscoped for `SUPER_ADMIN`
// (every company's invoices, cursor-paged like every other list this feature built —
// never page-number pagination, the platform never returns a total). The previous
// mock's four stat cards (عمولة/تحويلات/المدفوع/المستحق) had no real cross-company
// aggregate source and are dropped rather than fabricated — a per-company equivalent
// already exists for real on the fuel company detail screen (T238). Deferred past
// Phase 9 (its own comment explained why: `GET /invoices` excludes `SUPER_ADMIN`) until
// Phase 16 added the `SUPER_ADMIN` role to that route.
export function AdminInvoicesListPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('ALL');
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, isError, refetch } = useAllInvoices(cursor);
  const { data: companies } = useFuelCompaniesList();

  const companyNameById = new Map((companies ?? []).map((c) => [c._id, c.name]));
  const items = (data?.items ?? []).filter((inv) => activeFilter === 'ALL' || inv.state === activeFilter);

  function onFilterChange(filter: FilterValue): void {
    setActiveFilter(filter);
    setCursor(undefined);
  }

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="mb-6 flex flex-col items-start text-right">
        <h1 className="text-2xl font-black text-slate-900">{t('invoices.title')}</h1>
      </div>

      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden w-full sm:w-fit mb-6 bg-white divide-x divide-x-reverse divide-slate-200">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          const label = filter === 'ALL' ? t('invoices.filterAll') : t(`invoices.state.${filter}`);
          return (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={cn(
                'relative flex-1 sm:flex-none px-4 sm:px-12 py-3 text-sm font-bold transition-colors whitespace-nowrap cursor-pointer text-center',
                isActive ? 'text-[#162155]' : 'text-slate-500 hover:bg-slate-50',
              )}
            >
              {isActive && (
                <motion.div layoutId="admin-invoices-active-tab" className="absolute inset-0 bg-[#EEF2FF] border-b-2 border-blue-600" transition={{ type: 'spring', stiffness: 300, damping: 25 }} />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden pt-4 pb-0">
        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('common.loading')}</p>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <p className="text-sm text-red-500">{t('invoices.loadError')}</p>
            <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
              {t('common.retry')}
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('invoices.empty')}</p>
        ) : (
          <>
            <div className="hidden lg:block overflow-hidden w-full">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f8f9fa] hover:bg-[#f8f9fa] w-full border-b border-slate-100">
                    <TableHead className="font-bold text-slate-700 text-[12px] text-right py-4 pr-6 pl-2">{t('adminCompanies.companyName')}</TableHead>
                    <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 px-2">{t('invoices.amount')}<br/><span className="text-[10px] text-slate-400 font-normal">({t('invoices.currency')})</span></TableHead>
                    <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 px-2">{t('invoices.method')}</TableHead>
                    <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 pl-6 pr-2">{t('orders.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((invoice) => (
                    <TableRow key={invoice._id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors">
                      <TableCell className="py-4 pr-6 pl-2 text-slate-500 font-medium text-[12px]">{companyNameById.get(invoice.fuelCompanyId) ?? '—'}</TableCell>
                      <TableCell className="py-4 px-2 text-center text-[#162155] font-black text-[13px]" dir="ltr">{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell className="py-4 px-2 text-center text-[11px] font-bold">{t(`invoices.methodLabel.${invoice.method}`)}</TableCell>
                      <TableCell className="py-4 pl-6 pr-2 text-center">
                        <span className={cn('px-4 py-1 rounded-full text-[11px] font-bold whitespace-nowrap', invoice.state === 'SETTLED' ? 'bg-[#DCFCE7] text-[#16A34A]' : invoice.state === 'VOID' ? 'bg-slate-100 text-slate-500' : 'bg-[#FFEDD5] text-[#EA580C]')}>
                          {t(`invoices.state.${invoice.state}`)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {data?.nextCursor && (
              <div className="flex justify-center py-4 border-t border-slate-100">
                <button onClick={() => setCursor(data.nextCursor!)} className="text-sm font-bold text-blue-600 hover:underline">
                  {t('common.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
