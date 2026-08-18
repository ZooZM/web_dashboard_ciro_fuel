import { TrackingSidebar } from './TrackingSidebar';
import { TrackingOrderDetails } from './TrackingOrderDetails';
import { TrackingDriverCard } from './TrackingDriverCard';
import { TrackingMapCard } from './TrackingMapCard';

export function TrackingPage() {
  return (
    <div className="w-full p-4 md:p-6 flex-1 bg-[#F8FAFC] min-h-screen font-sans" dir="rtl">
      
      {/* Header */}
      <div className="mb-6 flex flex-col items-start text-right">
        <h1 className="text-2xl font-black text-slate-900">تتبع الشحنات</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">اختر الطلب و تتبع رحلات توصيل الطلب</p>
      </div>

      {/* Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Sidebar (Right visually in RTL) */}
        <TrackingSidebar />

        {/* Main Content (Left visually in RTL) */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <TrackingOrderDetails />
          <TrackingDriverCard />
          <TrackingMapCard />
        </div>

      </div>
    </div>
  );
}
