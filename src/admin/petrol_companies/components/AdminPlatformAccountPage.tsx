import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { DesktopPlatformAccountTable } from '@/petrol_company/platform_account/components/DesktopPlatformAccountTable';
import { MobilePlatformAccountList } from '@/petrol_company/platform_account/components/MobilePlatformAccountList';
import { useAllMovements } from '@/admin/petrol_companies/hooks/useFuelCompanies';
import { AccountMovementKind } from '@/petrol_company/platform_account/api/platform-account.api';

type FilterValue = 'ALL' | typeof AccountMovementKind.COMMISSION_CHARGED | typeof AccountMovementKind.CASHBACK_CREDITED;
const FILTERS: FilterValue[] = ['ALL', AccountMovementKind.COMMISSION_CHARGED, AccountMovementKind.CASHBACK_CREDITED];

// Feature 013 T248 (Phase 17 polish): real `GET /platform-account/movements`, unscoped
// for `SUPER_ADMIN` (every company's ledger, cursor-paged). Reuses the REAL
// `DesktopPlatformAccountTable`/`MobilePlatformAccountList` from `petrol_company/
// platform_account` directly — unlike every other split this session made, no role
// mismatch exists here: both this page and the FCA's own ledger call the identical `GET
// /platform-account/movements` endpoint, just with a different (or absent) `companyId`
// filter, so the real components' `AccountMovement[]` prop shape and rendering (T172's
// RECORDED/CONFIRMED distinction, document download) both apply unchanged. The previous
// mock's three stat cards (with a fabricated "16.30% من الأسبوع الماضي" trend on every
// one, FR-047's exact violation) are dropped — no cross-company aggregate source exists,
// and the per-company real figures already live on the fuel company detail screen (T238).
export function AdminPlatformAccountPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('ALL');
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, isError, refetch } = useAllMovements(cursor);

  const items = (data?.items ?? []).filter((m) => activeFilter === 'ALL' || m.kind === activeFilter);

  function onFilterChange(filter: FilterValue): void {
    setActiveFilter(filter);
    setCursor(undefined);
  }

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="mb-6 flex flex-col items-start text-right">
        <h1 className="text-2xl font-black text-slate-900">{t('platformAccount.title')}</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">{t('adminCompanies.exchangeOversightSubtitle')}</p>
      </div>

      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden w-full sm:w-fit mb-6 bg-white divide-x divide-x-reverse divide-slate-200">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          const label =
            filter === 'ALL' ? t('platformAccount.filterAll') : filter === AccountMovementKind.COMMISSION_CHARGED ? t('billing.commissionTitle') : t('billing.cashbackTitle');
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
                <motion.div layoutId="admin-platform-active-tab" className="absolute inset-0 bg-[#EEF2FF] border-b-2 border-blue-600" transition={{ type: 'spring', stiffness: 300, damping: 25 }} />
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
            <p className="text-sm text-red-500">{t('platformAccount.loadError')}</p>
            <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
              {t('common.retry')}
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('platformAccount.empty')}</p>
        ) : (
          <>
            <DesktopPlatformAccountTable movements={items} />
            <div className="px-4 pb-4 lg:hidden">
              <MobilePlatformAccountList movements={items} />
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
