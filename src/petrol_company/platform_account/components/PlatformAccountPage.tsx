import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { DesktopPlatformAccountTable } from './DesktopPlatformAccountTable';
import { MobilePlatformAccountList } from './MobilePlatformAccountList';
import { useMovementsList } from '@/petrol_company/platform_account/hooks/usePlatformAccount';
import { useMyBillingBalances } from '@/petrol_company/invoices/hooks/useBilling';
import { AccountMovementKind } from '@/petrol_company/platform_account/api/platform-account.api';

type FilterValue = 'ALL' | typeof AccountMovementKind.COMMISSION_CHARGED | typeof AccountMovementKind.CASHBACK_CREDITED;
const FILTERS: FilterValue[] = ['ALL', AccountMovementKind.COMMISSION_CHARGED, AccountMovementKind.CASHBACK_CREDITED];

// Feature 013 T170/T171/T172/T173/FR-064/FR-068/FR-071: wired to `GET
// /platform-account/movements`, cursor-paged like every other list this feature built
// (never page-number pagination — the platform never returns a total, T171). Every
// fabricated stat card ("16.30% من الأسبوع الماضي" — no trend data source exists),
// the "رحلات الشهر"/"trips" column (AccountMovement carries none), and the FCA-facing
// "confirm transfer" action are gone — confirmation is `SUPER_ADMIN` only (FR-069);
// this role only ever sees the RECORDED/CONFIRMED distinction (T172), never a button
// that would 403. The two remaining stat cards read `GET /billing/balances/me`, the
// same figures Phase 12's banners already show.
export function PlatformAccountPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('ALL');
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const { data: balances } = useMyBillingBalances();
  const { data, isLoading, isError, refetch } = useMovementsList({
    ...(activeFilter === 'ALL' ? {} : { kind: activeFilter }),
    ...(cursor ? { cursor } : {}),
  });
  const movements = data?.items ?? [];

  function onFilterChange(filter: FilterValue): void {
    setActiveFilter(filter);
    setCursor(undefined);
  }

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start text-right">
        <h1 className="text-2xl font-black text-slate-900">{t('platformAccount.title')}</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">{t('platformAccount.subtitle')}</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center shrink-0">
            <img src="/petrolCompany/Commission%20&%20Cashback/purplePercentage.svg" alt="" className="w-10 h-10 object-contain" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm font-semibold text-slate-500">{t('billing.owed')}</span>
            <span className="text-xl font-black text-slate-900" dir="ltr">
              {(balances?.commissionAccrued ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {balances?.currency ?? 'SAR'}
            </span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
            <img src="/petrolCompany/Commission%20&%20Cashback/payment.svg" alt="" className="w-10 h-10 object-contain" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm font-semibold text-slate-500">{t('billing.available')}</span>
            <span className="text-xl font-black text-slate-900" dir="ltr">
              {(balances?.cashbackAccrued ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {balances?.currency ?? 'SAR'}
            </span>
          </div>
        </div>
      </div>

      {/* Filters Tabs */}
      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden w-full sm:w-fit mb-6 bg-white divide-x divide-x-reverse divide-slate-200">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          const label =
            filter === 'ALL'
              ? t('platformAccount.filterAll')
              : filter === AccountMovementKind.COMMISSION_CHARGED
                ? t('billing.commissionTitle')
                : t('billing.cashbackTitle');
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
                  layoutId="platform-active-tab"
                  className="absolute inset-0 bg-[#EEF2FF] border-b-2 border-blue-600"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
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
        ) : movements.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('platformAccount.empty')}</p>
        ) : (
          <>
            <DesktopPlatformAccountTable movements={movements} />
            <div className="px-4 pb-4 lg:hidden">
              <MobilePlatformAccountList movements={movements} />
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
    </div>
  );
}
