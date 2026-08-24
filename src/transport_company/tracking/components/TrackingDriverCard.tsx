import { Star, Truck, Droplet } from 'lucide-react';

export function TrackingDriverCard() {
  return (
    <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">

      {/* Driver Profile Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between w-full lg:col-span-2">
        
        {/* Avatar and Name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-50 shrink-0">
            <img 
              src="/transportCompany/DriverPage/editDriver/profile.jpg" 
              alt="محمد إبراهيم" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#162155] font-bold text-lg">محمد إبراهيم</span>
            <div className="flex items-center gap-1 justify-start">
              <span className="text-[#162155] font-bold text-sm">4.1</span>
              <Star className="w-4 h-4 text-[#F97316]" />
            </div>
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-400 text-sm font-medium">رقم الجوال</span>
          <span className="text-[#162155] font-bold text-base" dir="ltr">05xxxxxxxx</span>
        </div>

      </div>

      {/* Plate Number */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center w-full lg:col-span-1">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
          <img src="/petrolCompany/Tracking/truck.svg" alt="" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-1">
          <span className="text-slate-400 text-sm font-medium">رقم اللوحة</span>
          <span className="text-[#162155] font-bold text-base">ABC-1234</span>
        </div>
      </div>

      {/* Tank Number */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center w-full lg:col-span-1">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
          <img src="/petrolCompany/Tracking/drop.svg" alt="" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-1">
          <span className="text-[#162155] text-sm font-normal">TNK-0231</span>
          <span className="text-slate-400 text-sm font-normal">
            السعة <span className="text-[#162155] font-bold">20,000</span> لتر
          </span>
        </div>
      </div>

    </div>
  );
}