import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface AdminPetrolCompany {
  id: string;
  name: string;
  logo: string;
  isActive: boolean;
  ownersCount: number;
  stationsCount: number;
  requestsPerMonth: number;
}

interface AdminPetrolCompanyListItemProps {
  company: AdminPetrolCompany;
  isLast?: boolean;
}

export function AdminPetrolCompanyListItem({ company, isLast }: AdminPetrolCompanyListItemProps) {
  const navigate = useNavigate();
  return (
    <div className={cn(
      "flex flex-col md:flex-row items-center justify-between p-4 gap-4 transition-colors hover:bg-slate-50",
      !isLast && "border-b border-slate-100"
    )}>
      
      {/* Right section: Logo, Name, ID */}
      <div className="flex items-center gap-3 w-full md:w-[250px] shrink-0">
        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 p-0.5 overflow-hidden">
          <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-full" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-900 leading-tight mb-0.5">{company.name}</span>
          <span className="text-[10px] font-bold text-slate-400">{company.id}</span>
        </div>
      </div>

      {/* Middle section: Stats and Status */}
      <div className="flex items-center justify-between bg-gray-100 rounded-2xl px-6 py-2.5 w-full flex-1 max-w-[400px] mx-auto gap-4">
        
        {/* Status Badge */}
        <div className={cn(
          "px-4 py-1.5 rounded-xl text-xs font-bold shrink-0",
          company.isActive 
            ? "bg-green-100/50 text-green-600" 
            : "bg-red-100/50 text-red-500"
        )}>
          {company.isActive ? "نشط" : "غير نشط"}
        </div>
        
        {/* Owners count */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-sm font-black text-slate-900">{company.ownersCount}</span>
          <span className="text-[10px] font-bold text-slate-500">ملاك محطات</span>
        </div>

        {/* Stations count */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-sm font-black text-slate-900">{company.stationsCount}</span>
          <span className="text-[10px] font-bold text-slate-500">محطة</span>
        </div>

        {/* Requests per month */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-sm font-black text-slate-900">{company.requestsPerMonth}</span>
          <span className="text-[10px] font-bold text-slate-500">طلب/شهر</span>
        </div>
        
      </div>

      {/* Left section: Action Button */}
      <div className="w-full md:w-auto flex justify-end shrink-0">
        <button 
          onClick={() => navigate(`/admin/petrol-companies/${company.id}`)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-blue-100 text-blue-600 bg-white hover:bg-blue-50 transition-colors w-full md:w-auto shadow-sm"
        >
          <img src="/petrolCompany/station/arrowRight.svg" alt="" className="w-4 h-4" />
          <span className="text-xs font-bold">عرض التفاصيل</span>
        </button>
      </div>

    </div>
  );
}
