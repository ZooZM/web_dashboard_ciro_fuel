import { useTranslation } from 'react-i18next';
import { NewOrderRow } from './NewOrderRow';
import { useNavigate } from 'react-router-dom';
import { useOrdersList } from '@/transport_company/orders/hooks/useOrders';
import { OrderStatus } from '@/constants/order-status';

/**
 * Feature 009 T112/SC-005: real `ROUTED_TO_TRANSPORT` orders — the ten identical mock rows
 * are gone. This is the work queue (FR-009); clicking a row goes straight to assignment.
 */
interface NewOrdersCardProps {
  onViewAllClick?: () => void;
}

export function NewOrdersCard({ onViewAllClick }: NewOrdersCardProps = {}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useOrdersList({ status: OrderStatus.ROUTED_TO_TRANSPORT });
  const orders = data?.items ?? [];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col h-[420px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="bg-[#FF6D00] text-white text-[11px] font-black w-[22px] h-[22px] flex items-center justify-center rounded-full shadow-sm">
            {orders.length}
          </span>
          <h2 className="text-[17px] font-black text-[#1e293b]">{t('dashboard.newOrders')}</h2>
        </div>
        <button className="text-[14px] font-bold text-[#2563eb] hover:text-blue-700" onClick={onViewAllClick ?? (() => navigate('/transport/orders'))}>
          {t('dashboard.viewAll')}
        </button>
      </div>

      <div className="flex flex-col gap-1 flex-1 overflow-y-auto min-h-0 pr-2">
        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-8">{t('common.loading')}</p>
        ) : isError ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <p className="text-sm text-red-500">{t('errors.generic')}</p>
            <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
              {t('common.retry')}
            </button>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-8">{t('dashboard.noNewOrders')}</p>
        ) : (
          orders.map((order) => (
            <NewOrderRow
              key={order._id}
              order={{
                id: order._id,
                logo: '',
                companyName: order._id,
                location: order.deliveryAddressText || '—',
                time: new Date(order.createdAt).toLocaleString(),
                quantity: order.quantityLiters.toLocaleString(),
                fuelType: order.fuelType,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
