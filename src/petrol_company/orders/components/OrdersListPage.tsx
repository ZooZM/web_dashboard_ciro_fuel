import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { DesktopOrdersTable } from './DesktopOrdersTable';
import { MobileOrdersList } from './MobileOrdersList';
import { useOrdersList } from '@/petrol_company/orders/hooks/useOrders';
import { OrderStatus, orderStatusLabelKey } from '@/constants/order-status';
import type { OrderStatus as OrderStatusType } from '@/constants/order-status';

type FilterValue = OrderStatusType | 'ALL';

// FR-010: the full platform vocabulary, not a curated subset — an administrator must be
// able to filter by every stage the platform defines.
const FILTERS: FilterValue[] = [
  'ALL',
  OrderStatus.PENDING_APPROVAL,
  OrderStatus.APPROVED,
  OrderStatus.AWAITING_ROUTING,
  OrderStatus.ROUTED_TO_TRANSPORT,
  OrderStatus.ASSIGNED_TO_DRIVER,
  OrderStatus.LOADING,
  OrderStatus.IN_TRANSIT,
  OrderStatus.UNLOADING,
  OrderStatus.DELIVERED,
  OrderStatus.REJECTED,
  OrderStatus.CANCELLED,
];

// Feature 013 T044/FR-008/FR-009/FR-010/FR-047/FR-048/SC-002: wired to `GET /orders`,
// cursor-paged (never `page`) — every hardcoded sample order and every fabricated stat
// card is gone. No week-over-week trend, no per-order commission/invoice figure: neither
// exists anywhere on the platform (FR-047).
export function OrdersListPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('ALL');
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const { data, isLoading, isError, refetch } = useOrdersList({
    ...(activeFilter === 'ALL' ? {} : { status: activeFilter }),
    ...(cursor ? { cursor } : {}),
  });
  const orders = data?.items ?? [];

  function onFilterChange(filter: FilterValue): void {
    setActiveFilter(filter);
    setCursor(undefined); // FR-009: a new filter starts a fresh page, never appends onto the old one.
  }

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="mb-6 flex flex-col items-start text-right">
        <h1 className="text-2xl font-black text-slate-900">{t('orders.title')}</h1>
      </div>

      <div className="flex items-center gap-2 bg-white w-fit rounded-full p-2 justify-center mb-4 overflow-x-auto max-w-full">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          const label = filter === 'ALL' ? t('orders.filterAll') : t(orderStatusLabelKey(filter));
          return (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={cn(
                'relative px-4 py-2 text-sm font-bold rounded-full transition-colors whitespace-nowrap cursor-pointer shrink-0',
                isActive ? 'text-white' : 'text-slate-700 hover:bg-slate-50',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-order-filter-pill"
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
        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('common.loading')}</p>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <p className="text-sm text-red-500">{t('orders.loadError')}</p>
            <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
              {t('common.retry')}
            </button>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('orders.empty')}</p>
        ) : (
          <>
            <DesktopOrdersTable orders={orders} />
            <div className="px-4 pb-4 lg:px-0 lg:pb-0">
              <MobileOrdersList orders={orders} />
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
