import { OrderHeader } from './order-details/OrderHeader';
import { UrgentNotificationCard } from './order-details/UrgentNotificationCard';
import { OrderDataCard } from './order-details/OrderDataCard';
import { TrackingTimelineCard } from './order-details/TrackingTimelineCard';
import { LinkedInvoicesCard } from './order-details/LinkedInvoicesCard';
import { CustomerDataCard } from './order-details/CustomerDataCard';
import { MapCard } from './order-details/MapCard';
import { AssignedDriverCard } from './order-details/AssignedDriverCard';

export function OrderDetailPage() {

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full" dir="rtl">
      <OrderHeader />

      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Right Column (Wider) */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <UrgentNotificationCard />
          <OrderDataCard />
          <TrackingTimelineCard />
          <LinkedInvoicesCard />
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
