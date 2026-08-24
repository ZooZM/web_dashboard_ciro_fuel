export function DriverStatsRow() {
  const stats = [
    {
      id: 3,
      label: 'TNK-0231',
      sub: 'السعة 20,000 لتر',
      icon: '/transportCompany/DriverPage/editDriver/truck.svg',
      iconBg: 'bg-blue-50 border-blue-100'
    },
    {
      id: 2,
      label: 'رقم اللوحة',
      sub: 'ABC-1234',
      icon: '/transportCompany/DriverPage/editDriver/truck.svg',
      iconBg: 'bg-blue-50 border-blue-100'
    },
    {
      id: 1,
      label: 'رقم الجوال',
      sub: '05xxxxxxxx',
      icon: '/transportCompany/DriverPage/hour.svg',
      iconBg: 'bg-blue-50 border-blue-100'
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
      {stats.map((stat) => (
        <div 
          key={stat.id}
          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between w-full flex-1"
        >
          <div className="flex flex-col gap-0.5 text-right flex-1">
            <span className="text-slate-400 text-xs font-bold">{stat.label}</span>
            <span className="text-[#162155] font-black text-sm">{stat.sub}</span>
          </div>
          <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 mr-3 ${stat.iconBg}`}>
            <img src={stat.icon} alt={stat.label} className="w-6 h-6 object-contain" />
          </div>
        </div>
      ))}
    </div>
  );
}
