import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FuelExchangeStats } from '@/petrol_company/fuel_exchange/components/FuelExchangeStats';
import { FuelExchangeListItem } from '@/petrol_company/fuel_exchange/components/FuelExchangeListItem';

const STAT_CARDS = [
  {
    title: 'طلبات قيد الانتظار',
    value: '4',
    icon: '/petrolCompany/requests/arrowUp.svg',
    iconBgClass: 'bg-blue-50',
    valueColor: 'text-slate-900',
    titleColor: 'text-slate-500'
  },
  {
    title: 'تم القبول (اليوم)',
    value: '2',
    icon: '/petrolCompany/requests/arrowDown.svg',
    iconBgClass: 'bg-orange-50',
    valueColor: 'text-slate-900',
    titleColor: 'text-slate-500'
  },
  {
    title: 'تم القبول (الشهر)',
    value: '15',
    icon: '/petrolCompany/requests/rightCheck.svg',
    iconBgClass: 'bg-emerald-50',
    valueColor: 'text-slate-900',
    titleColor: 'text-slate-500'
  },
];

export const MOCK_REQUESTS = [
  { id: '1', category: 'الطلبات', code: 'REQ-2024-011', companyName: 'الطاقة الحديثة', logo: '/petrolCompany/requests/petro-aman.jpg', fuelType: 'بنزين 95', volume: '42,000', price: '2.30', total: '96,600', time: 'أمس', clock: '09:20 ص', status: 'awaiting_response' },
  { id: '2', category: 'الطلبات', code: 'REQ-2024-012', companyName: 'الطاقة الحديثة', logo: '/petrolCompany/requests/petro-aman.jpg', fuelType: 'بنزين 91', volume: '30,000', price: '2.18', total: '65,400', time: 'أمس', clock: '10:00 ص', status: 'accepted' },
  { id: '3', category: 'الطلبات', code: 'REQ-2024-013', companyName: 'الطاقة الحديثة', logo: '/petrolCompany/requests/petro-aman.jpg', fuelType: 'ديزل', volume: '50,000', price: '1.15', total: '57,500', time: 'أمس', clock: '11:30 ص', status: 'accepted' },
  { id: '4', category: 'الطلبات', code: 'REQ-2024-014', companyName: 'الطاقة الحديثة', logo: '/petrolCompany/requests/petro-aman.jpg', fuelType: 'بنزين 95', volume: '20,000', price: '2.30', total: '46,000', time: 'اليوم', clock: '08:15 ص', status: 'accepted' },
  { id: '5', category: 'الطلبات', code: 'REQ-2024-015', companyName: 'الطاقة الحديثة', logo: '/petrolCompany/requests/petro-aman.jpg', fuelType: 'بنزين 91', volume: '25,000', price: '2.18', total: '54,500', time: 'اليوم', clock: '09:45 ص', status: 'accepted' },
  { id: '6', category: 'الطلبات', code: 'REQ-2024-016', companyName: 'الطاقة الحديثة', logo: '/petrolCompany/requests/petro-aman.jpg', fuelType: 'ديزل', volume: '40,000', price: '1.15', total: '46,000', time: 'اليوم', clock: '11:10 ص', status: 'awaiting_response' },
];

export function AdminFuelExchangePage() {
  const navigate = useNavigate();

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] min-h-full font-sans border border-[#E7E9EF] rounded-2xl" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col items-start text-right">
          <h1 className="text-2xl font-black text-slate-900">تبادل الوقود بين الشركات</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">إدارة كافة طلبات توريد الوقود بين الشركات في المنصة</p>
        </div>
      </div>

      {/* Stats Cards */}
      <FuelExchangeStats cards={STAT_CARDS} />

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-6">

        {/* Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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
          {MOCK_REQUESTS.map((req) => (
            <div key={req.id} onClick={() => navigate(`/admin/fuel-exchange/${req.id}`)} className="cursor-pointer">
              <FuelExchangeListItem request={req} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
