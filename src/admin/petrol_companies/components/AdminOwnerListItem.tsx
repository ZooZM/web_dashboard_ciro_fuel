import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export interface AdminStationOwner {
  id: string;
  name: string;
  isActive: boolean;
  stationsCount: number;
  ordersPerMonth: number;
}

interface AdminOwnerListItemProps {
  owner: AdminStationOwner;
  isLast?: boolean;
}

export function AdminOwnerListItem({ owner, isLast }: AdminOwnerListItemProps) {
  const navigate = useNavigate();
  
  return (
    <div className={cn(
      "flex flex-col md:flex-row items-center justify-between p-4 gap-4 transition-colors hover:bg-slate-50",
      !isLast && "border-b border-slate-100"
    )}>
      
      {/* Right section: Avatar, Name, ID */}
      <div className="flex items-center gap-3 w-full md:w-[250px] shrink-0">
        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
          <img src="/petrolCompany/requests/details/profile.png" alt={owner.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-900 leading-tight mb-0.5">{owner.name}</span>
          <span className="text-[10px] font-bold text-slate-400">{owner.id}</span>
        </div>
      </div>

      {/* Middle section: Stats and Status */}
      <div className="flex items-center justify-center gap-6 w-full max-w-[300px] bg-gray-100 rounded-2xl p-3 flex-1 mx-auto">
        
        {/* Status Badge */}
        <div className={cn(
          "px-4 py-2 rounded-xl text-xs font-bold border",
          owner.isActive 
            ? "bg-green-100/50 text-green-600 border-green-100" 
            : "bg-red-50 text-red-500 border-red-100"
        )}>
          {owner.isActive ? "نشط" : "غير نشط"}
        </div>
        
        <div className="h-8 w-px bg-slate-200"></div>
        
        {/* Stations Count */}
        <div className="flex flex-col items-center justify-center text-center min-w-[70px]">
          <span className="text-sm font-black text-slate-900">{owner.stationsCount}</span>
          <span className="text-[10px] font-bold text-slate-500">محطات</span>
        </div>

        {/* Orders per month */}
        <div className="flex flex-col items-center justify-center text-center min-w-[70px]">
          <span className="text-sm font-black text-slate-900">{owner.ordersPerMonth}</span>
          <span className="text-[10px] font-bold text-slate-500">طلب/شهر</span>
        </div>
        
      </div>

      {/* Left section: Action Button */}
      <div className="w-full md:w-auto flex justify-end shrink-0">
        <button 
          onClick={() => navigate(`/admin/petrol-companies/owners/${owner.id}`)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-blue-100 text-blue-600 bg-white hover:bg-blue-50 transition-colors w-full md:w-auto shadow-sm"
        >
          <img src="/petrolCompany/station/arrowRight.svg" alt="" className="w-4 h-4" />
          <span className="text-xs font-bold">عرض التفاصيل</span>
        </button>
      </div>

    </div>
  );
}
