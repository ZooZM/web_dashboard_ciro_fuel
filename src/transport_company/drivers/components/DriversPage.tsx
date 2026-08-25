import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DriversStats } from './DriversStats';
import { DesktopDriversTable } from './DesktopDriversTable';
import { MobileDriversList } from './MobileDriversList';
import { FilterToolbar } from '@/components/ui/FilterToolbar';

const FILTERS = ['الكل', 'نشطين', 'غير نشطين'];

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

export function DriversPage() {
  const [activeTab, setActiveTab] = useState('الكل');
  const navigate = useNavigate();

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col gap-1 text-right">
          <h1 className="text-[#162155] font-black text-2xl">السائقين</h1>
          <p className="text-slate-500 font-bold text-sm">إدارة ومتابعة سائقين و أسطول شاحنات نقل الوقود</p>
        </div>

        <button onClick={() => navigate('/transport/drivers/add')} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
          <img src="/transportCompany/DriverPage/plus.svg" alt="Add" className="w-4 h-4" />
          إضافة سائق
        </button>
      </div>

      {/* Stats Row */}
      <div className="mb-6">
        <DriversStats />
      </div>

      {/* Tabs */}
      <div className="flex mb-6">
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden w-full sm:w-fit bg-white divide-x divide-x-reverse divide-slate-200 shadow-sm">
          {FILTERS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'relative flex-1 sm:flex-none px-4 sm:px-12 py-3 text-sm font-bold transition-colors whitespace-nowrap cursor-pointer text-center',
                  isActive ? 'text-[#162155]' : 'text-slate-500 hover:bg-slate-50'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-driver-tab"
                    className="absolute inset-0 bg-[#EEF2FF] border-b-2 border-blue-600"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Section (Table & Actions) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden pt-4 pb-0">

        {/* Top: Action Bar */}
        <FilterToolbar 
          searchPlaceholder="ابحث بكود السائق أو الشاحنة..."
          onExport={() => console.log('Export Drivers')}
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
    // </div>
  );
}
