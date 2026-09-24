import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DesktopOrdersTable } from './DesktopOrdersTable';
import { MobileOrdersList } from './MobileOrdersList';
import { CursorPager } from './CursorPager';
import { FilterToolbar } from '@/components/ui/FilterToolbar';
import { useOrdersList } from '@/transport_company/orders/hooks/useOrders';
import { useSummary } from '@/transport_company/dashboard/hooks/useSummary';
import { OrderStatusBucket, orderStatusBucketLabelKey } from '@/constants/order-status';

type FilterValue = OrderStatusBucket | 'ALL';

// The platform's own buckets (the list is filtered server-side by `?bucket=`), so a pill can
// never disagree with the status badges inside it. NEW is where a transporter's work queue
// (ROUTED_TO_TRANSPORT) lives — FR-009's one-step reach. REJECTED is omitted: rejection happens
// at fuel-company approval, before an order is ever routed here, so that pill could only
// ever be empty. CANCELLED is real (a fuel company may cancel up to LOADING).
const FILTERS: FilterValue[] = [
  'ALL',
  OrderStatusBucket.NEW,
  OrderStatusBucket.IN_PROGRESS,
  OrderStatusBucket.COMPLETED,
  OrderStatusBucket.CANCELLED,
];

/**
 * Feature 009 T031/T032/FR-001/FR-009/FR-019/SC-005: wired to `GET /orders`, cursor-paged
 * (never `page`) — every hardcoded sample order (`ORD-2024-25x`, all identical) is gone.
 *
 * The stat cards read `GET /orders/summary` (the same counts as the dashboard home): cursor
 * paging cannot yield a total, and counting the visible page would be wrong past page one.
 */
export function OrdersListPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('ALL');
  const [orderId, setOrderId] = useState('');
  // Cursors of every page before the current one — `cursors[i]` opens page i + 1.
  const [cursors, setCursors] = useState<(string | undefined)[]>([undefined]);
  const cursor = cursors[cursors.length - 1];

  const { data, isLoading, isError, refetch } = useOrdersList({
    ...(activeFilter === 'ALL' ? {} : { bucket: activeFilter }),
    ...(orderId ? { orderId } : {}),
    ...(cursor ? { cursor } : {}),
  });
  const orders = data?.items ?? [];
  const summary = useSummary();

  function resetPaging(): void {
    setCursors([undefined]);
  }

  const statValue = (value: number | undefined) => (summary.isLoading || summary.isError ? '—' : (value ?? 0));
  const STAT_CARDS = [
    {
      title: t('dashboard.awaitingAssignment'),
      value: statValue(summary.data?.awaitingAssignment),
      icon: '/transportCompany/home/invoice.svg',
      iconBgClass: 'bg-[#F3E8FF]',
      valueColor: 'text-[#A855F7]',
    },
    {
      title: t('dashboard.inProgress'),
      value: statValue(summary.data?.inProgress),
      icon: '/transportCompany/home/sandWatch.svg',
      iconBgClass: 'bg-[#FFF7ED]',
      valueColor: 'text-[#F97316]',
    },
    {
      title: t('orders.completedThisMonth'),
      value: statValue(summary.data?.completedInPeriod),
      icon: '/transportCompany/home/rightCheck.svg',
      iconBgClass: 'bg-[#E8F5E9]',
      valueColor: 'text-[#22C55E]',
    },
  ];

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="mb-6 flex flex-col items-start text-right">
        <h1 className="text-2xl font-black text-slate-900">{t('orders.title')}</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">{t('orders.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {STAT_CARDS.map((card) => (
          <div key={card.title} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-col items-start gap-1">
              <span className="text-sm font-semibold text-slate-500">{card.title}</span>
              <span className={cn('text-2xl font-black', card.valueColor)}>{card.value}</span>
            </div>
            <div className={cn('w-12 h-12 flex items-center justify-center rounded-full shrink-0', card.iconBgClass)}>
              <img src={card.icon} alt="" className="w-6 h-6 object-contain" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-white w-fit max-w-full rounded-full p-2 justify-center mb-4 overflow-x-auto">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          const label = filter === 'ALL' ? t('common.all') : t(orderStatusBucketLabelKey(filter));
          return (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                resetPaging();
              }}
              className={cn(
                'relative px-5 py-2 text-sm font-bold rounded-full transition-colors whitespace-nowrap cursor-pointer',
                isActive ? 'text-white' : 'text-slate-700 hover:bg-slate-50',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-filter-pill"
                  className="absolute inset-0 bg-blue-600 rounded-full shadow-sm border border-blue-600"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden pt-4 pb-0">
        <FilterToolbar
          searchPlaceholder={t('orders.searchById')}
          onSearch={(val) => {
            setOrderId(val.trim());
            resetPaging();
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
        ) : orders.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">{orderId ? t('orders.noMatch') : t('orders.empty')}</p>
        ) : (
          <>
            <DesktopOrdersTable orders={orders} />
            <div className="px-4 pb-4 lg:px-0 lg:pb-0">
              <MobileOrdersList orders={orders} />
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
        />
      </div>
    </div>
  );
}
