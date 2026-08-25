import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AdminPetrolCompaniesStats } from './AdminPetrolCompaniesStats';
import { AdminPetrolCompanyListItem, type AdminPetrolCompany } from './AdminPetrolCompanyListItem';
import { AdminOwnerListItem, type AdminStationOwner } from './AdminOwnerListItem';
import { AdminStationListItem, type AdminStation } from './AdminStationListItem';

const MOCK_COMPANIES: AdminPetrolCompany[] = [
  { id: 'PC-2024-011', name: 'بترو أمان', logo: '/Admin/Brands/petroAman.jpg', isActive: true, ownersCount: 6, stationsCount: 14, requestsPerMonth: 132 },
  { id: 'PC-2024-011', name: 'بترو أمان', logo: '/Admin/Brands/petroAman.jpg', isActive: true, ownersCount: 6, stationsCount: 14, requestsPerMonth: 132 },
  { id: 'PC-2024-011', name: 'بترو أمان', logo: '/Admin/Brands/petroAman.jpg', isActive: true, ownersCount: 6, stationsCount: 14, requestsPerMonth: 132 },
  { id: 'PC-2024-011', name: 'بترو أمان', logo: '/Admin/Brands/petroAman.jpg', isActive: true, ownersCount: 6, stationsCount: 14, requestsPerMonth: 132 },
  { id: 'PC-2024-011', name: 'بترو أمان', logo: '/Admin/Brands/petroAman.jpg', isActive: true, ownersCount: 6, stationsCount: 14, requestsPerMonth: 132 },
];

const MOCK_OWNERS: AdminStationOwner[] = [
  { id: 'TRN-2024-011', name: 'محمد أحمد', isActive: true, stationsCount: 6, ordersPerMonth: 132 },
  { id: 'TRN-2024-011', name: 'محمد أحمد', isActive: true, stationsCount: 6, ordersPerMonth: 132 },
  { id: 'TRN-2024-011', name: 'محمد أحمد', isActive: true, stationsCount: 6, ordersPerMonth: 132 },
  { id: 'TRN-2024-011', name: 'محمد أحمد', isActive: true, stationsCount: 6, ordersPerMonth: 132 },
];

const MOCK_STATIONS: AdminStation[] = [
  { id: 'STA-2024-011', name: 'الرحاب', isActive: true, volumePerMonth: '78,400', ordersPerMonth: 132 },
  { id: 'STA-2024-011', name: 'الرحاب', isActive: true, volumePerMonth: '78,400', ordersPerMonth: 132 },
  { id: 'STA-2024-011', name: 'الرحاب', isActive: true, volumePerMonth: '78,400', ordersPerMonth: 132 },
  { id: 'STA-2024-011', name: 'الرحاب', isActive: true, volumePerMonth: '78,400', ordersPerMonth: 132 },
  { id: 'STA-2024-011', name: 'الرحاب', isActive: true, volumePerMonth: '78,400', ordersPerMonth: 132 },
];

export function AdminPetrolCompaniesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'companies' | 'owners' | 'stations'>('companies');

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'companies': return 'ابحث بكود أو إسم الشركة...';
      case 'owners': return 'ابحث بكود أو إسم المالك...';
      case 'stations': return 'ابحث بكود أو إسم المحطة...';
    }
  };

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-[calc(100vh-6rem)]" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col text-right">
          <h1 className="text-2xl font-black text-slate-900 mb-1">شركات البترول</h1>
          <p className="text-sm font-semibold text-slate-500">
            شركات البترول و شيل البياض اللي تحت حطات
          </p>
        </div>
        <button 
          onClick={() => navigate('/admin/petrol-companies/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
        >
          <img src="/petrolCompany/transporters/plus.svg" alt="Add" className="w-4 h-4" />
          إضافة شركة
        </button>
      </div>

      {/* Stats Grid */}
      <AdminPetrolCompaniesStats activeTab={activeTab} />

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col p-4 mb-8">
        
        {/* Controls: Search and Tabs */}
        <div className={cn(
          "flex flex-col md:flex-row items-center justify-between gap-4 mb-4 transition-all"
        )}>

          {/* Tabs */}
          <div className="flex items-center rounded-xl border border-slate-200 w-full md:w-[300px] h-[40px] relative overflow-hidden isolate bg-white">
            {[
              { id: 'companies', label: 'الشركات' },
              { id: 'owners', label: 'الملاك' },
              { id: 'stations', label: 'المحطات' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "relative flex-1 w-full h-full text-xs font-bold transition-colors duration-300 z-10",
                  activeTab === tab.id ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabIndicatorAdminPetrol"
                    className="absolute inset-0 bg-blue-100 border-b-2 border-blue-600 shadow-sm z-[-1]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {tab.label}
              </button>
            ))}
          </div>
              

                      
          {/* Search */}
          <div className="relative w-full md:w-[300px] h-[40px]">
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <img src="/petrolCompany/station/search.svg" alt="Search" className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder={getSearchPlaceholder()} 
              className="w-full h-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* List of Companies */}
        {activeTab === 'companies' && (
          <div className="flex flex-col border border-slate-100 rounded-xl overflow-hidden">
            {MOCK_COMPANIES.map((company, index) => (
              <AdminPetrolCompanyListItem 
                key={index} 
                company={company} 
                isLast={index === MOCK_COMPANIES.length - 1} 
              />
            ))}
          </div>
        )}

        {/* List of Owners */}
        {activeTab === 'owners' && (
          <div className="flex flex-col border border-slate-100 rounded-xl overflow-hidden">
            {MOCK_OWNERS.map((owner, index) => (
              <AdminOwnerListItem 
                key={index} 
                owner={owner} 
                isLast={index === MOCK_OWNERS.length - 1} 
              />
            ))}
          </div>
        )}
        
        {/* List of Stations */}
        {activeTab === 'stations' && (
          <div className="flex flex-col border border-slate-100 rounded-xl overflow-hidden">
            {MOCK_STATIONS.map((station, index) => (
              <AdminStationListItem 
                key={index} 
                station={station} 
                isLast={index === MOCK_STATIONS.length - 1} 
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
