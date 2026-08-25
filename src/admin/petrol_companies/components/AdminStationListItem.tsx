import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface AdminStation {
  id: string;
  name: string;
  isActive: boolean;
  volumePerMonth: string;
  ordersPerMonth: number;
}

interface AdminStationListItemProps {
  station: AdminStation;
  isLast?: boolean;
}

export function AdminStationListItem({ station, isLast }: AdminStationListItemProps) {
  const navigate = useNavigate();
  return (
    <div className={cn(
      "flex flex-col md:flex-row items-center justify-between p-4 gap-4 transition-colors hover:bg-slate-50",
      !isLast && "border-b border-slate-100"
    )}>

      {/* Right section: Avatar, Name, ID */}
      <div className="flex items-center gap-3 w-full md:w-[250px] shrink-0">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
          <img src="/petrolCompany/station/station.svg" alt="" className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-900 leading-tight mb-0.5">{station.name}</span>
          <span className="text-[10px] font-bold text-slate-400">{station.id}</span>
        </div>
      </div>

      {/* Middle section: Stats and Status */}
      <div className="flex items-center bg-gray-100 justify-between rounded-2xl px-6 py-2.5 w-full flex-1 max-w-[300px] mx-auto gap-4">

        {/* Status Badge */}
        <div className={cn(
          "px-4 py-1.5 rounded-xl text-xs font-bold shrink-0",
          station.isActive
            ? "bg-green-100/50 text-green-600"
            : "bg-red-100/50 text-red-500"
        )}>
          {station.isActive ? "نشط" : "غير نشط"}
        </div>

        {/* Volume per month */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-sm font-black text-slate-900">{station.volumePerMonth}</span>
          <span className="text-[10px] font-bold text-slate-500">كمية/شهر</span>
        </div>

        {/* Orders per month */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-sm font-black text-slate-900">{station.ordersPerMonth}</span>
          <span className="text-[10px] font-bold text-slate-500">طلب/شهر</span>
        </div>

      </div>

      {/* Left section: Action Button */}
      <div className="w-full md:w-auto flex justify-end shrink-0">
        <button
          onClick={() => navigate(`/admin/petrol-companies/stations/${station.id}`)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-blue-100 text-blue-600 bg-white hover:bg-blue-50 transition-colors w-full md:w-auto shadow-sm"
        >
          <img src="/petrolCompany/station/arrowRight.svg" alt="" className="w-4 h-4" />
          <span className="text-xs font-bold">عرض التفاصيل</span>
        </button>
      </div>

    </div>
  );
}
