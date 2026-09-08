import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { NewOfferForm } from './NewOfferForm';
import { FuelExchangeStats } from './FuelExchangeStats';
import { FuelExchangeListItem } from './FuelExchangeListItem';
import { useOffersList, useOfferSummary } from '@/petrol_company/fuel_exchange/hooks/useFuelExchange';
import type { ExchangeDirection } from '@/petrol_company/fuel_exchange/api/fuel-exchange.api';

type FilterValue = 'all' | 'outgoing' | 'incoming';
const FILTERS: FilterValue[] = ['all', 'outgoing', 'incoming'];

/**
 * spec 016 (broadcast fuel exchange offers) T043 — rebuilt to the approved layout: the
 * offer form is ALWAYS visible (FR-032), never gated behind a "new request" button that
 * this feature deletes outright, and the three stat cards are fed by
 * `GET /fuel-exchange/offers/summary` (research R9) — real counts over the WHOLE scoped
 * set, never the previous "count of whatever happens to be on the loaded page".
 */
export function FuelExchangePage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const direction: ExchangeDirection = activeFilter;
  const { data, isLoading, isError, refetch } = useOffersList(direction, undefined, cursor);
  const { data: summary } = useOfferSummary();

  const items = data?.items ?? [];

  const STAT_CARDS = [
    {
      title: t('fuelExchange.incomingAwaiting'),
      value: String(summary?.incomingAwaitingAnswer ?? 0),
      icon: '/petrolCompany/requests/arrowUp.svg',
      iconBgClass: 'bg-blue-50',
      valueColor: 'text-slate-900',
      titleColor: 'text-slate-500',
    },
    {
      title: t('fuelExchange.outgoingOpen'),
      value: String(summary?.outgoingOpen ?? 0),
      icon: '/petrolCompany/requests/arrowDown.svg',
      iconBgClass: 'bg-orange-50',
      valueColor: 'text-slate-900',
      titleColor: 'text-slate-500',
    },
    {
      title: t('fuelExchange.awardedThisMonth'),
      value: String(summary?.awardedThisMonth ?? 0),
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
      <div className="flex flex-col items-start text-right mb-6">
        <h1 className="text-2xl font-black text-slate-900">{t('fuelExchange.title')}</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">{t('fuelExchange.subtitle')}</p>
      </div>

      <NewOfferForm onCreated={() => void refetch()} />

      <FuelExchangeStats cards={STAT_CARDS} />

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
            <button onClick={() => void refetch()} className="text-sm font-bold text-blue-600 hover:underline">
              {t('common.retry')}
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('fuelExchange.empty')}</p>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {items.map((offer) => (
                <FuelExchangeListItem key={offer._id} offer={offer} />
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
    </div>
  );
}
