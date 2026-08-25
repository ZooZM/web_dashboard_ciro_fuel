import { DriverDetailsHeader } from '@/transport_company/drivers/components/driver-details/DriverDetailsHeader';
import { DriverStatsRow } from '@/transport_company/drivers/components/driver-details/DriverStatsRow';
import { DriverInfoCard } from '@/transport_company/drivers/components/driver-details/DriverInfoCard';
import { DriverRecentTripsCard } from '@/transport_company/drivers/components/driver-details/DriverRecentTripsCard';
import { DriverTruckCard } from '@/transport_company/drivers/components/driver-details/DriverTruckCard';
import { DriverMapCard } from '@/transport_company/drivers/components/driver-details/DriverMapCard';
import { AdminDriverTransportCompanyCard } from './AdminDriverTransportCompanyCard';

export function AdminDriverDetailsPage() {
  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <DriverDetailsHeader />

        {/* Stats Row */}
        <DriverStatsRow />

        {/* Main Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Right Column (Wider) */}
          <div className="flex-1 w-full flex flex-col gap-6">
            <DriverInfoCard />
            <DriverRecentTripsCard />
          </div>

          {/* Left Column (Narrower) */}
          <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 self-start">
            <AdminDriverTransportCompanyCard />
            <DriverTruckCard />
            <DriverMapCard />
          </div>

        </div>

      </div>
    </div>
  );
}
