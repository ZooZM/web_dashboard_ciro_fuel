import { useTranslation } from 'react-i18next';
import { useDriversList } from '@/transport_company/drivers/hooks/useDrivers';

/**
 * Feature 009 T089/SC-005: every count is derived from the real drivers list
 * (`GET /users?role=DRIVER`, which returns the whole user document) — nothing here is
 * hardcoded. "Available" and "on a delivery" mirror dispatch's own eligibility rule
 * (`dispatch.service.ts`): available = active, online and holding no order; on a delivery =
 * holding an order (`activeOrderId` present).
 */
export function DriversStats() {
  const { t } = useTranslation();
  const { data: drivers, isLoading, isError } = useDriversList();
  const unavailable = isLoading || isError;

  const list = drivers ?? [];
  const active = list.filter((d) => d.isActive).length;
  const inactive = list.filter((d) => !d.isActive).length;
  const total = list.length;
  const available = list.filter((d) => d.isActive && d.isOnline && !d.activeOrderId).length;
  const onMission = list.filter((d) => Boolean(d.activeOrderId)).length;

  const stats = [
    {
      id: 1,
      title: t('drivers.activePlural'),
      value: active,
      valueColor: 'text-[#16A34A]',
      icon: '/transportCompany/DriverPage/rightCheck.svg',
      iconBg: 'border-[#16A34A] bg-[#DCFCE7]/30',
    },
    {
      id: 2,
      title: t('drivers.inactivePlural'),
      value: inactive,
      valueColor: 'text-red-500',
      icon: '/transportCompany/DriverPage/!.svg',
      iconBg: 'border-red-300 bg-red-200',
    },
    {
      id: 3,
      title: t('drivers.total'),
      value: total,
      valueColor: 'text-[#9333EA]',
      icon: '/transportCompany/DriverPage/steering.svg',
      iconBg: 'border-[#9333EA] bg-[#F3E8FF]/50',
    },
    {
      id: 4,
      title: t('drivers.available'),
      value: available,
      valueColor: 'text-blue-600',
      icon: '/transportCompany/DriverPage/hour.svg',
      iconBg: 'border-blue-200 bg-blue-50',
    },
    {
      id: 5,
      title: t('drivers.onMission'),
      value: onMission,
      valueColor: 'text-red-500',
      icon: '/transportCompany/DriverPage/sandHour.svg',
      iconBg: 'border-red-200 bg-red-50',
    },
  ];

  return (
    <div className="flex flex-row items-center gap-4 w-full overflow-x-auto pb-2 custom-scrollbar">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-start gap-4 min-w-[180px] flex-1 shadow-sm"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${stat.iconBg}`}>
            <img src={stat.icon} alt={stat.title} className="w-6 h-6 object-contain" />
          </div>

          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-500 font-bold text-sm">{stat.title}</span>
            <span className={`font-black text-xl ${stat.valueColor}`}>{unavailable ? '—' : stat.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
