import { Layers, Plus, Minus, Navigation, MapPin } from 'lucide-react';

export function TrackingMapCard() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
      
      {/* Background Map Image */}
      <img src="/transportCompany/trackingPage/map.png" alt="Map" className="absolute inset-0 w-full h-full object-cover" />

      {/* Top Left Control */}
      <div className="absolute top-4 left-4">
        <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-blue-600 hover:bg-slate-50 transition-colors">
          <img src="/transportCompany/trackingPage/location.svg" alt="" className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Left Controls */}
      <div className="absolute left-4 bottom-4 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-blue-600 hover:bg-slate-50 transition-colors">
          <img src="/transportCompany/trackingPage/reload.svg" alt="" className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-blue-600 hover:bg-slate-50 transition-colors">
          <img src="/transportCompany/trackingPage/zoomIn.svg" alt="" className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-blue-600 hover:bg-slate-50 transition-colors">
          <img src="/transportCompany/trackingPage/zoomOut.svg" alt="" className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-blue-600 hover:bg-slate-50 transition-colors">
          <img src="/transportCompany/trackingPage/share.svg" alt="" className="w-5 h-5" />
        </button>
      </div>

      {/* Top Right Card: Time Remaining */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg flex items-center gap-4">

       <div className="relative w-14 h-14 flex items-center justify-center">
          {/* Circular Progress SVG */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#16A34A]"
              strokeWidth="3"
              strokeDasharray="75, 100"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className=" w-10 h-10 rounded-full flex items-center justify-center relative z-10">
             <img src="/transportCompany/trackingPage/hollowTruck.svg" alt="" className="w-6 h-6 object-contain" />
          </div>
        </div>

        <div className="flex flex-col text-center">
          <span className="text-slate-800 font-bold text-xs mb-1">المتبقي للوصول</span>
          <span className="text-[#162155] font-bold text-lg leading-none">35</span>
          <span className="text-slate-500 font-bold text-[10px]">دقيقة</span>
        </div>
       
      </div>

      {/* Bottom Right Card: Distance Remaining */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg flex items-center gap-0.5">
          <div className=" w-6 h-6 rounded-full flex items-center justify-center shrink-0">
          <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
        </div>
        <span className="text-slate-800 font-bold text-xs">المسافة المتبقية <span className="text-[#162155] font-black">1.2 </span> <span>كم</span></span>
        
      </div>

    </div>
  );
}
