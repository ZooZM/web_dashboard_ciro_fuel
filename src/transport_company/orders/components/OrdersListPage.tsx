import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { DesktopOrdersTable } from './DesktopOrdersTable';
import { MobileOrdersList } from './MobileOrdersList';
import { useOrdersList } from '@/transport_company/orders/hooks/useOrders';
import { OrderStatus, orderStatusLabelKey } from '@/constants/order-status';
import type { OrderStatus as OrderStatusType } from '@/constants/order-status';

type FilterValue = OrderStatusType | 'ALL';

// FR-009: the work queue is reachable in one step — ROUTED_TO_TRANSPORT is the default
// filter's first-class entry, not buried in a generic "all" list.
const FILTERS: FilterValue[] = [
  'ALL',
  OrderStatus.ROUTED_TO_TRANSPORT,
  OrderStatus.ASSIGNED_TO_DRIVER,
  OrderStatus.LOADING,
  OrderStatus.IN_TRANSIT,
  OrderStatus.UNLOADING,
  OrderStatus.DELIVERED,
];

/**
 * Feature 009 T031/T032/FR-001/FR-009/FR-019/SC-005: wired to `GET /orders`, cursor-paged
 * (never `page`) — every hardcoded sample order (`ORD-2024-25x`, all identical) is gone.
 */
export function OrdersListPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('ALL');

  const { data, isLoading, isError, refetch } = useOrdersList(
    activeFilter === 'ALL' ? {} : { status: activeFilter },
  );
  const orders = data?.items ?? [];

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="mb-6 flex flex-col items-start text-right">
        <h1 className="text-2xl font-black text-slate-900">{t('orders.title')}</h1>
      </div>

      <div className="flex items-center gap-2 bg-white w-fit rounded-full p-2 justify-center mb-4 overflow-x-auto">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          const label = filter === 'ALL' ? t('common.all') : t(orderStatusLabelKey(filter));
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'px-5 py-2 text-sm font-bold rounded-full transition-colors whitespace-nowrap cursor-pointer',
                isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-50',
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden pt-4 pb-0">
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
          <p className="text-center text-sm text-slate-400 py-12">{t('orders.empty')}</p>
        ) : (
          <>
            <DesktopOrdersTable orders={orders} />
            <div className="px-4 pb-4 lg:px-0 lg:pb-0">
              <MobileOrdersList orders={orders} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
