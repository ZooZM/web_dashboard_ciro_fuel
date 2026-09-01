import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAssignment } from './AssignmentContext';
import type { TankMaterial } from '@/transport_company/trucks/types';
import { DriverEligibility } from '@/constants/order-status';
import { cn } from '@/lib/utils';

/**
 * Feature 009 T034-T037/FR-002/FR-004: real candidate drivers (platform-ranked — never
 * re-sorted here, FR-002), the company's own trucks and tanks. A trailer whose capacity or
 * grade cannot serve the order is shown, not hidden — the guard names the reason when
 * chosen (FR-005), it does not pre-filter the picker silently.
 *
 * Feature 010 T018/FR-001/FR-002/FR-004: the list now includes every driver, not an
 * eligible-only subset — `ELIGIBLE` renders exactly as before, `OFFLINE` is muted+badged
 * but still selectable (leads to the reason field, FR-008), `BUSY`/`INACTIVE` are muted+
 * badged with **no click target at all** (FR-007 correction: neither is ever assignable).
 */
function eligibilityBadge(
  eligibility: DriverEligibility,
  lastSeenAt: string | null,
  t: (key: string, opts?: Record<string, unknown>) => string,
): { label: string; className: string } | null {
  switch (eligibility) {
    case DriverEligibility.OFFLINE:
      return {
        label: lastSeenAt ? t('assign.eligibility.offlineSince', { time: new Date(lastSeenAt).toLocaleString() }) : t('assign.eligibility.neverOnline'),
        className: 'bg-slate-100 text-slate-500',
      };
    case DriverEligibility.BUSY:
      return { label: t('assign.eligibility.busy'), className: 'bg-amber-50 text-amber-600' };
    case DriverEligibility.INACTIVE:
      return { label: t('assign.eligibility.inactive'), className: 'bg-slate-100 text-slate-400' };
    default:
      return null;
  }
}
export function AssignLists() {
  const { t } = useTranslation();
  const [tankFilter, setTankFilter] = useState<TankMaterial | 'all'>('all');
  const {
    candidates,
    candidatesLoading,
    candidatesError,
    refetchCandidates,
    trucks,
    tanks,
    selectedDriverId,
    selectedTruckId,
    selectedTankId,
    selectDriver,
    selectTruck,
    selectTank,
  } = useAssignment();

  const filteredTanks = tankFilter === 'all' ? tanks : tanks.filter((tank) => tank.material === tankFilter);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Drivers */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[#162155] font-black text-lg">{t('drivers.title')}</h3>
          <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-full text-xs font-bold">
            {candidates.length}
          </span>
        </div>

        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pl-2 custom-scrollbar">
          {candidatesLoading ? (
            <p className="text-center text-sm text-slate-400 py-8">{t('common.loading')}</p>
          ) : candidatesError ? (
            <div className="flex flex-col items-center gap-2 py-8">
              <p className="text-sm text-red-500">{t('errors.generic')}</p>
              <button onClick={refetchCandidates} className="text-sm font-bold text-blue-600 hover:underline">
                {t('common.retry')}
              </button>
            </div>
          ) : candidates.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-8">{t('assign.noDriversRegistered')}</p>
          ) : (
            candidates.map((candidate) => {
              // FR-007 correction: BUSY/INACTIVE are shown but never assignable — no
              // click target at all, distinct from OFFLINE which leads to the reason
              // field, and from ELIGIBLE which needs no badge at all.
              const notAssignable =
                candidate.eligibility === DriverEligibility.BUSY ||
                candidate.eligibility === DriverEligibility.INACTIVE;
              const badge = eligibilityBadge(candidate.eligibility, candidate.lastSeenAt, t);

              return (
                <label
                  key={candidate._id}
                  className={cn(
                    'flex items-center p-3 rounded-xl border transition-colors border-slate-200',
                    notAssignable
                      ? 'opacity-60 cursor-not-allowed'
                      : 'cursor-pointer hover:bg-slate-50',
                  )}
                >
                  <div className="flex items-center gap-3 w-full">
                    <input
                      type="radio"
                      name="driver"
                      checked={selectedDriverId === candidate._id}
                      disabled={notAssignable}
                      onChange={() => selectDriver(candidate)}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 shrink-0 disabled:cursor-not-allowed"
                    />
                    <div className="flex flex-col items-start gap-1 flex-1">
                      <span className="text-[#162155] font-black text-sm">{candidate.fullName}</span>
                      <span className="text-slate-500 text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-md" dir="ltr">
                        {candidate.phone}
                      </span>
                      {badge && (
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md', badge.className)}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                    {candidate.distanceMeters != null && (
                      <span className="text-slate-400 text-[10px] font-bold shrink-0">
                        {(candidate.distanceMeters / 1000).toFixed(1)} km
                      </span>
                    )}
                  </div>
                </label>
              );
            })
          )}
        </div>
      </div>

      {/* Trucks */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[#162155] font-black text-lg">{t('trucks.truckEntity')}</h3>
          <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-full text-xs font-bold">{trucks.length}</span>
        </div>

        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pl-2 custom-scrollbar">
          {trucks.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-8">{t('trucks.noTrucks')}</p>
          ) : (
            trucks.map((truck) => (
              <label
                key={truck.id}
                className="flex items-center p-3 rounded-xl border cursor-pointer transition-colors hover:bg-slate-50 border-slate-200"
              >
                <div className="flex items-center gap-3 w-full">
                  <input
                    type="radio"
                    name="truck"
                    checked={selectedTruckId === truck.id}
                    onChange={() => selectTruck(truck.id)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 shrink-0"
                  />
                  <div className="flex flex-col items-start gap-1 flex-1">
                    <span className="text-[#162155] font-black text-sm" dir="ltr">{truck.plateNumber}</span>
                    {!truck.hasCard && (
                      <span className="text-red-600 text-[10px] font-bold bg-red-50 px-2 py-0.5 rounded-md">
                        {t('trucks.pairing.noCard')}
                      </span>
                    )}
                  </div>
                </div>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Tanks */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[#162155] font-black text-lg">{t('trucks.tankEntity')}</h3>
          <div className="flex items-center bg-slate-100 p-1 rounded-full gap-1">
            <button
              onClick={() => setTankFilter(tankFilter === 'ALUMINIUM' ? 'all' : 'ALUMINIUM')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${tankFilter === 'ALUMINIUM' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
            >
              {t('trucks.materialAluminium')}
            </button>
            <button
              onClick={() => setTankFilter(tankFilter === 'IRON' ? 'all' : 'IRON')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${tankFilter === 'IRON' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
            >
              {t('trucks.materialIron')}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pl-2 custom-scrollbar">
          {filteredTanks.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-8">{t('trucks.noTanks')}</p>
          ) : (
            filteredTanks.map((tank) => (
              <label
                key={tank.id}
                className="flex items-center p-3 rounded-xl border cursor-pointer transition-colors hover:bg-slate-50 border-slate-200"
              >
                <div className="flex items-center gap-3 w-full">
                  <input
                    type="radio"
                    name="tank"
                    checked={selectedTankId === tank.id}
                    onChange={() => selectTank(tank.id)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 shrink-0"
                  />
                  <div className="flex flex-col items-start gap-1 flex-1">
                    <span className="text-[#162155] font-black text-sm" dir="ltr">{tank.code}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-md" dir="ltr">
                        {tank.maxCapacityLiters.toLocaleString()} {t('trucks.liters')}
                      </span>
                      <span className="text-slate-500 text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                        {tank.fuelTypes.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </label>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
