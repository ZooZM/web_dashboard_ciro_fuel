import { Phone } from 'lucide-react';

export function AffiliatedCompanyCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 w-full h-fit">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/sideBar/stations.svg" alt="" className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-[#162155] font-bold text-base">الشركة التابع لها</span>
        </div>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm shrink-0">
          <img src="/transportCompany/orderPage/orderDetails/link.svg" alt="" className="w-4 h-4" />
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-col items-center justify-center gap-2 mt-2">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
          <img src="/transportCompany/DriverPage/editDriver/truck.svg" alt="" className="w-8 h-8 object-contain filter brightness-0 invert" />
        </div>
        <span className="text-[#162155] font-black text-base mt-2">شركة النقل المتحدة</span>
        <span className="text-slate-500 text-sm font-bold">رقم الجوال <span className="text-[#162155] mx-1" dir="ltr">05xxxxxxxx</span></span>
      </div>

      {/* Button */}
      <button className="w-full border border-slate-200 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors mt-2">
        <Phone className="w-4 h-4 text-blue-600" />
        <span className="text-blue-600 font-bold text-sm">تواصل مع المسؤول</span>
      </button>
    </div>
  );
}
