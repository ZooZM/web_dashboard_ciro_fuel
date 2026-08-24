import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { StationListStats } from './StationListStats';
import { StationOwnerListItem, type StationOwner } from './StationOwnerListItem';
import { StationListItem, type Station } from './StationListItem';

const MOCK_OWNERS: StationOwner[] = [
  { id: 'TRN-2024-011', name: 'محمد أحمد', isActive: true, stationsCount: 6, ordersPerMonth: 132 },
  { id: 'TRN-2024-011', name: 'محمد أحمد', isActive: true, stationsCount: 6, ordersPerMonth: 132 },
  { id: 'TRN-2024-011', name: 'محمد أحمد', isActive: true, stationsCount: 6, ordersPerMonth: 132 },
  { id: 'TRN-2024-011', name: 'محمد أحمد', isActive: false, stationsCount: 6, ordersPerMonth: 132 },
];

const MOCK_STATIONS: Station[] = [
  { id: 'STA-2024-011', name: 'الرحاب', isActive: true, volumePerMonth: '78,400', ordersPerMonth: 132 },
  { id: 'STA-2024-011', name: 'الرحاب', isActive: true, volumePerMonth: '78,400', ordersPerMonth: 132 },
  { id: 'STA-2024-011', name: 'الرحاب', isActive: true, volumePerMonth: '78,400', ordersPerMonth: 132 },
  { id: 'STA-2024-011', name: 'الرحاب', isActive: true, volumePerMonth: '78,400', ordersPerMonth: 132 },
  { id: 'STA-2024-011', name: 'الرحاب', isActive: false, volumePerMonth: '78,400', ordersPerMonth: 132 },
  { id: 'STA-2024-011', name: 'الرحاب', isActive: false, volumePerMonth: '78,400', ordersPerMonth: 132 },
  { id: 'STA-2024-011', name: 'الرحاب', isActive: true, volumePerMonth: '78,400', ordersPerMonth: 132 },
  { id: 'STA-2024-011', name: 'الرحاب', isActive: true, volumePerMonth: '78,400', ordersPerMonth: 132 },
];

export function StationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'owners' | 'stations'>('owners');

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col text-right">
          <h1 className="text-2xl font-black text-slate-900 mb-1">ملاك المحطات</h1>
          <p className="text-sm font-semibold text-slate-500">
            ملاك محطات الفرانشايز التابعة لبراندك، ومحطات كل مالك
          </p>
        </div>
        <button 
          onClick={() => navigate('/petrolCompany/stations/owners/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
        >
          <img src="/petrolCompany/transporters/plus.svg" alt="Add" className="w-4 h-4" />
          إضافة مالك
        </button>
      </div>

      {/* Stats Grid */}
      <StationListStats />

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col p-4 mb-8">
        
        {/* Controls: Search and Tabs */}
        <div className={cn(
          "flex flex-col md:flex-row-reverse items-center justify-between gap-4 mb-4 transition-all",
          activeTab === 'stations' ? "md:flex-row-reverse" : ""
        )}>
          
          {/* Search */}
          <div className="relative w-full md:w-[300px] h-[40px]">
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <img src="/petrolCompany/station/search.svg" alt="Search" className="w-4 h-4 " />
            </div>
            <input 
              type="text" 
              placeholder={activeTab === 'owners' ? "ابحث بكود أو إسم المالك..." : "ابحث بكود أو إسم المحطة..."} 
              className="w-full h-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center  rounded-xl border border-slate-200 w-full md:w-[200px] h-[40px]">
            <button 
              onClick={() => setActiveTab('stations')}
              className={cn(
                "flex-1 w-full h-full rounded-lg text-xs font-bold transition-all",
                activeTab === 'stations' ? "bg-blue-100 text-blue-600 border-b-2 border-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              المحطات
            </button>
            <button 
              onClick={() => setActiveTab('owners')}
              className={cn(
                "flex-1 w-full   h-full rounded-lg  text-xs font-bold transition-all",
                activeTab === 'owners' ? "bg-blue-100 text-blue-600 border-b-2 border-blue-600  shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              الملاك
            </button>
          </div>

        </div>

        {/* List of Owners */}
        {activeTab === 'owners' && (
          <div className="flex flex-col border border-slate-100 rounded-xl overflow-hidden">
            {MOCK_OWNERS.map((owner, index) => (
              <StationOwnerListItem 
                key={index} 
                owner={owner} 
                isLast={index === MOCK_OWNERS.length - 1} 
              />
            ))}
          </div>
        )}
        
        {/* Stations Tab */}
        {activeTab === 'stations' && (
          <div className="flex flex-col border border-slate-100 rounded-xl overflow-hidden">
            {MOCK_STATIONS.map((station, index) => (
              <StationListItem 
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
