import { AdminOrderHeader } from './order-details/AdminOrderHeader';
import { SupplierDataCard } from './order-details/SupplierDataCard';
import { CustomerDataCard } from '@/petrol_company/orders/components/order-details/CustomerDataCard';
import { MapCard } from '@/transport_company/orders/components/order-details/MapCard';
import { AssignedDriverCard } from '@/transport_company/orders/components/order-details/AssignedDriverCard';
import { AdminTransportCompanyCard } from './order-details/AdminTransportCompanyCard';
import { AdminOrderDataCard } from './order-details/AdminOrderDataCard';
import { TrackingTimelineCard } from '@/transport_company/orders/components/order-details/TrackingTimelineCard';
import { AdminLinkedInvoicesCard } from './order-details/AdminLinkedInvoicesCard';

export function AdminOrderDetailPage() {
  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full" dir="rtl">
      <AdminOrderHeader />

      {/* Main Grid */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        
        {/* Right Column (Wider) */}
        <div className="flex-1 w-full flex flex-col gap-6 order-2 xl:order-1">
          <AdminTransportCompanyCard />
          <AdminOrderDataCard />
          <TrackingTimelineCard />
          <AdminLinkedInvoicesCard />
        </div>

        {/* Left Column (Narrower) */}
        <div className="w-full xl:w-[350px] flex flex-col gap-6 shrink-0 self-start order-1 xl:order-2">
          <SupplierDataCard />
          <CustomerDataCard />
          <MapCard />
          <AssignedDriverCard />
        </div>

      </div>
    </div>
  );
}
