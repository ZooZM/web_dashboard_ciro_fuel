import { useState } from 'react';
import { DriverDetailsHeader } from './DriverDetailsHeader';
import { DriverStatsRow } from './DriverStatsRow';
import { DriverInfoCard } from './DriverInfoCard';
import { DriverRecentTripsCard } from './DriverRecentTripsCard';
import { DriverTruckCard } from './DriverTruckCard';
import { DriverMapCard } from './DriverMapCard';
import { DriverRatingsCard } from './DriverRatingsCard';

export function DriverDetailsPage() {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="w-full p-4 md:p-6 flex-1 bg-[#F8FAFC] min-h-screen font-sans" dir="rtl">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <DriverDetailsHeader 
          isEditing={isEditing} 
          onEditClick={() => setIsEditing(true)}
          onCancelEdit={() => setIsEditing(false)}
        />

        {/* Stats Row */}
        <DriverStatsRow />

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Right Column (2/3 width) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <DriverInfoCard />
            <DriverRecentTripsCard />
          </div>

          {/* Left Column (1/3 width) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <DriverTruckCard />
            <DriverMapCard />
            <DriverRatingsCard />
          </div>

        </div>

      </div>
    </div>
  );
}
