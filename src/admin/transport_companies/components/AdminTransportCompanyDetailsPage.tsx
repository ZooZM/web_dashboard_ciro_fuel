import { useNavigate } from 'react-router-dom';
import { CompanyContactCard } from '@/petrol_company/companies/components/CompanyContactCard';
import { CompanyRegionsCard } from '@/petrol_company/companies/components/CompanyRegionsCard';
import { CompanyRecentTripsCard } from '@/petrol_company/companies/components/CompanyRecentTripsCard';
import { AdminTransportCompanyInfoCard } from './AdminTransportCompanyInfoCard';
import { AdminCompanyDriversCard } from './AdminCompanyDriversCard';

export function AdminTransportCompanyDetailsPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full border border-[#E7E9EF] rounded-2xl" dir="rtl">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={() => navigate('/admin/transport-companies')}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E9EF] rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/requests/details/chevronRight.svg" alt="Back" className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          الشركات الناقلة / شركة النقل المتحدة
        </span>
      </div>

      {/* Header Card */}
      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border-2 border-white shadow-sm overflow-hidden p-2">
            <img src="/Admin/transporter/filledTruck.svg" alt="Logo" className="w-full h-full object-contain" />
          </div>
        
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-[#162155]">شركة النقل المتحدة</span>
              <span className="px-4 py-1.5 bg-green-100/50 text-green-600 rounded-xl text-xs font-bold">
                نشط
              </span>
            </div>
            <span className="text-sm font-bold text-slate-400 mt-0.5">TRN-2024-011 · تاريخ الانضمام 2022/01/15</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-5 py-2.5 bg-white text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2 border border-[#E7E9EF] shadow-sm">
            <img src="/admin/petrolCompany/details/edit.svg" alt="Edit" className="w-4 h-4" onError={(e) => {
              (e.target as HTMLImageElement).src = '/petrolCompany/station/edit.svg';
            }} />
            تعديل
          </button>
          <button className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-2 border border-red-100 shadow-sm">
            <img src="/petrolCompany/transporters/details/X.svg" alt="Cancel" className="w-4 h-4 mt-0.5 filter" style={{ filter: 'invert(27%) sepia(91%) saturate(2311%) hue-rotate(350deg) brightness(97%) contrast(92%)' }} />
            حذف الشركة
          </button>
        </div>

      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex flex-col text-right order-2">
            <span className="text-[#858C95] text-xs font-bold mb-1">متوسط زمن الاستجابة</span>
            <span className="text-[#162155] text-2xl font-black">54<span className="text-sm text-slate-500 mr-1">دقيقة</span></span>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0 order-1">
            <img src="/petrolCompany/transporters/details/time.svg" alt="" className="w-6 h-6 object-contain" />
          </div>
        </div>

        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex flex-col text-right order-2">
            <span className="text-[#858C95] text-xs font-bold mb-1">التقييم العام</span>
            <span className="text-[#162155] text-2xl font-black">4.9<span className="text-sm text-slate-500 mr-1">/ 5.0</span></span>
          </div>
          <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center shrink-0 order-1">
            <img src="/petrolCompany/transporters/details/star.svg" alt="" className="w-6 h-6 object-contain" />
          </div>
        </div>

        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex flex-col text-right order-2">
            <span className="text-[#858C95] text-xs font-bold mb-1">إجمالي الطلبات المنفذة</span>
            <span className="text-[#162155] text-2xl font-black">13,100</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 order-1">
            <img src="/Admin/transporter/order.svg" alt="" className="w-6 h-6 object-contain filter" style={{ filter: 'invert(39%) sepia(91%) saturate(2311%) hue-rotate(210deg) brightness(97%) contrast(92%)' }} />
          </div>
        </div>

        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex flex-col text-right order-2">
            <span className="text-[#858C95] text-xs font-bold mb-1">المناطق المغطاة</span>
            <span className="text-[#162155] text-2xl font-black">6</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0 order-1">
            <img src="/Admin/transporter/pin.svg" alt="" className="w-6 h-6 object-contain filter" style={{ filter: 'invert(53%) sepia(66%) saturate(2222%) hue-rotate(329deg) brightness(97%) contrast(89%)' }} />
          </div>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Right Column (Wider) - Info, Regions, Drivers */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <AdminTransportCompanyInfoCard />
          <CompanyRegionsCard />
          <AdminCompanyDriversCard />
        </div>

        {/* Left Column (Narrower) - Contact & Recent Trips */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 self-start">
          <CompanyContactCard />
          <CompanyRecentTripsCard />
        </div>

      </div>
    </div>
  );
}
