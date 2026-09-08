import { useNavigate, useParams } from 'react-router-dom';
import { AdminCompanyAdminCard } from '@/admin/petrol_companies/components/AdminCompanyAdminCard';
import { Role } from '@/constants/roles';
import { CompanyRecentTripsCard } from '@/petrol_company/companies/components/CompanyRecentTripsCard';
import { AdminTransportCompanyInfoCard } from './AdminTransportCompanyInfoCard';
import { AdminCompanyDriversCard } from './AdminCompanyDriversCard';
import { useState } from 'react';
import { cn } from '@/lib/utils';


export function AdminTransportCompanyDetailsPage() {
  const navigate = useNavigate();
  // The rest of this screen is still the unwired mock feature 009 disclosed (the company
  // name, rating and info card are all literals). The route param IS real, though, so the
  // administrator card below shows this company's genuine sign-in account — the one thing
  // an operator cannot find anywhere else in the dashboard.
  const { id: companyId } = useParams<{ id: string }>();
  const [isActive, setIsActive] = useState(true);


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
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shrink-0 border-2 border-white shadow-sm overflow-hidden p-2">
            <img src="/petrolCompany/transporters/details/truck.svg" alt="Logo" className="w-full h-full object-contain" />
          </div>

          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-[#162155]">شركة النقل المتحدة</span>
              <span
                className={cn(
                  "px-4 py-1.5  rounded-xl text-xs font-bold",
                  isActive
                    ? "bg-green-100/50 text-green-600"
                    : "bg-red-50 text-red-600"
                )}>
                {isActive ? 'نشط' : 'موقوف'}
              </span>
            </div>
            <span className="text-sm font-bold text-slate-400 mt-0.5">TRN-2024-011 · تاريخ الانضمام 2022/01/15</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              isActive
                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 shadow-sm"
                : "bg-green-100 text-green-600 hover:bg-green-200 border border-[#E7E9EF] shadow-sm"
            )}>

            <img src={isActive ? "/petrolCompany/owner/pause (1).svg" : "/petrolCompany/owner/pause.svg"} alt="" className="w-4 h-4" />
            {isActive ? "إيقاف المحطة" : "تشغيل المحطة"}

          </button>
        </div>

      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
          <div className="flex flex-col text-right order-2">
            <span className="text-[#858C95] text-xs font-bold mb-1">المناطق المغطاة</span>
            <span className="text-[#162155] text-2xl font-black">5</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 order-1">
            <img src="/petrolCompany/requests/pin.svg" alt="" className="w-6 h-6 object-contain" />
          </div>
        </div>

        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
          <div className="flex flex-col text-right order-2">
            <span className="text-[#858C95] text-xs font-bold mb-1">طلبات الشهر</span>
            <span className="text-[#162155] text-2xl font-black">86</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0 order-1">
            <img src="/Admin/Brands/order.svg" alt="" className="w-6 h-6 object-contain" />
          </div>
        </div>

        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
          <div className="flex flex-col text-right order-2">
            <span className="text-[#858C95] text-xs font-bold mb-1">متوسط وقت التسليم</span>
            <span className="text-[#162155] text-2xl font-black">27<span className="text-sm text-slate-600 mr-1">د</span></span>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0 order-1">
            <img src="/transportCompany/orderPage/AssignPage/hour.svg" alt="" className="w-6 h-6 object-contain" />
          </div>
        </div>

        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
          <div className="flex flex-col text-right order-2">
            <span className="text-[#858C95] text-xs font-bold mb-1">تقييم الأداء </span>
            <span className="text-[#162155] text-2xl font-black">4.7</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0 order-1">
            <img src="/petrolCompany/transporters/details/star.svg" alt="" className="w-6 h-6 object-contain" />
          </div>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Right Column (Wider) - Info, Regions, Drivers */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <AdminTransportCompanyInfoCard />
          {companyId && (
            <AdminCompanyAdminCard companyId={companyId} role={Role.TRANSPORT_COMPANY_ADMIN} />
          )}
          {/* spec 013 Phase 7 note: `CompanyRegionsCard`/`CompanyContactCard`
              (petrol_company/companies) were made real this phase — the regions card now
              calls `PUT /companies/:id/regions`, gated `@Roles(FUEL_COMPANY_ADMIN)`, which
              would 403 for this SUPER_ADMIN oversight surface. Reuse removed rather than
              left half-working; out of this feature's scope (a later operator-oversight
              phase, 016, can build its own SUPER_ADMIN-facing read path). */}
          <AdminCompanyDriversCard />
        </div>

        {/* Left Column (Narrower) - Contact & Recent Trips */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 self-start">
          <CompanyRecentTripsCard />
        </div>

      </div>
    </div>
  );
}
