import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useTracking } from './TrackingContext';
import { orderStatusLabelKey } from '@/constants/order-status';

/**
 * Feature 009 T053/SC-005: real in-transit/unloading deliveries — six identical fabricated
 * rows are gone. Selecting a row switches the live connection to that delivery.
 */
export function TrackingSidebar() {
  const { t } = useTranslation();
  const { trackableOrders, isLoading, isError, refetch, selectedOrderId, selectOrder } = useTracking();

  return (
    <div className="w-full lg:w-[380px] shrink-0 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-8">{t('common.loading')}</p>
        ) : isError ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <p className="text-sm text-red-500">{t('errors.generic')}</p>
            <button onClick={refetch} className="text-sm font-bold text-blue-600 hover:underline">
              {t('common.retry')}
            </button>
          </div>
        ) : trackableOrders.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-8">{t('tracking.noDeliveries')}</p>
        ) : (
          trackableOrders.map((order) => (
            <div
              key={order._id}
              onClick={() => selectOrder(order._id)}
              className={cn(
                'p-4 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-colors shadow-sm',
                selectedOrderId === order._id ? 'border-blue-500 bg-[#F8FAFC]' : 'border-slate-200 bg-white hover:bg-slate-50',
              )}
            >
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <span className="text-[#162155] font-black text-xs truncate" dir="ltr">{order._id}</span>
                <span className="text-slate-400 text-[10px] font-bold truncate">{order.deliveryAddressText}</span>
              </div>
              <div className="shrink-0">
                <span className="bg-[#DCFCE7] text-[#16A34A] px-2 py-1 rounded-full text-[9px] font-bold whitespace-nowrap">
                  {t(orderStatusLabelKey(order.status))}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
