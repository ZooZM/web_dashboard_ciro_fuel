import { useNavigate } from 'react-router-dom';

import { CustomGoogleMap } from '@/components/ui/CustomGoogleMap';

export function MapCard() {
  const navigate = useNavigate();

  // Coordinates for Riyadh
  const mapCenter = { lat: 24.7136, lng: 46.6753 };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/transportCompany/orderPage/orderDetails/pin.svg" alt="" className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-black text-[#162155]">الموقع على الخريطة</h2>
        </div>
        <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm shrink-0">
          <img src="/transportCompany/orderPage/orderDetails/link.svg" alt="" className="w-5 h-5" />
        </button>
      </div>
      <div className="w-full h-[180px] bg-slate-100 rounded-xl mb-4 relative overflow-hidden border border-slate-200">
        <CustomGoogleMap 
          center={mapCenter} 
          className="w-full h-full object-cover opacity-60" 
        />
        <div className="absolute top-3 left-3 bg-white rounded-xl p-2 shadow-sm border border-slate-100">
            <img src="/transportCompany/orderPage/orderDetails/map.svg" alt="" className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      <button
        onClick={() => navigate('/petrolCompany/tracking')}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
      >
        <img src="/transportCompany/orderPage/orderDetails/buttonMap.svg" alt="" className="w-5 h-5" />
        تتبع الشاحنة
      </button>
    </div>
  );
}
