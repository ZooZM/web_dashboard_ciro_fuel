import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DriversStats } from './DriversStats';
import { DesktopDriversTable } from './DesktopDriversTable';
import { MobileDriversList } from './MobileDriversList';

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 px-4">
          
          {/* Right Side: Arrange, Filter, Search */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto">

            {/* Arrange */}
            <button className="flex-1 md:flex-none flex justify-center items-center gap-2 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shrink-0">
              <img src="/transportCompany/orderPage/arrange.svg" alt="" className="w-4 h-4 hover:opacity-70" />
              ترتيب
            </button>

            {/* Filter */}
            <button className="flex-1 md:flex-none flex justify-center items-center gap-2 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shrink-0">
              <img src="/transportCompany/orderPage/filter.svg" alt="" className="w-4 h-4 hover:opacity-70" />
              تصفية
            </button>

            {/* Search */}
            <div className="relative w-full border-r pr-4 md:w-auto flex-1 min-w-[250px] order-last md:order-none">
              <input 
                type="text" 
                placeholder="ابحث بكود السائق أو الشاحنة..." 
                className="w-full pr-8 pl-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 placeholder:text-slate-400"
              />
              <img src="/transportCompany/orderPage/search.svg" alt="" className="w-4 h-4 absolute right-6 top-1/2 -translate-y-1/2 opacity-50" />
            </div>
          </div>

          {/* Left Side: Export */}
          <button className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#DCFCE7] transition-colors shrink-0">
            <img src="/transportCompany/orderPage/download.svg" alt="" className="w-4 h-4" />
            تصدير
          </button>

        </div>

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
