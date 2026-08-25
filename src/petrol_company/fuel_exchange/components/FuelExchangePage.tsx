import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { NewFuelRequestForm } from './NewFuelRequestForm';
import { FuelExchangeStats } from './FuelExchangeStats';
import { FuelExchangeListItem } from './FuelExchangeListItem';

const STAT_CARDS = [
  {
    title: 'طلبات واردة بانتظار الرد',
    value: '3',
    icon: '/petrolCompany/requests/arrowUp.svg',
    iconBgClass: 'bg-blue-50',
    valueColor: 'text-slate-900',
    titleColor: 'text-slate-500'
  },
  {
    title: 'طلبات صادرة قيد الانتظار',
    value: '1',
    icon: '/petrolCompany/requests/arrowDown.svg',
    iconBgClass: 'bg-orange-50',
    valueColor: 'text-slate-900',
    titleColor: 'text-slate-500'
  },
  {
    title: 'تم القبول (الشهر)',
    value: '9',
    icon: '/petrolCompany/requests/rightCheck.svg',
    iconBgClass: 'bg-green-50',
    valueColor: 'text-slate-900',
    titleColor: 'text-slate-500'
  },
];

const FILTERS = ['الطلبات', 'الصادرات', 'الواردات'];

const MOCK_REQUESTS = [
  // الواردات (Imports)
  { id: '1', category: 'الواردات', code: 'REQ-2024-011', companyName: 'الطاقة الحديثة', logo: '/petrolCompany/requests/petro-aman.jpg', fuelType: 'بنزين 95', volume: '42,000', price: '2.30', total: '96,600', time: 'أمس', clock: '09:20 ص', status: 'awaiting_response' },
  { id: '2', category: 'الواردات', code: 'REQ-2024-012', companyName: 'الطاقة الحديثة', logo: '/petrolCompany/requests/petro-aman.jpg', fuelType: 'بنزين 91', volume: '30,000', price: '2.18', total: '65,400', time: 'أمس', clock: '10:00 ص', status: 'accepted' },
  { id: '3', category: 'الواردات', code: 'REQ-2024-013', companyName: 'الطاقة الحديثة', logo: '/petrolCompany/requests/petro-aman.jpg', fuelType: 'ديزل', volume: '50,000', price: '1.15', total: '57,500', time: 'أمس', clock: '11:30 ص', status: 'accepted' },

  // الصادرات (Exports)
  { id: '4', category: 'الصادرات', code: 'REQ-2024-014', companyName: 'الطاقة الحديثة', logo: '/petrolCompany/requests/petro-aman.jpg', fuelType: 'بنزين 95', volume: '20,000', price: '2.30', total: '46,000', time: 'اليوم', clock: '08:15 ص', status: 'accepted' },
  { id: '5', category: 'الصادرات', code: 'REQ-2024-015', companyName: 'الطاقة الحديثة', logo: '/petrolCompany/requests/petro-aman.jpg', fuelType: 'بنزين 91', volume: '25,000', price: '2.18', total: '54,500', time: 'اليوم', clock: '09:45 ص', status: 'accepted' },
  { id: '6', category: 'الصادرات', code: 'REQ-2024-016', companyName: 'الطاقة الحديثة', logo: '/petrolCompany/requests/petro-aman.jpg', fuelType: 'ديزل', volume: '40,000', price: '1.15', total: '46,000', time: 'اليوم', clock: '11:10 ص', status: 'awaiting_response' },

  // الطلبات (General Requests - could be all or specific ones awaiting action)
  { id: '7', category: 'الطلبات', code: 'REQ-2024-017', companyName: 'الطاقة الحديثة', logo: '/petrolCompany/requests/petro-aman.jpg', fuelType: 'بنزين 95', volume: '42,000', price: '2.30', total: '96,600', time: 'منذ ساعتين', clock: '01:20 م', status: 'accept_request' },
  { id: '8', category: 'الطلبات', code: 'REQ-2024-018', companyName: 'الطاقة الحديثة', logo: '/petrolCompany/requests/petro-aman.jpg', fuelType: 'بنزين 91', volume: '35,000', price: '2.18', total: '76,300', time: 'منذ 3 ساعات', clock: '12:15 م', status: 'accept_request' },
  { id: '9', category: 'الطلبات', code: 'REQ-2024-019', companyName: 'الطاقة الحديثة', logo: '/petrolCompany/requests/petro-aman.jpg', fuelType: 'ديزل', volume: '60,000', price: '1.15', total: '69,000', time: 'منذ 4 ساعات', clock: '11:00 ص', status: 'accept_request' },
];

export function FuelExchangePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('الطلبات');
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);

  // Filter requests based on active tab
  const filteredRequests = MOCK_REQUESTS.filter(req => req.category === activeFilter);

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] min-h-full font-sans border border-[#E7E9EF] rounded-2xl" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col items-start text-right">
          <h1 className="text-2xl font-black text-slate-900">تبادل الوقود بين الشركات</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">طلبات توريد وقود بين شركتك وشركات البترول الشريكة الأخرى</p>
        </div>
        <button 
          onClick={() => setIsCreatingRequest(true)}
          className="flex justify-center items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shrink-0"
        >
          <img src="/petrolCompany/requests/plus.svg" alt="" className="w-4 h-4" />
          طلب جديد
        </button>
      </div>

      {/* New Request Form */}
      {isCreatingRequest && (
        <NewFuelRequestForm 
          onCancel={() => setIsCreatingRequest(false)} 
          onSubmit={() => setIsCreatingRequest(false)} 
        />
      )}

      {/* Stats Cards */}
      {!isCreatingRequest && (
        <FuelExchangeStats cards={STAT_CARDS} />
      )}

      {/* Main Content Area */}
      {!isCreatingRequest && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-6">

        {/* Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

          {/* Tabs */}
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
            {FILTERS.map((filter, idx) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    'px-8 py-2.5 text-sm font-bold transition-colors whitespace-nowrap cursor-pointer',
                    isActive ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'bg-white text-slate-500 hover:bg-slate-50',
                    idx !== FILTERS.length - 1 && 'border-l border-slate-200'
                  )}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="ابحث بكود أو إسم المالك..."
              className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 placeholder:text-slate-400 shadow-sm"
            />
            <img src="/petrolCompany/requests/search.svg" alt="" className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 " />
          </div>

        </div>

        {/* Requests List */}
        <div className="flex flex-col gap-4">
          {filteredRequests.map((req) => (
            <FuelExchangeListItem key={req.id} request={req} />
          ))}
        </div>
      </div>
      )}
    </div>
  );
}
