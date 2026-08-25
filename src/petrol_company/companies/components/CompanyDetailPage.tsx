import { useNavigate, useParams } from 'react-router-dom';
import { CompanyDetailStats } from './CompanyDetailStats';
import { CompanyRegionsCard } from './CompanyRegionsCard';
import { CompanyContactCard } from './CompanyContactCard';
import { CompanyRecentTripsCard } from './CompanyRecentTripsCard';

export function CompanyDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full border border-[#E7E9EF] rounded-2xl" dir="rtl">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={() => navigate('/petrolCompany/companies')}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/transporters/details/chevronRight.svg" alt="Back" className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          الشركات الناقلة / شركة النقل المتحدة
        </span>
      </div>

      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 shadow-sm shadow-blue-200">
            <img src="/petrolCompany/transporters/details/truck.svg" alt="Logo" className="w-7 h-7" />
          </div>
        
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900">شركة النقل المتحدة</span>
              <span className="px-4 py-2 bg-[#DCFCE7] text-[#16A34A] rounded-xl text-sm font-bold border border-green-100">
                نشط
              </span>
            </div>
            <span className="text-sm font-bold text-slate-400 mt-0.5">TRN-2024-011 · تاريخ الانضمام 2022/01/15</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-5 py-2 bg-[#FEF2F2] text-[#DC2626] rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-2 border border-red-100">
            <img src="/petrolCompany/transporters/details/X.svg" alt="Cancel" className="w-4 h-4 mt-0.5" />
            إلغاء التعاقد
          </button>
        </div>

      </div>

      {/* Stats Grid */}
      <CompanyDetailStats />

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Right Column (Wider) - Regions */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <CompanyRegionsCard />
        </div>

        {/* Left Column (Narrower) */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 self-start">
          <CompanyContactCard />
          <CompanyRecentTripsCard />
        </div>

      </div>
    </div>
  );
}
