import { cn } from '@/lib/utils';

const MOCK_REGIONS = [
  { id: 1, name: 'جدة الوسطى', subtext: 'جدة - حي الروضة', price: '1.80 ر.س / كم', min: 'الحد الأدنى 120 ر.س', active: true },
  { id: 2, name: 'جدة الوسطى', subtext: 'جدة - حي الروضة', price: '1.80 ر.س / كم', min: 'الحد الأدنى 120 ر.س', active: true },
  { id: 3, name: 'جدة الوسطى', subtext: 'جدة - حي الروضة', price: '1.80 ر.س / كم', min: 'الحد الأدنى 120 ر.س', active: false },
  { id: 4, name: 'جدة الوسطى', subtext: 'جدة - حي الروضة', price: '- ر.س / كم', min: 'الحد الأدنى - ر.س', active: true },
  { id: 5, name: 'جدة الوسطى', subtext: 'جدة - حي الروضة', price: '1.80 ر.س / كم', min: 'الحد الأدنى 120 ر.س', active: true },
];

export function CompanyRegionsCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/petrolCompany/transporters/details/detail.svg" alt="" className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-slate-900">المناطق المغطاة</h2>
            <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full">5 مناطق</span>
          </div>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2 justify-center">
          <img src="/petrolCompany/transporters/details/plus.svg" alt="Add" className="w-4 h-4" />
          إضافة منطقة
        </button>
      </div>

      {/* Regions List */}
      <div className="flex flex-col gap-3">
        {MOCK_REGIONS.map((region) => (
          <div key={region.id} className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 transition-colors hover:bg-slate-50">
            
            {/* Right - Icon & Name */}
            <div className="flex items-center gap-4 flex-1">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                region.active ? "bg-blue-500" : "bg-red-500"
              )}>
                <img src="/petrolCompany/transporters/details/bluePin.svg" alt="" className="w-5 h-5 filter brightness-0 invert" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-900 mb-0.5">{region.name}</span>
                <span className="text-xs font-bold text-slate-400">{region.subtext}</span>
              </div>
            </div>

            {/* Center - Price */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {region.active ? (
                <>
                  <span className="text-sm font-black text-green-600 mb-0.5">{region.price}</span>
                  <span className="text-[10px] font-bold text-slate-400">{region.min}</span>
                </>
              ) : (
                <span className="text-sm font-bold text-red-500 bg-red-50 px-4 py-1.5 rounded-lg border border-red-100">غير نشط</span>
              )}
            </div>

            {/* Left - Action */}
            <div className="flex-1 flex justify-end">
              <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm">
                <img src="/petrolCompany/transporters/details/edit.svg" alt="Edit" className="w-5 h-5" />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
