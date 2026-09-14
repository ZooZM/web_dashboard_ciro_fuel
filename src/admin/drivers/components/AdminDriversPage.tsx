import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDriverRoster } from '@/admin/drivers/hooks/useDriverRoster';
import type { DriverRosterRow, DutyState } from '@/admin/drivers/api/driver-roster.api';

/**
 * spec 017 (operator dashboard) US5 — every driver on the platform, their
 * employer, their most recently operated truck and their duty state.
 *
 * **And nothing about where that person has been.**
 *
 * `capacity`, `tripsMonth` and `lastShipment` are REMOVED (FR-044, FR-078, and
 * recorded in this feature's Removals table). `capacity` is a TANK attribute
 * with no driver-level source at all; the other two are per-driver trip
 * aggregates this feature is explicitly forbidden to compute — the roster is
 * scoped as identification, not surveillance, the same boundary feature 011
 * drew when it embedded stop events on `Order` so a per-driver stop history
 * could not be queried.
 *
 * **This screen renders its own table rather than the transport company's
 * shared `DesktopDriversTable`/`MobileDriversList`/`DriversStats`** (a
 * deliberate departure from T090's column-configuration approach, recorded in
 * tasks.md). Two reasons: the row shape is genuinely different —
 * `DriverRosterRow` carries seven fields and the transport driver type carries
 * the excluded ones — and a dedicated component means the forbidden columns are
 * *unreachable* here rather than merely switched off by a flag a later change
 * could flip. It also leaves the transport company's own screen untouched,
 * which FR-075 requires.
 */

const DUTY_STATE_TONE: Record<DutyState, string> = {
  ON_DUTY: 'bg-green-500/15 text-green-700',
  OFF_DUTY: 'bg-gray-500/15 text-gray-700',
  // Visibly distinct from OFF_DUTY: "has never connected" is a different fact
  // from "is not working right now", and the whole reason `DutyState` is
  // three-valued rather than a boolean (FR-040).
  UNKNOWN: 'bg-amber-500/20 text-amber-800 border border-dashed border-amber-400',
};

type Tab = 'ALL' | 'ACTIVE' | 'INACTIVE' | DutyState;

const TABS: Tab[] = ['ALL', 'ACTIVE', 'INACTIVE', 'ON_DUTY', 'OFF_DUTY', 'UNKNOWN'];

function paramsForTab(tab: Tab) {
  switch (tab) {
    case 'ALL':
      return {};
    case 'ACTIVE':
      return { isActive: true };
    case 'INACTIVE':
      return { isActive: false };
    default:
      return { dutyState: tab };
  }
}

export function AdminDriversPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('ALL');
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const { data, isLoading, isError, refetch } = useDriverRoster({
    ...paramsForTab(tab),
    ...(cursor ? { cursor } : {}),
  });
  const drivers = data?.items ?? [];

  return (
    <div
      className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-[calc(100vh-6rem)] font-sans"
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex flex-col gap-1 text-right">
          <h1 className="text-[#162155] font-black text-2xl">{t('driverRoster.title')}</h1>
          <p className="text-slate-500 font-bold text-sm">{t('driverRoster.subtitle')}</p>
        </div>
      </div>

      <div className="bg-white border border-[#E7E9EF] rounded-2xl shadow-sm overflow-hidden pt-4 pb-0 flex flex-col">
        {/* Filters — mapped to the platform's own `isActive` / `dutyState`. */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4 px-4 w-full">
          <div className="flex items-center border border-[#E7E9EF] rounded-xl overflow-hidden w-full xl:w-fit bg-[#F8FAFC] divide-x divide-x-reverse divide-[#E7E9EF] shadow-sm shrink-0">
            {TABS.map((option) => {
              const isActive = tab === option;
              return (
                <button
                  key={option}
                  onClick={() => {
                    setTab(option);
                    setCursor(undefined);
                  }}
                  className={cn(
                    'relative flex-1 xl:flex-none px-4 lg:px-6 py-2.5 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer text-center h-[40px]',
                    isActive ? 'text-[#162155]' : 'text-slate-500 hover:text-slate-700',
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-admin-driver-tab"
                      className="absolute inset-0 bg-white border-b-2 border-blue-600"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{t(`driverRoster.tabs.${option}`)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FR-076: loading, empty and failed each render distinctly. */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <p className="font-medium text-sm">{t('driverRoster.loading')}</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="font-bold text-sm text-red-700">{t('driverRoster.failed')}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {!isLoading && !isError && drivers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <p className="font-medium text-sm">{t('driverRoster.empty')}</p>
          </div>
        )}

        {!isLoading && !isError && drivers.length > 0 && (
          <>
            <RosterTable drivers={drivers} onOpen={(id) => navigate(`/admin/drivers/${id}`)} />
            <div className="px-4 pb-4 lg:hidden">
              <RosterCards drivers={drivers} onOpen={(id) => navigate(`/admin/drivers/${id}`)} />
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-4 border-t border-slate-100">
              <button
                type="button"
                disabled={!cursor}
                onClick={() => setCursor(undefined)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 disabled:opacity-40"
              >
                {t('common.first')}
              </button>
              <button
                type="button"
                disabled={!data?.nextCursor}
                onClick={() => setCursor(data?.nextCursor ?? undefined)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-bold disabled:opacity-40"
              >
                {t('common.next')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RosterTable({
  drivers,
  onOpen,
}: {
  drivers: DriverRosterRow[];
  onOpen: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full text-right">
        <thead>
          <tr className="bg-[#f8f9fa]">
            <th className="font-bold text-slate-700 text-[12px] py-3 pr-4 pl-2">
              {t('drivers.name')}
            </th>
            <th className="font-bold text-slate-700 text-[12px] py-3 px-2">{t('drivers.phone')}</th>
            <th className="font-bold text-slate-700 text-[12px] py-3 px-2">
              {t('driverRoster.employer')}
            </th>
            <th className="font-bold text-slate-700 text-[12px] py-3 px-2">
              {t('driverRoster.lastTruck')}
            </th>
            <th className="font-bold text-slate-700 text-[12px] py-3 px-2 text-center">
              {t('driverRoster.dutyState')}
            </th>
            <th className="font-bold text-slate-700 text-[12px] py-3 pl-4 pr-2 text-center">
              {t('drivers.active')}
            </th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr
              key={driver.driverId}
              onClick={() => onOpen(driver.driverId)}
              className="hover:bg-slate-50 border-b border-slate-100 last:border-0 cursor-pointer transition-colors"
            >
              <td className="py-3 pr-4 pl-2 text-[12px] font-bold text-slate-900">
                {driver.fullName}
              </td>
              <td className="py-3 px-2 text-[12px] text-slate-600 font-mono">{driver.phone}</td>
              <td className="py-3 px-2 text-[12px] text-slate-700 font-bold">
                {driver.transportCompany?.name ?? '—'}
              </td>
              <td className="py-3 px-2 text-[12px]">
                <LastTruck truck={driver.lastOperatedTruck} />
              </td>
              <td className="py-3 px-2 text-center">
                <DutyBadge state={driver.dutyState} />
              </td>
              <td className="py-3 pl-4 pr-2 text-center text-[12px] font-bold">
                {driver.isActive ? t('common.yes') : t('common.no')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RosterCards({
  drivers,
  onOpen,
}: {
  drivers: DriverRosterRow[];
  onOpen: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="lg:hidden flex flex-col gap-3">
      {drivers.map((driver) => (
        <div
          key={driver.driverId}
          onClick={() => onOpen(driver.driverId)}
          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-2 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">{driver.fullName}</span>
            <DutyBadge state={driver.dutyState} />
          </div>
          <span className="text-[12px] text-slate-600 font-mono">{driver.phone}</span>
          <span className="text-[12px] text-slate-700">
            {t('driverRoster.employer')}: {driver.transportCompany?.name ?? '—'}
          </span>
          <span className="text-[12px]">
            {t('driverRoster.lastTruck')}: <LastTruck truck={driver.lastOperatedTruck} />
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * T091/FR-039b — `null` renders as an explicit "never driven", distinct from a
 * blank cell or a placeholder dash.
 *
 * The distinction is the requirement: a driver who has genuinely never been
 * assigned a truck and a cell that failed to populate must not look the same,
 * and a bare "—" is exactly what both would look like.
 */
function LastTruck({ truck }: { truck: DriverRosterRow['lastOperatedTruck'] }) {
  const { t } = useTranslation();
  if (!truck) {
    return (
      <span className="text-[11px] font-bold text-slate-400 italic">
        {t('driverRoster.neverDriven')}
      </span>
    );
  }
  return <span className="font-bold text-slate-800 font-mono">{truck.plateNumber}</span>;
}

function DutyBadge({ state }: { state: DutyState }) {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold',
        DUTY_STATE_TONE[state],
      )}
    >
      {t(`dutyState.${state}`)}
    </span>
  );
}
