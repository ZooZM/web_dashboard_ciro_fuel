import { DriverDetailsHeader } from './DriverDetailsHeader';
import { DriverInfoCard } from './DriverInfoCard';
import { DriverMapCard } from './DriverMapCard';

/**
 * Feature 009 T090/SC-005: DriverStatsRow/DriverTruckCard/DriverRatingsCard/
 * DriverRecentTripsCard are dropped from THIS composition — each showed numbers with no
 * real data source (total trips, on-time rate, years of experience, a fixed truck/tank
 * pair, a fixed set of reviews, three fixed past deliveries). The platform has no
 * per-driver trip history or rating breakdown endpoint, and a vehicle is no longer
 * associated with a driver at all outside a specific delivery (spec 008 cutover) — adding
 * that capability is outside this feature's one-platform-addition scope
 * (`GET /orders/summary`, plan.md). The component files themselves are untouched:
 * AdminDriverDetailsPage.tsx (out of this feature's scope) still composes them.
 */
export function DriverDetailsPage() {
  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <DriverDetailsHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <DriverInfoCard />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6">
            <DriverMapCard />
          </div>
        </div>
      </div>
    </div>
  );
}
