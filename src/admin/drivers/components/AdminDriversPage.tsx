import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DriversStats } from '@/transport_company/drivers/components/DriversStats';
import { DesktopDriversTable } from '@/transport_company/drivers/components/DesktopDriversTable';
import { MobileDriversList } from '@/transport_company/drivers/components/MobileDriversList';
import { FilterToolbar } from '@/components/ui/FilterToolbar';

const FILTERS = ['الكل', 'نشط', 'غير نشط', 'في رحلة'];

const MOCK_DRIVERS = Array(8).fill({
  id: 'DRV-2026-123',
  name: 'محمد إبراهيم',
  avatar: '/transportCompany/trackingPage/profile.jpg',
  phone: '0555xxxxxx',
  truck: 'أ ب ت - 1234',
  capacity: '20,000',
  rating: '4.1',
  tripsMonth: '38',
  lastShipment: 'اليوم، 04:30 م',
  status: 'نشط'
});

export function AdminDriversPage() {
  const [activeTab, setActiveTab] = useState('الكل');
  const navigate = useNavigate();

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-[calc(100vh-6rem)] font-sans" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex flex-col gap-1 text-right">
          <h1 className="text-[#162155] font-black text-2xl">السائقين</h1>
          <p className="text-slate-500 font-bold text-sm">إدارة ومتابعة سائقين و أسطول شاحنات نقل الوقود</p>
        </div>
        

      </div>

      {/* Stats Row */}
      <div className="mb-6">
        <DriversStats />
      </div>

      {/* Main Content Section (Table & Actions) */}
      <div className="bg-white border border-[#E7E9EF] rounded-2xl shadow-sm overflow-hidden pt-4 pb-0 flex flex-col">
        
        {/* Top: Tabs & Actions Area */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4 px-4 w-full">
          
          {/* Right Side: Tabs (Replaces Arrange/Filter) */}
          <div className="flex items-center border border-[#E7E9EF] rounded-xl overflow-hidden w-full xl:w-fit bg-[#F8FAFC] divide-x divide-x-reverse divide-[#E7E9EF] shadow-sm shrink-0">
            {FILTERS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'relative flex-1 xl:flex-none px-4 lg:px-8 py-2.5 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer text-center h-[40px]',
                    isActive ? 'text-[#162155]' : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-admin-driver-tab"
                      className="absolute inset-0 bg-white border-b-2 border-blue-600"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Top: Action Bar */}
        <FilterToolbar 
          searchPlaceholder="ابحث بكود السائق أو الشاحنة..."
          onExport={() => console.log('Export Admin Drivers')}
          hasDateRange={false}
          filters={[
            { id: 'status', label: 'الحالة', options: [{ value: 'active', label: 'نشط' }, { value: 'inactive', label: 'غير نشط' }] }
          ]}
        />

        {/* Desktop Table View */}
        <DesktopDriversTable drivers={MOCK_DRIVERS} />
        
        {/* Mobile View: Cards layout instead of Table */}
        <div className="px-4 pb-4 lg:px-0 lg:pb-0">
          <MobileDriversList drivers={MOCK_DRIVERS} />
        </div>

      </div>

    </div>
  );
}
