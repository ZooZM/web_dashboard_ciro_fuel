export function DriverStatsRow() {
  const stats = [
    {
      id: 1,
      label: 'معدل الالتزام بالمواعيد',
      sub: '96%',
      icon: '/transportCompany/DriverPage/editDriver/chart.svg',
      iconBg: 'bg-green-100'
    },
    {
      id: 2,
      label:"سنوات الخبرة",
      sub: '8 ',
      icon: '/transportCompany/DriverPage/editDriver/date.svg',
      iconBg: 'bg-red-100'
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
      {stats.map((stat) => (
        <div 
          key={stat.id}
          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-start gap-4 w-full flex-1"
        >
          <div className={`w-12 h-12 rounded-full shadow-sm flex items-center justify-center shrink-0 mr-3 ${stat.iconBg}`}>
            <img src={stat.icon} alt={stat.label} className="w-6 h-6 object-contain" />
          </div>
          <div className="flex flex-col gap-0.5 text-right flex-1">
            <span className="text-slate-400 text-xs font-medium">{stat.label}</span>
            <span className="text-[#162155] font-black text-sm">{stat.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
