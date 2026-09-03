import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { DesktopInvoicesTable } from './DesktopInvoicesTable';
import { MobileInvoicesList } from './MobileInvoicesList';
import { SettleInvoiceModal } from './SettleInvoiceModal';
import { useInvoicesList } from '@/petrol_company/invoices/hooks/useInvoices';
import type { Invoice } from '@/petrol_company/invoices/api/invoices.api';
import { PlatformCommissionBanner } from './PlatformCommissionBanner';
import { CashbackBanner } from './CashbackBanner';

type FilterValue = 'ALL' | 'ISSUED' | 'SETTLED' | 'VOID';
const FILTERS: FilterValue[] = ['ALL', 'ISSUED', 'SETTLED', 'VOID'];

// Feature 013 T101-T108/FR-041/FR-042/FR-043/FR-047/FR-048/FR-056: wired to `GET /invoices`,
// cursor-paged like `OrdersListPage` (never page-number pagination — the platform never
// returns a total). Every fabricated stat card (transfers/paid/due/commission with a
// week-over-week trend), the two commission/cashback promo banners, the free-text search
// (no server-side search param exists), and the export action (no export capability
// anywhere) are gone. T108: CashbackBanner/CommissionTypeSelector/PlatformCommissionBanner
// stayed unwired for this role in Phase 9 (T108) — Phase 12 (T154/US9) wires both to real
// `GET /billing/*` balances, read-only for this role (T155). The previous SUPER_ADMIN mock
// this file also served now lives at
// `admin/petrol_companies/components/AdminInvoicesListPage.tsx` (out of this phase's scope
// — `GET /invoices` excludes SUPER_ADMIN entirely, so sharing this component would 403).
export function InvoicesListPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('ALL');
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [settlingInvoice, setSettlingInvoice] = useState<Invoice | null>(null);

  const { data, isLoading, isError, refetch } = useInvoicesList({
    ...(activeFilter === 'ALL' ? {} : { state: activeFilter }),
    ...(cursor ? { cursor } : {}),
  });
  const invoices = data?.items ?? [];

  function onFilterChange(filter: FilterValue): void {
    setActiveFilter(filter);
    setCursor(undefined);
  }

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="mb-6 flex flex-col items-start text-right">
        <h1 className="text-2xl font-black text-slate-900">{t('invoices.title')}</h1>
      </div>

      <PlatformCommissionBanner />
      <CashbackBanner />

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
                <motion.div
                  layoutId="active-invoice-filter-tab"
                  className="absolute inset-0 bg-[#EEF2FF] border-b-2 border-blue-600"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
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
        ) : invoices.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('invoices.empty')}</p>
        ) : (
          <>
            <DesktopInvoicesTable invoices={invoices} onSettle={setSettlingInvoice} />
            <div className="px-4 pb-4 lg:hidden">
              <MobileInvoicesList invoices={invoices} onSettle={setSettlingInvoice} />
            </div>
            {data?.nextCursor && (
              <div className="flex justify-center py-4 border-t border-slate-100">
                <button
                  onClick={() => setCursor(data.nextCursor!)}
                  className="text-sm font-bold text-blue-600 hover:underline"
                >
                  {t('common.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {settlingInvoice && (
        <SettleInvoiceModal
          invoice={settlingInvoice}
          onClose={() => setSettlingInvoice(null)}
          onSettled={() => {
            toast.success(t('invoices.settleSuccess'));
            setSettlingInvoice(null);
          }}
        />
      )}
    </div>
  );
}
