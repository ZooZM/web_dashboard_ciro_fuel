import { CustomGoogleMap } from '@/components/ui/CustomGoogleMap';

export function MapTrackingCard() {
  const mapCenter = { lat: 24.7136, lng: 46.6753 }; // Riyadh coordinates

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col h-[420px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black text-slate-800">تتبع الشحنات المباشرة</h2>
        <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700">عرض الكل</button>
      </div>

      {/* Map Image */}
      <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
        <CustomGoogleMap 
          center={mapCenter} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 divide-x-0 md:divide-x md:divide-x-reverse divide-slate-200 mt-5 mb-1 text-center">
        <div className="flex flex-col items-center border-l-0 md:border-l border-slate-200">
          <span className="text-lg font-black text-slate-500">2</span>
          <span className="text-[11px] font-bold text-slate-500 mt-0.5">لم يتم الاستلام</span>
        </div>
        <div className="flex flex-col items-center border-l border-slate-200">
          <span className="text-lg font-black text-[#F97316]">1</span>
          <span className="text-[11px] font-bold text-[#F97316] mt-0.5">متأخر</span>
        </div>
        <div className="flex flex-col items-center border-l-0 md:border-l border-slate-200">
          <span className="text-lg font-black text-[#12A150]">12</span>
          <span className="text-[11px] font-bold text-[#12A150] mt-0.5">جاري التوصيل</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-black text-[#2563EB]">3</span>
          <span className="text-[11px] font-bold text-[#2563EB] mt-0.5">في الطريق</span>
        </div>
      </div>

    </div>
  );
}
