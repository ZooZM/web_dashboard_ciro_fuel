import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { DesktopInvoicesTable } from './DesktopInvoicesTable';
import { MobileInvoicesList } from './MobileInvoicesList';
import { useInvoicesList } from '@/transport_company/invoices/hooks/useInvoices';
import { CursorPager } from '@/transport_company/orders/components/CursorPager';
import { FilterToolbar } from '@/components/ui/FilterToolbar';
import { useSummary } from '@/transport_company/dashboard/hooks/useSummary';

type FilterValue = 'ALL' | 'ISSUED' | 'SETTLED';

/**
 * Feature 009 T115/SC-005: wired to `GET /invoices` — seven identical fabricated invoices,
 * fake weekly-trend percentages and a fake company/station breakdown are gone.
 */
export function InvoicesListPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cursors of every page before the current one — `cursors[i]` opens page i + 1. Before the
  // pager existed this screen only ever showed the platform's first page.
  const [cursors, setCursors] = useState<(string | undefined)[]>([undefined]);
  const cursor = cursors[cursors.length - 1];
  const { data, isLoading, isError, refetch } = useInvoicesList({
    ...(activeFilter === 'ALL' ? {} : { state: activeFilter }),
    ...(cursor ? { cursor } : {}),
    ...(searchQuery ? { invoiceId: searchQuery } : {}),
  });
  const invoices = data?.items ?? [];
  const summary = useSummary();

  const FILTERS: { id: FilterValue; label: string }[] = [
    { id: 'ALL', label: t('common.all') },
    { id: 'ISSUED', label: t('invoices.state.ISSUED') },
    { id: 'SETTLED', label: t('invoices.state.SETTLED') },
  ];

  const statValue = (value: number | undefined) => (summary.isLoading || summary.isError ? '—' : (value ?? 0).toLocaleString());
  const STAT_CARDS = [
    {
      title: 'المدفوع',
      value: statValue(summary.data?.invoicesSummary?.paidTotal),
      icon: '/transportCompany/invoicePage/rightCheck.svg',
      iconBgClass: 'bg-green-100',
      valueColor: 'text-[#EF4444]',
    },
    {
      title: 'تحويلات',
      value: statValue(summary.data?.invoicesSummary?.overallTotal),
      icon: '/curved.svg', // using a generic icon for now
      iconBgClass: 'bg-orange-100',
      valueColor: 'text-[#12A150]',
    },
    {
      title: 'المستحق',
      value: statValue(summary.data?.invoicesSummary?.dueTotal),
      icon: '/transportCompany/invoicePage/schedule.svg',
      iconBgClass: 'bg-red-100',
      valueColor: 'text-[#1e293b]',
    },
  ];

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="mb-6 flex flex-col items-start text-right">
        <h1 className="text-2xl font-black text-slate-900">{t('invoices.title')}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {STAT_CARDS.map((card) => (
          <div key={card.title} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-col items-start gap-1">
              <span className="text-sm font-semibold text-slate-500">{card.title}</span>
              <span className={cn('text-2xl font-black', card.valueColor)}>
                {card.value} <span className="text-[12px]">ر.س</span>
              </span>
            </div>
            <div className={cn('w-12 h-12 flex items-center justify-center rounded-full shrink-0', card.iconBgClass)}>
              <img src={card.icon} alt="" className="w-6 h-6 object-contain" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden w-full sm:w-fit mb-6 bg-white divide-x divide-x-reverse divide-slate-200">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => {
              setActiveFilter(filter.id);
              setCursors([undefined]);
            }}
            className={cn(
              'px-4 sm:px-12 py-3 text-sm font-bold transition-colors whitespace-nowrap',
              activeFilter === filter.id ? 'bg-[#EEF2FF] text-[#162155] border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50',
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden pt-4 pb-0">
        <FilterToolbar
          searchPlaceholder="البحث برقم الفاتورة..."
          onSearch={(val) => {
            setSearchQuery(val);
            setCursors([undefined]);
          }}
        />

        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('common.loading')}</p>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <p className="text-sm text-red-500">{t('errors.generic')}</p>
            <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
              {t('common.retry')}
            </button>
          </div>
        ) : invoices.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('invoices.empty')}</p>
        ) : (
          <>
            <DesktopInvoicesTable invoices={invoices} />
            <div className="px-4 pb-4 lg:px-0 lg:pb-0">
              <MobileInvoicesList invoices={invoices} />
            </div>
          </>
        )}

        <CursorPager
          page={cursors.length}
          hasPrev={cursors.length > 1}
          hasNext={Boolean(data?.nextCursor)}
          onPrev={() => setCursors((c) => c.slice(0, -1))}
          onNext={() => data?.nextCursor && setCursors((c) => [...c, data.nextCursor ?? undefined])}
          className="border-t border-slate-200"
          itemCount={invoices.length}
          itemName="فاتورة"
        />
      </div>
    </div>
  );
}
