import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MobileDriversList({ drivers }: { drivers: any[] }) {
  const navigate = useNavigate();
  return (
    <div className="lg:hidden flex flex-col gap-4 w-full">
      {drivers.map((driver, idx) => (
        <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
          
          {/* Header: Driver Info and Status */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200">
                <img src={driver.avatar} alt={driver.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[#162155] font-black text-sm">{driver.name}</span>
                <span className="text-slate-400 font-bold text-xs">{driver.id}</span>
              </div>
            </div>
            
            <div className="inline-flex items-center justify-center gap-1.5 bg-[#DCFCE7] px-3 py-1 rounded-full shrink-0">
              <span className="text-[#16A34A] text-xs font-bold">{driver.status}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-right">
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-[10px] font-bold">رقم الجوال</span>
              <span className="text-slate-800 font-bold text-xs">{driver.phone}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-[10px] font-bold">الشاحنة</span>
              <span className="text-slate-800 font-bold text-xs">{driver.truck}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-[10px] font-bold">السعة (لتر)</span>
              <span className="text-[#162155] font-black text-xs">{driver.capacity}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-[10px] font-bold">التقييم</span>
              <div className="flex items-center gap-1">
                <span className="text-[#162155] font-black text-xs">{driver.rating}</span>
                <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-[10px] font-bold">رحلات الشهر</span>
              <span className="text-slate-800 font-bold text-xs">{driver.tripsMonth}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-[10px] font-bold">آخر شحنة</span>
              <span className="text-slate-800 font-bold text-[11px]">{driver.lastShipment}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-100 pt-3 flex justify-end">
            <button 
              onClick={(e) => { e.stopPropagation(); navigate(`/drivers/1`); }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-blue-100 text-blue-600 hover:bg-blue-50 transition-colors text-sm font-bold bg-white"
            >
              <img src="DriverPage/pen.svg" alt="تعديل بيانات السائق" className="w-4 h-4 object-contain" />
              <p className='text-sm font-bold text-blue-600'>تعديل بيانات السائق</p>
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}
