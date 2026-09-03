import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { NewFuelRequestForm } from './NewFuelRequestForm';
import { FuelExchangeStats } from './FuelExchangeStats';
import { FuelExchangeListItem } from './FuelExchangeListItem';
import { useExchangeRequestsList } from '@/petrol_company/fuel_exchange/hooks/useFuelExchange';
import { ExchangeRequestState } from '@/constants/fuel-company';
import type { ExchangeDirection } from '@/petrol_company/fuel_exchange/api/fuel-exchange.api';

type FilterValue = 'all' | 'outgoing' | 'incoming';
const FILTERS: FilterValue[] = ['all', 'outgoing', 'incoming'];

// Feature 013 T230/T231/FR-078/FR-079/FR-084: wired to `GET /fuel-exchange/requests`,
// cursor-paged. Every fabricated stat/request row is gone — the three stat cards below
// are counted from the CURRENTLY LOADED page of incoming/outgoing requests (real data,
// not a platform-wide total the backend has no aggregate endpoint for) rather than
// invented figures.
export function FuelExchangePage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);

  const direction: ExchangeDirection = activeFilter;
  const { data, isLoading, isError, refetch } = useExchangeRequestsList(direction, cursor);
  const { data: incomingForStats } = useExchangeRequestsList('incoming');
  const { data: outgoingForStats } = useExchangeRequestsList('outgoing');

  const items = data?.items ?? [];
  const incomingAwaiting = (incomingForStats?.items ?? []).filter((r) => r.state === ExchangeRequestState.AWAITING_RESPONSE).length;
  const outgoingAwaiting = (outgoingForStats?.items ?? []).filter((r) => r.state === ExchangeRequestState.AWAITING_RESPONSE).length;
  const acceptedRecently =
    (incomingForStats?.items ?? []).filter((r) => r.state === ExchangeRequestState.ACCEPTED).length +
    (outgoingForStats?.items ?? []).filter((r) => r.state === ExchangeRequestState.ACCEPTED).length;

  const STAT_CARDS = [
    {
      title: t('fuelExchange.incomingAwaiting'),
      value: String(incomingAwaiting),
      icon: '/petrolCompany/requests/arrowUp.svg',
      iconBgClass: 'bg-blue-50',
      valueColor: 'text-slate-900',
      titleColor: 'text-slate-500',
    },
    {
      title: t('fuelExchange.outgoingAwaiting'),
      value: String(outgoingAwaiting),
      icon: '/petrolCompany/requests/arrowDown.svg',
      iconBgClass: 'bg-orange-50',
      valueColor: 'text-slate-900',
      titleColor: 'text-slate-500',
    },
    {
      title: t('fuelExchange.acceptedRecently'),
      value: String(acceptedRecently),
      icon: '/petrolCompany/requests/rightCheck.svg',
      iconBgClass: 'bg-green-50',
      valueColor: 'text-slate-900',
      titleColor: 'text-slate-500',
    },
  ];

  function onFilterChange(filter: FilterValue): void {
    setActiveFilter(filter);
    setCursor(undefined);
  }

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] min-h-full font-sans border border-[#E7E9EF] rounded-2xl" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col items-start text-right">
          <h1 className="text-2xl font-black text-slate-900">{t('fuelExchange.title')}</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">{t('fuelExchange.subtitle')}</p>
        </div>
        <button
          onClick={() => setIsCreatingRequest(true)}
          className="flex justify-center items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shrink-0"
        >
          <img src="/petrolCompany/requests/plus.svg" alt="" className="w-4 h-4" />
          {t('fuelExchange.newRequest')}
        </button>
      </div>

      {isCreatingRequest && (
        <NewFuelRequestForm onCancel={() => setIsCreatingRequest(false)} onCreated={() => setIsCreatingRequest(false)} />
      )}

      {!isCreatingRequest && <FuelExchangeStats cards={STAT_CARDS} />}

      {!isCreatingRequest && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-6">
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white w-fit mb-6">
            {FILTERS.map((filter, idx) => {
              const isActive = activeFilter === filter;
              const label =
                filter === 'all' ? t('fuelExchange.filterAll') : filter === 'outgoing' ? t('fuelExchange.filterOutgoing') : t('fuelExchange.filterIncoming');
              return (
                <button
                  key={filter}
                  onClick={() => onFilterChange(filter)}
                  className={cn(
                    'relative px-8 py-2.5 text-sm font-bold transition-colors whitespace-nowrap cursor-pointer',
                    isActive ? 'text-blue-600' : 'text-slate-500 hover:bg-slate-50',
                    idx !== FILTERS.length - 1 && 'border-l border-slate-200',
                  )}
                >
                  {isActive && (
                    <motion.div layoutId="fuel-exchange-active-tab" className="absolute inset-0 bg-blue-50" transition={{ type: 'spring', stiffness: 300, damping: 25 }} />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <p className="text-center text-sm text-slate-400 py-12">{t('common.loading')}</p>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <p className="text-sm text-red-500">{t('fuelExchange.loadError')}</p>
              <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
                {t('common.retry')}
              </button>
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-12">{t('fuelExchange.empty')}</p>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {items.map((req) => (
                  <FuelExchangeListItem key={req._id} request={req} />
                ))}
              </div>
              {data?.nextCursor && (
                <div className="flex justify-center py-4">
                  <button onClick={() => setCursor(data.nextCursor!)} className="text-sm font-bold text-blue-600 hover:underline">
                    {t('common.loadMore')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
