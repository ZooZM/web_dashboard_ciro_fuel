import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface AdminTransportCompany {
  id: string;
  name: string;
  logo: string;
  isActive: boolean;
  areasCount: number;
  ordersPerMonth: number;
}

interface AdminTransportCompanyListItemProps {
  company: AdminTransportCompany;
  isLast?: boolean;
}

export function AdminTransportCompanyListItem({ company, isLast }: AdminTransportCompanyListItemProps) {
  const navigate = useNavigate();
  return (
    <div className={cn(
      "flex flex-col md:flex-row items-center justify-between p-4 gap-4 transition-colors hover:bg-slate-50",
      !isLast && "border-b border-slate-100"
    )}>
      
      {/* Right section: Logo, Name, ID */}
      <div className="flex items-center justify-end gap-3 w-full md:w-[250px] shrink-0 order-3 md:order-1 text-right">
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-900 leading-tight mb-0.5">{company.name}</span>
          <span className="text-[10px] font-bold text-slate-400">{company.id}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 p-2 overflow-hidden border-2 border-white shadow-sm">
          <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Middle section: Stats and Status */}
      <div className="flex items-center justify-between bg-[#F8FAFC] rounded-2xl px-8 py-3 w-full flex-1 max-w-[350px] mx-auto order-2">
        
        {/* Status Badge */}
        <div className={cn(
          "px-4 py-1.5 rounded-xl text-xs font-bold shrink-0 text-center",
          company.isActive 
            ? "bg-[#E4F7EC] text-[#12A150]" 
            : "bg-[#FEF2F2] text-[#EF4444]"
        )}>
          {company.isActive ? "نشط" : "غير نشط"}
        </div>
        
        {/* Areas count */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-sm font-black text-slate-900">{company.areasCount}</span>
          <span className="text-[10px] font-bold text-slate-500">مناطق</span>
        </div>

        {/* Orders per month */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-sm font-black text-slate-900">{company.ordersPerMonth}</span>
          <span className="text-[10px] font-bold text-slate-500">طلب/شهر</span>
        </div>
        
      </div>

      {/* Left section: Action Button */}
      <div className="w-full md:w-auto flex justify-end shrink-0 order-1 md:order-3">
        <button 
          onClick={() => navigate(`/admin/transport-companies/${company.id}`)}
          className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl border border-blue-100 text-blue-600 bg-white hover:bg-blue-50 transition-colors w-full md:w-auto shadow-sm"
        >
          <img src="/petrolCompany/station/arrowRight.svg" alt="" className="w-4 h-4" />
          <span className="text-xs font-bold">عرض التفاصيل</span>
        </button>
      </div>

    </div>
  );
}
