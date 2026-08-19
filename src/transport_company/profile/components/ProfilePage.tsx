import { useState } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { ProfileStats } from './ProfileStats';
import { ProfileAccountCard } from './ProfileAccountCard';
import { ProfileCompanyCard } from './ProfileCompanyCard';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans animate-in fade-in duration-500" dir="rtl">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        
        {/* Header (contains Edit Form when isEditing is true) */}
        <ProfileHeader 
          isEditing={isEditing}
          onEditClick={() => setIsEditing(true)}
          onCancelEdit={() => setIsEditing(false)}
        />

        {/* Stats Row */}
        <ProfileStats />

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <ProfileAccountCard />
          <ProfileCompanyCard />
        </div>

      </div>
    </div>
  );
}
