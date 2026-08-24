import { Star } from 'lucide-react';

export function ProfileStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {/* إجمالي الشاحنات */}
      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4 w-full">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
          <img src="/transportCompany/profilePage/hollowTruck.svg" alt="" className="w-5 h-5 object-contain" />
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[#858C95] font-bold text-xs">إجمالي الشاحنات</span>
          <span className="text-[#162155] font-black text-xl">24</span>
        </div>
      </div>

      {/* إجمالي السائقين */}
      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4 w-full">
        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
          <img src="/transportCompany/profilePage/steering.svg" alt="" className="w-5 h-5 object-contain" />
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[#858C95] font-bold text-xs">إجمالي السائقين</span>
          <span className="text-[#162155] font-black text-xl">28</span>
        </div>
      </div>

      {/* المناطق المغطاة */}
      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4 w-full">
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
          <img src="/transportCompany/profilePage/station.svg" alt="" className="w-5 h-5 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(58%) sepia(87%) saturate(417%) hue-rotate(85deg) brightness(97%) contrast(93%)' }} />
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[#858C95] font-bold text-xs">المناطق المغطاة</span>
          <span className="text-[#162155] font-black text-xl">5</span>
        </div>
      </div>

      {/* تقييم الأداء */}
      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4 w-full">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
          <Star className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[#858C95] font-bold text-xs">تقييم الأداء</span>
          <span className="text-[#162155] font-black text-xl">4.7</span>
        </div>
      </div>
    </div>
  );
}
