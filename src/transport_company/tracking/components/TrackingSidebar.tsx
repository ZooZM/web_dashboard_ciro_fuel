import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTracking } from './TrackingContext';
import { FuelIcon } from './FuelIcon';
import { OrderStatus, fuelTypeLabelKey, orderStatusLabelKey } from '@/constants/order-status';

type TabValue = 'ALL' | typeof OrderStatus.IN_TRANSIT | typeof OrderStatus.UNLOADING;

// The design's tabs were "on the way to load" / "on the way to deliver". Only IN_TRANSIT and
// UNLOADING are trackable (the platform's own `order:watch` rule — LOADING is not), so a
// "to load" tab could only ever be empty here; the two tabs are the two trackable stages.
const TABS: TabValue[] = ['ALL', OrderStatus.IN_TRANSIT, OrderStatus.UNLOADING];

/**
 * Feature 009 T053/SC-005: real in-transit/unloading deliveries — six identical fabricated
 * rows are gone. Selecting a row switches the live connection to that delivery.
 *
 * Search and tabs filter the already-loaded trackable list client-side; it is every delivery
 * this company currently has on the road, so nothing is hidden by doing it here.
 */
export function TrackingSidebar() {
  const { t } = useTranslation();
  const { trackableOrders, isLoading, isError, refetch, selectedOrderId, selectOrder } = useTracking();
  const [activeTab, setActiveTab] = useState<TabValue>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const query = searchQuery.trim().toLowerCase();
  const filteredOrders = trackableOrders.filter(
    (order) =>
      (activeTab === 'ALL' || order.status === activeTab) &&
      (!query ||
        order._id.toLowerCase().includes(query) ||
        order.deliveryAddressText?.toLowerCase().includes(query) ||
        order.station?.name?.toLowerCase().includes(query)),
  );

  return (
    <div className="w-full lg:w-[380px] shrink-0 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100">
        <div className="relative">
          <input
            type="text"
            placeholder={t('tracking.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 placeholder:text-slate-400"
          />
          <img src="/transportCompany/trackingPage/search.svg" alt="" className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="flex border-b border-slate-200 divide-x divide-x-reverse divide-slate-200">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-4 text-[11px] font-bold transition-colors relative text-center',
                isActive ? 'text-[#162155] bg-[#EEF2FF]' : 'text-slate-500 hover:bg-slate-50',
              )}
            >
              <span className="relative z-10">{tab === 'ALL' ? t('common.all') : t(orderStatusLabelKey(tab))}</span>
              {isActive && (
                <motion.div
                  layoutId="tracking-sidebar-tab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

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
        ) : filteredOrders.length === 0 ? (
          <p className="text-center text-sm font-bold text-slate-400 py-10">{t('tracking.noMatch')}</p>
        ) : (
          filteredOrders.map((order) => (
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
                <span className="text-slate-400 text-[10px] font-bold truncate">
                  {order.station?.name ?? order.deliveryAddressText}
                </span>
              </div>

              <div className="flex items-center gap-3 px-2 border-r border-l border-slate-100 shrink-0">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-slate-400 text-[9px] font-bold">{t('orders.quantity')}</span>
                  <span className="text-slate-800 font-black text-[11px]" dir="ltr">{order.quantityLiters.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FuelIcon type={order.fuelType} className="w-5 h-5 object-contain" />
                  <span className="text-[#162155] font-black text-xs">{t(fuelTypeLabelKey(order.fuelType))}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-center min-w-[90px]">
                <span
                  className={cn(
                    'px-2 py-1 rounded-full text-[9px] font-bold whitespace-nowrap w-full text-center',
                    order.status === OrderStatus.UNLOADING ? 'bg-[#FFEDD5] text-[#EA580C]' : 'bg-[#DCFCE7] text-[#16A34A]',
                  )}
                >
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
