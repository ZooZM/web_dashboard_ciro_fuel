import { useTranslation } from 'react-i18next';
import { useDriversList } from '@/transport_company/drivers/hooks/useDrivers';

/**
 * Feature 009 T089/SC-005: replaces four fabricated counts (20 active / 1 inactive / 28
 * total / 5 available were hardcoded, unrelated to any real fleet) with real ones derived
 * from the actual drivers list. "On duty" (isOnline) is the one figure this list alone
 * cannot decide reliably at scale — the dashboard home's summary endpoint is the correct
 * source for that; this card sticks to what `GET /users?role=DRIVER` itself proves: active
 * vs inactive vs total.
 */
export function DriversStats() {
  const { t } = useTranslation();
  const { data: drivers, isLoading, isError } = useDriversList();
  const unavailable = isLoading || isError;

  const active = drivers?.filter((d) => d.isActive).length ?? 0;
  const inactive = drivers?.filter((d) => !d.isActive).length ?? 0;
  const total = drivers?.length ?? 0;

  const stats = [
    { id: 1, title: t('drivers.active'), value: active, valueColor: 'text-[#16A34A]' },
    { id: 2, title: t('drivers.inactive'), value: inactive, valueColor: 'text-slate-800' },
    { id: 3, title: t('drivers.title'), value: total, valueColor: 'text-[#9333EA]' },
  ];

  return (
    <div className="flex flex-row items-center gap-4 w-full overflow-x-auto pb-2 custom-scrollbar">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-start gap-4 min-w-[180px] flex-1 shadow-sm"
        >
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-500 font-bold text-sm">{stat.title}</span>
            <span className={`font-black text-xl ${stat.valueColor}`}>{unavailable ? '—' : stat.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
