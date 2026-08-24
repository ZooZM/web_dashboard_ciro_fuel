import { useState } from 'react';
import { Star } from 'lucide-react';

export function AssignLists() {
  const [tankFilter, setTankFilter] = useState<'all' | 'ألومنيوم' | 'حديد'>('all');

  const drivers = Array.from({ length: 4 }).map((_, i) => ({
    id: `DRV-2024-01${i + 1}`,
    name: 'محمد إبراهيم',
    rating: '4.1',
    phone: '05xxxxxxx',
    available: true,
  }));

  const trucks = Array.from({ length: 4 }).map((_, i) => ({
    id: `ABC-123${i + 1}`,
    lastDriver: 'أحمد السبيعي',
    available: true,
  }));

  const tanksData = Array.from({ length: 6 }).map((_, i) => ({
    id: `TNK-023${i + 1}`,
    capacity: '20,000 لتر',
    material: i % 2 === 0 ? 'ألومنيوم' : 'حديد',
    available: true,
  }));

  const filteredTanks = tankFilter === 'all' ? tanksData : tanksData.filter(tank => tank.material === tankFilter);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Drivers Column (Rightmost in RTL) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <img src="/transportCompany/orderPage/AssignPage/driver.svg" alt="" className="w-5 h-5" />
                </div>
                <h3 className="text-[#162155] font-black text-lg">السائق</h3>
            </div>
            <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-full text-xs font-bold">4 متاح</span>
        </div>

        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pl-2 custom-scrollbar">
          {drivers.map((driver, i) => (
            <label key={i} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors hover:bg-slate-50`}>
                <div className="flex items-center gap-3 w-full">
                    {/* Radio */}
                    <input type="radio" name="driver" className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 shrink-0" defaultChecked={i === 0} />
                    
                    {/* Avatar */}
                    <div className="shrink-0 w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                        <img src="/transportCompany/orderPage/AssignPage/profile.jpg" alt="" className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col items-start gap-1 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[#162155] font-black text-sm">{driver.name}</span>
                            <div className="flex items-center gap-0.5">
                                <span className="text-[#162155] font-bold text-xs pt-0.5">{driver.rating}</span>
                                <Star className="w-3 h-3 text-orange-500" strokeWidth={3} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-md">{driver.id}</span>
                            <span className="text-slate-500 text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-md">إقامة 2xxxxxxxxx</span>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold shrink-0">متاح</div>
                </div>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Trucks Column (Middle in RTL) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <img src="/transportCompany/orderPage/AssignPage/truck.svg" alt="" className="w-5 h-5" />
                </div>
                <h3 className="text-[#162155] font-black text-lg">الشاحنة</h3>
            </div>
            <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-full text-xs font-bold">4 متاح</span>
        </div>

        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pl-2 custom-scrollbar">
          {trucks.map((truck, i) => (
            <label key={i} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors hover:bg-slate-50`}>
                <div className="flex items-center gap-3 w-full">
                    {/* Radio */}
                    <input type="radio" name="truck" className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 shrink-0" defaultChecked={i === 0} />
                    
                    {/* Icon Box */}
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <img src="/transportCompany/orderPage/AssignPage/truck.svg" alt="" className="w-5 h-5" />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col items-start gap-1 flex-1">
                        <span className="text-[#162155] font-black text-sm">{truck.id}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-md">آخر سائق: {truck.lastDriver}</span>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold shrink-0">متاح</div>
                </div>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Tanks Column (Leftmost in RTL) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <img src="/transportCompany/orderPage/AssignPage/drop.svg" alt="" className="w-5 h-5" />
                </div>
                <h3 className="text-[#162155] font-black text-lg">التانك</h3>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-100 p-1 rounded-full justify-end gap-1">
                    <button 
                        onClick={() => setTankFilter(tankFilter === 'ألومنيوم' ? 'all' : 'ألومنيوم')}
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${tankFilter === 'ألومنيوم' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        <img src="/petrolCompany/orderDetails/aluminum.svg" alt="" className="w-4 h-4"/> ألومنيوم
                    </button>
                    <button 
                        onClick={() => setTankFilter(tankFilter === 'حديد' ? 'all' : 'حديد')}
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${tankFilter === 'حديد' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        <img src="/petrolCompany/orderDetails/iron.svg" alt="" className="w-4 h-4"/> حديد
                    </button>
                </div>
            </div>
        </div>
        

        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pl-2 custom-scrollbar">
          {filteredTanks.map((tank, i) => (
            <label key={i} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors hover:bg-slate-50 `}>
                <div className="flex items-center gap-3 w-full">
                    {/* Radio */}
                    <input type="radio" name="tank" className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 shrink-0" defaultChecked={i === 0} />
                    
                    {/* Icon Box */}
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <img src="/transportCompany/orderPage/AssignPage/drop.svg" alt="" className="w-5 h-5" />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col items-start gap-1 flex-1">
                        <span className="text-[#162155] font-black text-sm">{tank.id}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-md">{tank.capacity}</span>
                            <span className="text-slate-500 text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-md">{tank.material}</span>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold shrink-0">متاح</div>
                </div>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
}
