import { useNavigate } from 'react-router-dom';
import { AdminTransportCompaniesStats } from './AdminTransportCompaniesStats';
import { AdminTransportCompanyListItem, type AdminTransportCompany } from './AdminTransportCompanyListItem';

const MOCK_COMPANIES: AdminTransportCompany[] = [
  { id: 'TRN-2024-011', name: 'شركة النقل المتحدة', logo: '/Admin/transporter/blueTruck.svg', isActive: true, areasCount: 6, ordersPerMonth: 132 },
  { id: 'TRN-2024-011', name: 'شركة النقل المتحدة', logo: '/Admin/transporter/blueTruck.svg', isActive: true, areasCount: 6, ordersPerMonth: 132 },
  { id: 'TRN-2024-011', name: 'شركة النقل المتحدة', logo: '/Admin/transporter/blueTruck.svg', isActive: true, areasCount: 6, ordersPerMonth: 132 },
  { id: 'TRN-2024-011', name: 'شركة النقل المتحدة', logo: '/Admin/transporter/blueTruck.svg', isActive: false, areasCount: 6, ordersPerMonth: 132 },
];

export function AdminTransportCompaniesPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-[calc(100vh-6rem)]" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col text-right">
          <h1 className="text-2xl font-black text-[#162155] mb-1">الشركات الناقلة</h1>
          <p className="text-sm font-semibold text-[#858C95]">
            شركات النقل المتعاقدة معك، ومناطق التغطية المخصصة لكل شركة
          </p>
        </div>
        <button 
          onClick={() => navigate('/admin/transport-companies/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
        >
          <img src="/petrolCompany/transporters/plus.svg" alt="Add" className="w-4 h-4" />
          إضافة ناقل
        </button>
      </div>

      {/* Stats Grid */}
      <AdminTransportCompaniesStats />

      {/* Main Content Area */}
      <div className="bg-white border border-[#E7E9EF] rounded-2xl shadow-sm flex flex-col p-4 mb-8">
        
        {/* List of Companies */}
        <div className="flex flex-col border border-slate-100 rounded-xl overflow-hidden">
          {MOCK_COMPANIES.map((company, index) => (
            <AdminTransportCompanyListItem 
              key={index} 
              company={company} 
              isLast={index === MOCK_COMPANIES.length - 1} 
            />
          ))}
        </div>

      </div>
    </div>
  );
}
