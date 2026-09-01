import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProgressOrderRow } from './ProgressOrderRow';
import { useOrdersList } from '@/transport_company/orders/hooks/useOrders';
import { OrderStatus, orderStatusLabelKey } from '@/constants/order-status';

interface ProgressOrdersCardProps {
  // Kept for AdminDashboard.tsx (out of this feature's scope), which reuses this same
  // component with its own "view all" destination — this card's own default otherwise
  // navigates to the transport surface's own orders list.
  onViewAllClick?: () => void;
}

/**
 * Feature 009 T112/SC-005: real in-progress orders (assigned through unloading) — the
 * eight identical mock rows are gone. Four list calls merged client-side, matching the
 * tracking sidebar's same pattern (`GET /orders` takes one status value, not a set).
 */
export function ProgressOrdersCard({ onViewAllClick }: ProgressOrdersCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const assigned = useOrdersList({ status: OrderStatus.ASSIGNED_TO_DRIVER });
  const loading = useOrdersList({ status: OrderStatus.LOADING });
  const inTransit = useOrdersList({ status: OrderStatus.IN_TRANSIT });
  const unloading = useOrdersList({ status: OrderStatus.UNLOADING });

  const isLoading = assigned.isLoading || loading.isLoading || inTransit.isLoading || unloading.isLoading;
  const isError = assigned.isError || loading.isError || inTransit.isError || unloading.isError;
  const refetchAll = () => {
    void assigned.refetch();
    void loading.refetch();
    void inTransit.refetch();
    void unloading.refetch();
  };
  const orders = [
    ...(assigned.data?.items ?? []),
    ...(loading.data?.items ?? []),
    ...(inTransit.data?.items ?? []),
    ...(unloading.data?.items ?? []),
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col h-[420px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="bg-blue-600 text-white text-[11px] font-black w-[22px] h-[22px] flex items-center justify-center rounded-full shadow-sm">
            {orders.length}
          </span>
          <h2 className="text-[17px] font-black text-[#1e293b]">{t('dashboard.inProgress')}</h2>
        </div>
        <button
          className="text-[14px] font-bold text-[#2563eb] hover:text-blue-700"
          onClick={onViewAllClick ?? (() => navigate('/transport/orders'))}
        >
          {t('dashboard.viewAll')}
        </button>
      </div>

      <div className="flex flex-col gap-1 flex-1 overflow-y-auto min-h-0 pr-2">
        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-8">{t('common.loading')}</p>
        ) : isError ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <p className="text-sm text-red-500">{t('errors.generic')}</p>
            <button onClick={refetchAll} className="text-sm font-bold text-blue-600 hover:underline">
              {t('common.retry')}
            </button>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-8">{t('dashboard.noInProgress')}</p>
        ) : (
          orders.map((order) => (
            <ProgressOrderRow
              key={order._id}
              order={{
                id: order._id,
                branch: order.deliveryAddressText || '—',
                time: new Date(order.createdAt).toLocaleString(),
                quantity: order.quantityLiters.toLocaleString(),
                fuelType: order.fuelType,
                status: t(orderStatusLabelKey(order.status)),
                statusClass: 'bg-[#E4F7EC] text-[#12A150]',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
