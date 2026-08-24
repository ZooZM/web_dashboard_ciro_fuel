export function DriverStatsRow() {
  const stats = [
    {
      id: 1,
      title: 'إجمالي الرحلات',
      value: '482',
      icon: '/transportCompany/DriverPage/editDriver/truck.svg',
      iconBg: 'bg-blue-50 border-blue-100'
    },
    {
      id: 2,
      title: 'رحلات هذا الشهر',
      value: '38',
      icon: '/transportCompany/DriverPage/editDriver/invoice.svg',
      iconBg: 'bg-orange-50 border-orange-100'
    },
    {
      id: 3,
      title: 'معدل الالتزام بالمواعيد',
      value: '96%',
      icon: '/transportCompany/DriverPage/editDriver/chart.svg',
      iconBg: 'bg-green-50 border-green-100'
    },
    {
      id: 4,
      title: 'سنوات الخبرة',
      value: '5',
      icon: '/transportCompany/DriverPage/editDriver/date.svg',
      iconBg: 'bg-red-50 border-red-100'
    }
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
      {stats.map((stat) => (
        <div 
          key={stat.id}
          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center w-full flex-1"
        >
          <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 ${stat.iconBg}`}>
            <img src={stat.icon} alt={stat.title} className="w-7 h-7 object-contain" />
          </div>
          <div className="flex flex-col gap-1 text-right mr-2">
            <span className="text-slate-500 font-bold text-sm">{stat.title}</span>
            <span className="text-[#162155] font-black text-xl">{stat.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
