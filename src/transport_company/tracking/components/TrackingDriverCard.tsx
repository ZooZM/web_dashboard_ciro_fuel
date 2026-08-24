import { Star } from 'lucide-react';

export function TrackingDriverCard() {
  return (
    <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 w-full">
      
      {/* Right Card: Driver Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-6 flex-1">
        
        {/* Driver Name & Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200">
            <img src="/transportCompany/trackingPage/profile.jpg" alt="محمد إبراهيم" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#162155] font-black text-sm">محمد إبراهيم</span>
            <div className="flex items-center justify-end gap-1" dir="ltr">
              <span className="text-slate-800 font-bold text-xs">4.1</span>
              <Star className="w-3.5 h-3.5 text-[#F59E0B] " />
            </div>
          </div>
        </div>

        {/* Trips & Phone */}
        <div className="flex items-center gap-8 px-6 py-1 border-r border-slate-100 mr-auto">
          <div className="flex flex-col gap-1 text-center">
            <span className="text-slate-400 text-[10px] font-bold">الرحلات اليوم</span>
            <span className="text-slate-800 font-bold text-xs">6.5 كم</span>
          </div>
          <div className="flex flex-col gap-1 text-center">
            <span className="text-slate-400 text-[10px] font-bold">رقم الجوال</span>
            <span className="text-slate-800 font-bold text-xs">05xxxxxx</span>
          </div>
        </div>
      </div>

      {/* Left Card: Truck Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center shrink-0">
          <img src="/transportCompany/trackingPage/truck.svg" alt="" className="w-6 h-6 object-contain" />
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-500 font-bold text-sm mr-2">أ ب ت - 1234</span>
          <span className="text-slate-800 font-bold text-xs">السعة 20,000 لتر</span>
        </div>
      
      </div>

    </div>
  );
}
