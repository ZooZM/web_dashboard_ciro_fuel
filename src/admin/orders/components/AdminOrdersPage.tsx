import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AdminDesktopOrdersTable } from './AdminDesktopOrdersTable';
import { AdminMobileOrdersList } from './AdminMobileOrdersList';
import { CursorPager } from '@/transport_company/orders/components/CursorPager';
import { useAdminOrders, usePlatformOrderSummary } from '@/admin/orders/hooks/useAdminOrders';
import {
  OrderStatusBucket,
  orderStatusBucketLabelKey,
} from '@/constants/order-status';

/**
 * spec 017 (operator dashboard) US3 — every order on the platform.
 *
 * **Five summary cards, not the mock's four** (FR-023a). The mock showed
 * total / completed / in-progress / rejected. Two things are wrong with that
 * set: `NEEDS_ATTENTION` — the one state that cannot progress without a human,
 * which is the whole reason the operator opens this screen — had no card at
 * all, and `CANCELLED` was folded away. Rejected and cancelled are now separate
 * figures and are **never summed into one in the UI** (FR-023b): different
 * actors, different acts.
 *
 * The card figures come from `GET /orders/summary`, which is the same
 * computation the home screen's chart reads — so the two screens cannot
 * disagree about what "in progress" means.
 */

/** One card per bucket, in the enum's own order, plus the total. */
const BUCKET_CARD_STYLES: Record<OrderStatusBucket, { icon: string; bg: string; value: string }> = {
  NEW: {
    icon: '/transportCompany/home/invoice.svg',
    bg: 'bg-[#DBEAFE]',
    value: 'text-[#3B82F6]',
  },
  IN_PROGRESS: {
    icon: '/transportCompany/home/sandWatch.svg',
    bg: 'bg-[#FFF7ED]',
    value: 'text-[#F97316]',
  },
  COMPLETED: {
    icon: '/transportCompany/home/rightCheck.svg',
    bg: 'bg-[#E8F5E9]',
    value: 'text-[#22C55E]',
  },
  REJECTED: {
    icon: '/transportCompany/home/schedule.svg',
    bg: 'bg-[#FEE2E2]',
    value: 'text-[#EF4444]',
  },
  CANCELLED: {
    icon: '/transportCompany/home/schedule.svg',
    bg: 'bg-[#F1F5F9]',
    value: 'text-[#64748B]',
  },
  NEEDS_ATTENTION: {
    icon: '/transportCompany/home/sandWatch.svg',
    bg: 'bg-[#FEF3C7]',
    value: 'text-[#D97706]',
  },
};

/**
 * The five cards the screen renders, and the one it does not.
 *
 * `COMPLETED` is deliberately absent from this list and present as its own card
 * below — it reads better beside the total than among the working states.
 */
const SUMMARY_BUCKETS: OrderStatusBucket[] = [
  OrderStatusBucket.NEW,
  OrderStatusBucket.IN_PROGRESS,
  OrderStatusBucket.NEEDS_ATTENTION,
  OrderStatusBucket.REJECTED,
  OrderStatusBucket.CANCELLED,
];

const FILTER_BUCKETS: (OrderStatusBucket | 'ALL')[] = [
  'ALL',
  ...Object.values(OrderStatusBucket),
];

export function AdminOrdersPage() {
  const { t } = useTranslation();
  const [bucket, setBucket] = useState<OrderStatusBucket | 'ALL'>('ALL');
  const [searchInput, setSearchInput] = useState('');
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  // A stack of visited cursors, so the pager can step back as well as forward.
  const [cursors, setCursors] = useState<(string | undefined)[]>([undefined]);
  const cursor = cursors[cursors.length - 1];

  const summary = usePlatformOrderSummary();
  const { data, isLoading, isError, refetch } = useAdminOrders({
    ...(bucket === 'ALL' ? {} : { bucket }),
    ...(orderId ? { orderId } : {}),
    ...(cursor ? { cursor } : {}),
  });

  const orders = data?.items ?? [];

  return (
    <div
      className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans"
      dir="rtl"
    >
      {/* --- Header --- */}
      <div className="mb-6 flex flex-col items-start text-right">
        <h1 className="text-2xl font-black text-slate-900">{t('adminOrders.title')}</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">{t('adminOrders.subtitle')}</p>
      </div>

      {/* --- Summary cards: the total plus FIVE buckets (FR-023a) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
        <SummaryCard
          title={t('adminOrders.total')}
          value={summary.data?.total}
          icon="/transportCompany/home/invoice.svg"
          iconBgClass="bg-[#F3E8FF]"
          valueColor="text-[#A855F7]"
        />
        <SummaryCard
          title={t(orderStatusBucketLabelKey(OrderStatusBucket.COMPLETED))}
          value={summary.data?.buckets[OrderStatusBucket.COMPLETED]}
          icon={BUCKET_CARD_STYLES.COMPLETED.icon}
          iconBgClass={BUCKET_CARD_STYLES.COMPLETED.bg}
          valueColor={BUCKET_CARD_STYLES.COMPLETED.value}
        />
        {SUMMARY_BUCKETS.map((b) => (
          <SummaryCard
            key={b}
            title={t(orderStatusBucketLabelKey(b))}
            value={summary.data?.buckets[b]}
            icon={BUCKET_CARD_STYLES[b].icon}
            iconBgClass={BUCKET_CARD_STYLES[b].bg}
            valueColor={BUCKET_CARD_STYLES[b].value}
          />
        ))}
      </div>

      {/* --- Bucket filter pills --- */}
      <div className="flex items-center gap-2 bg-white w-fit rounded-full p-2 justify-center mb-4 overflow-x-auto max-w-full">
        {FILTER_BUCKETS.map((option) => {
          const isActive = bucket === option;
          return (
            <button
              key={option}
              onClick={() => {
                setBucket(option);
                setCursors([undefined]);
              }}
              className={cn(
                'relative px-5 py-2 text-sm font-bold rounded-full transition-colors whitespace-nowrap cursor-pointer shrink-0',
                isActive ? 'text-white' : 'text-slate-700 hover:bg-slate-50',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-filter-pill-admin"
                  className="absolute inset-0 bg-blue-600 rounded-full shadow-sm border border-blue-600"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10">
                {option === 'ALL'
                  ? t('adminOrders.allBuckets')
                  : t(orderStatusBucketLabelKey(option))}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden pt-4 pb-0">
        {/*
          T056a/FR-016a — the search box takes an ORDER IDENTIFIER, and its
          label and placeholder say so. That wording is the requirement, not
          decoration: searching a company name and getting nothing back must
          read as "this box takes an order number", never as "that order does
          not exist". Free-text search is explicitly out of scope (research
          R13) — `Order` has no human reference field and the platform carries
          no text index, so it would mean a new index plus a migration, or an
          unindexed scan of every order on the operator's most-used screen.
        */}
        <form
          className="px-4 pb-4 flex flex-col gap-1 text-right"
          onSubmit={(event) => {
            event.preventDefault();
            setOrderId(searchInput.trim() || undefined);
            setCursors([undefined]);
          }}
        >
          <label
            htmlFor="admin-order-search"
            className="text-[11px] font-bold text-slate-600"
          >
            {t('adminOrders.searchLabel')}
          </label>
          <div className="flex items-center gap-2">
            <input
              id="admin-order-search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={t('adminOrders.searchPlaceholder')}
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold"
            >
              {t('common.search')}
            </button>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">
            {t('adminOrders.searchHint')}
          </span>
        </form>

        {/* FR-076: loading, empty and failed each render distinctly. */}
        <div className="bg-white">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <p className="font-medium text-sm">{t('adminOrders.loading')}</p>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="font-bold text-sm text-red-700">{t('adminOrders.failed')}</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold"
              >
                {t('common.retry')}
              </button>
            </div>
          )}

          {!isLoading && !isError && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <p className="font-medium text-sm">{t('adminOrders.empty')}</p>
            </div>
          )}

          {!isLoading && !isError && orders.length > 0 && (
            <>
              <AdminDesktopOrdersTable orders={orders} />
              <div className="px-4 pb-4 lg:hidden">
                <AdminMobileOrdersList orders={orders} />
              </div>
              {/*
                Cursor paging, not page numbers: the platform returns
                `{ items, nextCursor }` and cannot yield a total for a page
                count. The mock's `Pagination` component asked for a
                `totalItems` the platform has never produced — the refreshed
                design's numbered pager is drawn as `CursorPager` instead.
              */}
              <CursorPager
                page={cursors.length}
                hasPrev={cursors.length > 1}
                hasNext={!!data?.nextCursor}
                onPrev={() => setCursors((c) => c.slice(0, -1))}
                onNext={() => data?.nextCursor && setCursors((c) => [...c, data.nextCursor ?? undefined])}
                className="border-t border-slate-100"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** A count that has not loaded yet renders as a dash, never as `0` (FR-076). */
function SummaryCard({
  title,
  value,
  icon,
  iconBgClass,
  valueColor,
}: {
  title: string;
  value: number | undefined;
  icon: string;
  iconBgClass: string;
  valueColor: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-start gap-4 shadow-sm">
      <div
        className={cn(
          'w-12 h-12 flex items-center justify-center rounded-full shrink-0',
          iconBgClass,
        )}
      >
        <img src={icon} alt="" className="w-6 h-6 object-contain" />
      </div>
      <div className="flex flex-col items-start gap-1">
        <span className="text-sm font-semibold text-slate-500">{title}</span>
        <span className={cn('text-2xl font-black', valueColor)}>
          {value === undefined ? '—' : value.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
