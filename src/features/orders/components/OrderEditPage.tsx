import { ChevronRight } from 'lucide-react';
import { CustomerDataCard } from './order-details/CustomerDataCard';
import { MapCard } from './order-details/MapCard';
import { AssignedDriverCard } from './order-details/AssignedDriverCard';
import { OrderDataCard } from './order-details/OrderDataCard';
import { TrackingTimelineCard } from './order-details/TrackingTimelineCard';
import { EditTransportDetailsCard } from './order-details/EditTransportDetailsCard';

export function OrderEditPage() {

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans bg-[#F8FAFC] min-h-screen" dir="rtl">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex items-center text-slate-500 text-sm font-medium gap-2">
          <div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center shadow-lg cursor-pointer" onClick={() => window.history.back()}>
            <ChevronRight className="w-5 h-5 font-bold" />
          </div>
          <span className="flex items-center gap-2 text-slate-400 cursor-pointer" onClick={() => window.history.back()}>الطلبات</span>
          <span className="text-slate-400">/</span>
          <span className="text-[#162155] font-bold">ORD-2024-256</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">تفاصيل الطلب – ORD-2024-256</h1>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Right Column (Wider) */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <EditTransportDetailsCard />
          <OrderDataCard />
          <TrackingTimelineCard />
        </div>

        {/* Left Column (Narrower) */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 self-start">
          <CustomerDataCard />
          <MapCard />
          <AssignedDriverCard />
        </div>
      </div>
    </div>
  );
}
