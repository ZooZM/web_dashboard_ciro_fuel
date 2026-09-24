import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { AddTruckForm } from './AddTruckForm';
import { AddTankForm } from './AddTankForm';
import { PairCardDialog } from './PairCardDialog';
import { useTrucksList, useWithdrawTruck, useRestoreTruck } from '@/transport_company/trucks/hooks/useTrucks';
import { useTanksList, useWithdrawTank, useRestoreTank } from '@/transport_company/trucks/hooks/useTanks';
import { Button } from '@/components/ui/button';

/**
 * Feature 009 T083/FR-039/FR-040/FR-042/FR-053: wired to `GET /trucks` and `GET /tanks` —
 * every fabricated row and stat this screen used to show (SC-005) is gone. Per-truck
 * pairing/credential state is now real (FR-053): an unverifiable vehicle is visible here
 * before it can be assigned, not discovered at the gate.
 */
export function TrucksAndTanksPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'trucks' | 'tanks'>('trucks');
  const [isAdding, setIsAdding] = useState(false);

  const trucksQuery = useTrucksList();
  const tanksQuery = useTanksList();
  const withdrawTruck = useWithdrawTruck();
  const restoreTruck = useRestoreTruck();
  const withdrawTank = useWithdrawTank();
  const restoreTank = useRestoreTank();

  const trucks = trucksQuery.data?.items ?? [];
  const tanks = tanksQuery.data?.items ?? [];
  const totalCapacity = tanks.reduce((sum, tank) => sum + tank.maxCapacityLiters, 0);

  const entityName = activeTab === 'tanks' ? t('trucks.tankEntity') : t('trucks.truckEntity');

  return (
    <div className="p-6 w-full h-full space-y-6 border border-[#E7E9EF] rounded-2xl" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-blue-900 mb-2">{t('trucks.title')}</h1>
        <p className="text-sm font-bold text-slate-400">{t('trucks.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-start gap-4">
          <div className="text-right flex-1 pl-4">
            <div className="text-xs font-bold text-slate-400 mb-1">{t('trucks.totalTrucks')}</div>
            <div className="text-xl font-black text-slate-900">{trucks.length}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="text-right flex-1 pl-4">
            <div className="text-xs font-bold text-slate-400 mb-1">{t('trucks.totalTanks')}</div>
            <div className="text-xl font-black text-slate-900">{tanks.length}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-start gap-4">
          <div className="text-right flex-1 pl-4">
            <div className="text-xs font-bold text-slate-400 mb-1">{t('trucks.totalCapacity')}</div>
            <div className="text-xl font-black text-slate-900" dir="ltr">
              {totalCapacity.toLocaleString()} {t('trucks.liters')}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 p-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex bg-slate-50 rounded-xl w-full md:w-auto shrink-0">
            <button
              onClick={() => setActiveTab('trucks')}
              className={cn(
                'px-8 py-2 rounded-lg text-sm font-bold transition-colors w-1/2 md:w-auto',
                activeTab === 'trucks' ? 'bg-blue-100/50 border-b-2 border-blue-700 text-blue-700' : 'text-slate-500 hover:text-slate-700',
              )}
            >
              {t('trucks.tabTrucks')}
            </button>
            <button
              onClick={() => setActiveTab('tanks')}
              className={cn(
                'px-8 py-2 rounded-lg text-sm font-bold transition-colors w-1/2 md:w-auto',
                activeTab === 'tanks' ? 'bg-blue-100/50 border-b-2 border-blue-700 text-blue-700' : 'text-slate-500 hover:text-slate-700',
              )}
            >
              {t('trucks.tabTanks')}
            </button>
          </div>
        </div>

        <div className="p-6">
          {!isAdding ? (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">{t('trucks.addEntity', { entity: entityName })}</h2>
              <Button onClick={() => setIsAdding(true)}>{t('trucks.addEntity', { entity: entityName })}</Button>
            </div>
          ) : (
            <div className="border border-dashed border-slate-300 bg-slate-50/30 rounded-2xl p-6 mb-6">
              {activeTab === 'trucks' ? (
                <AddTruckForm onCancel={() => setIsAdding(false)} entityName={entityName} />
              ) : (
                <AddTankForm onCancel={() => setIsAdding(false)} entityName={entityName} />
              )}
            </div>
          )}

          <div className="space-y-4 mt-6">
            {activeTab === 'trucks' &&
              (trucksQuery.isLoading ? (
                <p className="text-center text-sm text-slate-400 py-8">{t('common.loading')}</p>
              ) : trucksQuery.isError ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <p className="text-sm text-red-500">{t('errors.generic')}</p>
                  <button onClick={() => trucksQuery.refetch()} className="text-sm font-bold text-blue-600 hover:underline">
                    {t('common.retry')}
                  </button>
                </div>
              ) : trucks.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-8">{t('trucks.noTrucks')}</p>
              ) : (
                trucks.map((truck) => (
                  <div
                    key={truck.id}
                    className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-200 transition-colors bg-white"
                  >
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-bold text-slate-900" dir="ltr">{truck.plateNumber}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={cn(
                            'text-[10px] font-bold px-2 py-0.5 rounded-md',
                            truck.hasCard ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                          )}
                        >
                          {truck.hasCard ? t('trucks.pairing.cardPaired') : t('trucks.pairing.noCard')}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] font-bold px-2 py-0.5 rounded-md',
                            truck.hasCode ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500',
                          )}
                        >
                          {truck.hasCode ? t('trucks.pairing.codeActive') : t('trucks.pairing.noCode')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-md text-xs font-bold shrink-0',
                          truck.activeOrderId
                            ? 'bg-blue-100/50 text-blue-600'
                            : truck.isActive
                              ? 'bg-green-100/50 text-green-600'
                              : 'bg-gray-100 text-gray-500',
                        )}
                      >
                        {truck.activeOrderId
                          ? t('trucks.statusCommitted')
                          : truck.isActive
                            ? t('trucks.statusAvailable')
                            : t('trucks.statusWithdrawn')}
                      </span>
                      <PairCardDialog truck={truck} />
                      {truck.isActive ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={Boolean(truck.activeOrderId) || withdrawTruck.isPending}
                          onClick={() => withdrawTruck.mutate(truck.id)}
                        >
                          {t('trucks.withdraw')}
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => restoreTruck.mutate(truck.id)} disabled={restoreTruck.isPending}>
                          {t('trucks.restore')}
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ))}

            {activeTab === 'tanks' &&
              (tanksQuery.isLoading ? (
                <p className="text-center text-sm text-slate-400 py-8">{t('common.loading')}</p>
              ) : tanksQuery.isError ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <p className="text-sm text-red-500">{t('errors.generic')}</p>
                  <button onClick={() => tanksQuery.refetch()} className="text-sm font-bold text-blue-600 hover:underline">
                    {t('common.retry')}
                  </button>
                </div>
              ) : tanks.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-8">{t('trucks.noTanks')}</p>
              ) : (
                tanks.map((tank) => (
                  <div
                    key={tank.id}
                    className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-200 transition-colors bg-white"
                  >
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-bold text-slate-900" dir="ltr">{tank.code}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {tank.material === 'ALUMINIUM' ? t('trucks.materialAluminium') : t('trucks.materialIron')}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md" dir="ltr">
                          {tank.maxCapacityLiters.toLocaleString()} {t('trucks.liters')}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {tank.fuelTypes.join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-md text-xs font-bold shrink-0',
                          tank.activeOrderId
                            ? 'bg-blue-100/50 text-blue-600'
                            : tank.isActive
                              ? 'bg-green-100/50 text-green-600'
                              : 'bg-gray-100 text-gray-500',
                        )}
                      >
                        {tank.activeOrderId
                          ? t('trucks.statusCommitted')
                          : tank.isActive
                            ? t('trucks.statusAvailable')
                            : t('trucks.statusWithdrawn')}
                      </span>
                      {tank.isActive ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={Boolean(tank.activeOrderId) || withdrawTank.isPending}
                          onClick={() => withdrawTank.mutate(tank.id)}
                        >
                          {t('trucks.withdraw')}
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => restoreTank.mutate(tank.id)} disabled={restoreTank.isPending}>
                          {t('trucks.restore')}
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
