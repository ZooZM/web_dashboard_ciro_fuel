export function DriversStats() {
  const stats = [
    {
      id: 1,
      title: 'نشطون',
      value: '20',
      valueColor: 'text-[#16A34A]',
      icon: '/transportCompany/DriverPage/rightCheck.svg',
      iconBg: 'border-[#16A34A] bg-[#DCFCE7]/30',
    },
    {
      id: 2,
      title: 'غير نشطين',
      value: '1',
      valueColor: 'text-slate-800',
      icon: '/transportCompany/DriverPage/!.svg',
      iconBg: 'border-slate-300 bg-slate-50',
    },
    {
      id: 3,
      title: 'إجمالي السائقين',
      value: '28',
      valueColor: 'text-[#9333EA]',
      icon: '/transportCompany/DriverPage/steering.svg',
      iconBg: 'border-[#9333EA] bg-[#F3E8FF]/50',
    },
    {
      id: 4,
      title: 'متاحون',
      value: '5',
      valueColor: 'text-blue-600',
      icon: '/transportCompany/DriverPage/hour.svg',
      iconBg: 'border-blue-200 bg-blue-50',
    },
    {
      id: 5,
      title: 'في مهمة',
      value: '2',
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
            <span className={`font-black text-xl ${stat.valueColor}`}>{stat.value}</span>
          </div>
          
        </div>
      ))}
    </div>
  );
}
