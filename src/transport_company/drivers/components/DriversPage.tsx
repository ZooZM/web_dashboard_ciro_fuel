import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DriversStats } from './DriversStats';
import { DesktopDriversTable } from './DesktopDriversTable';
import { MobileDriversList } from './MobileDriversList';
import { useDriversList } from '@/transport_company/drivers/hooks/useDrivers';

type FilterTab = 'all' | 'active' | 'inactive';

/**
 * Feature 009 T089/FR-039/FR-043/SC-005: wired to `GET /users?role=DRIVER` — the eight
 * fabricated identical rows this screen showed are gone. A suspended driver stops appearing
 * as an assignment candidate at the platform level (dispatch.service.ts's `isActive: true`
 * query filter) — this list simply reflects that same real state.
 */
export function DriversPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const navigate = useNavigate();

  const isActiveFilter = activeTab === 'all' ? undefined : activeTab === 'active';
  const { data: drivers, isLoading, isError, refetch } = useDriversList(isActiveFilter);

  const FILTERS: { id: FilterTab; label: string }[] = [
    { id: 'all', label: t('common.all') },
    { id: 'active', label: t('drivers.active') },
    { id: 'inactive', label: t('drivers.inactive') },
  ];

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col gap-1 text-right">
          <h1 className="text-[#162155] font-black text-2xl">{t('drivers.title')}</h1>
        </div>

        <button
          onClick={() => navigate('/transport/drivers/add')}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          {t('drivers.add')}
        </button>
      </div>

      <div className="mb-6">
        <DriversStats />
      </div>

      <div className="flex mb-6">
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden w-full sm:w-fit bg-white divide-x divide-x-reverse divide-slate-200 shadow-sm">
          {FILTERS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex-1 sm:flex-none px-4 sm:px-12 py-3 text-sm font-bold transition-colors whitespace-nowrap cursor-pointer text-center',
                  isActive ? 'text-[#162155]' : 'text-slate-500 hover:bg-slate-50',
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-driver-tab"
                    className="absolute inset-0 bg-[#EEF2FF] border-b-2 border-blue-600"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
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
        ) : !drivers || drivers.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('drivers.empty')}</p>
        ) : (
          <>
            <DesktopDriversTable drivers={drivers} />
            <div className="px-4 pb-4 lg:px-0 lg:pb-0">
              <MobileDriversList drivers={drivers} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
