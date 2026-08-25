const MOCK_TRIPS = [
  { id: 'ORD-2024-256', type: 'بنزين 95', volume: '20,000 لتر', driver: 'محمد أحمد - محطة الرحاب', status: 'active' },
  { id: 'ORD-2024-257', type: 'بنزين 95', volume: '20,000 لتر', driver: 'محمد أحمد - محطة الرحاب', status: 'completed' },
  { id: 'ORD-2024-258', type: 'بنزين 95', volume: '20,000 لتر', driver: 'محمد أحمد - محطة الرحاب', status: 'completed' },
];

export function CompanyRecentTripsCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-start gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <img src="/petrolCompany/transporters/details/blueOrder.svg" alt="" className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-black text-slate-900">سجل الرحلات الأخيرة</h2>
      </div>

      <div className="flex flex-col gap-4 mb-4">
        {MOCK_TRIPS.map((trip, idx) => (
          <div key={trip.id} className="flex flex-col">
            <div className="flex items-center justify-between py-2">
              
              <div className="flex flex-col items-start">
                <span className="text-sm font-black text-slate-900 mb-1">{trip.id}</span>
                <span className="text-xs font-bold text-slate-400">
                  {trip.driver}
                </span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2 items-center text-xs font-bold text-slate-500">
                  <span>{trip.type}</span>
                  <span>{trip.volume}</span>
                </div>
                
                {trip.status === 'active' ? (
                  <div className="bg-[#DCFCE7] text-[#16A34A] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></div>
                    قيد التوصيل
                  </div>
                ) : (
                  <div className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                    مكتمل
                  </div>
                )}
              </div>
            </div>
            
            {idx !== MOCK_TRIPS.length - 1 && (
              <div className="h-px bg-slate-100 w-full mt-2"></div>
            )}
          </div>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-blue-600 bg-white hover:bg-slate-50 transition-colors text-sm font-bold mt-2">
        <img src="/petrolCompany/transporters/details/detail.svg" alt="" className="w-4 h-4 " />
        <span>عرض المزيد</span>
      </button>
    </div>
  );
}
