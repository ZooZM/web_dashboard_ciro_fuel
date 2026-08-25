import { useNavigate } from 'react-router-dom';

const MOCK_DRIVERS = [
  { id: 'DRV-2026-123', name: 'محمد إبراهيم', truck: 'أ ب ت - 1234', status: 'نشط' },
  { id: 'DRV-2026-123', name: 'محمد إبراهيم', truck: 'أ ب ت - 1234', status: 'نشط' },
  { id: 'DRV-2026-123', name: 'محمد إبراهيم', truck: 'أ ب ت - 1234', status: 'نشط' },
];

export function AdminCompanyDriversCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-start gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#F4F8FD] flex items-center justify-center">
          <img src="/transportCompany/orderPage/AssignPage/driver.svg" alt="" className="w-5 h-5 " />
        </div>
        <h3 className="text-base font-black text-[#162155]">السائقين المتاحين</h3>
      </div>
      
      <div className="flex flex-col gap-4">
        {MOCK_DRIVERS.map((driver, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-[#E7E9EF] last:border-0 last:pb-0">
            <div className="flex flex-col text-right">
              <span className="text-sm font-black text-[#162155]">{driver.name}</span>
              <span className="text-[10px] font-bold text-slate-400">{driver.id}</span>
            </div>
            
            <div className="flex flex-col text-center">
              <span className="text-[10px] font-bold text-slate-400">الشاحنة</span>
              <span className="text-xs font-black text-[#162155]">{driver.truck}</span>
            </div>

            <div className="px-4 py-1.5 bg-green-100/50 text-green-600 rounded-xl text-xs font-bold">
              {driver.status}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button 
          onClick={() => navigate('/admin/drivers')}
          className="w-full py-2.5 rounded-xl border border-[#E7E9EF] text-blue-600 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
          <img src="/petrolCompany/station/arrowRight.svg" alt="" className="w-4 h-4" />
          عرض المزيد
        </button>
      </div>
    </div>
  );
}
