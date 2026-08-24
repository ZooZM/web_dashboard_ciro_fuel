import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CompanyListStats } from './CompanyListStats';
import { CompanyListItem } from './CompanyListItem';

interface Company {
  id: string;
  name: string;
  isActive: boolean;
  regionsCount: number;
  ordersPerMonth: number;
}

const MOCK_COMPANIES: Company[] = [
  { id: 'TRN-2024-011', name: 'شركة النقل المتحدة', isActive: true, regionsCount: 6, ordersPerMonth: 132 },
  { id: 'TRN-2024-012', name: 'شركة النقل السريع', isActive: true, regionsCount: 4, ordersPerMonth: 85 },
  { id: 'TRN-2024-013', name: 'مؤسسة الطرق اللوجستية', isActive: true, regionsCount: 8, ordersPerMonth: 210 },
  { id: 'TRN-2024-014', name: 'شركة دروب النقل', isActive: false, regionsCount: 2, ordersPerMonth: 0 },
];

export function CompaniesListPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 min-h-full" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-slate-900 mb-1">الشركات الناقلة</h1>
          <p className="text-sm font-semibold text-slate-500">
            شركات النقل المتعاقدة معك، ومناطق التغطية المخصصة لكل شركة
          </p>
        </div>
        <button 
          onClick={() => navigate('/petrolCompany/companies/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2"
        >
          <img src="/petrolCompany/transporters/plus.svg" alt="Add" className="w-4 h-4" />
          إضافة ناقل
        </button>
      </div>

      {/* Stats Grid */}
      <CompanyListStats />

      {/* List Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
        {MOCK_COMPANIES.map((company, index) => (
          <CompanyListItem 
            key={company.id} 
            company={company} 
            isLast={index === MOCK_COMPANIES.length - 1} 
          />
        ))}
      </div>

    </div>
  );
}
