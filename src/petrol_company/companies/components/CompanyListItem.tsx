import { useNavigate } from 'react-router-dom';

interface Company {
  id: string;
  name: string;
  isActive: boolean;
  regionsCount: number;
  ordersPerMonth: number;
}

interface CompanyListItemProps {
  company: Company;
  isLast: boolean;
}

export function CompanyListItem({ company, isLast }: CompanyListItemProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-6 transition-colors hover:bg-slate-50">
        
        {/* Right Side - Info */}
        <div className="flex-1 flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 shadow-sm shadow-blue-200">
            <img src="/petrolCompany/transporters/truck.svg" alt="" className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black text-slate-900 mb-0.5">{company.name}</span>
            <span className="text-xs font-bold text-slate-400">{company.id}</span>
          </div>
        </div>

        {/* Center - Status & Stats block */}
        <div className="shrink-0 flex items-center justify-center w-full md:w-auto">
          <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl flex items-center divide-x divide-x-reverse divide-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] h-12 px-2 border border-[#E7E9EF] rounded-2xl">
            
            {/* Badge */}
            <div className="px-5 h-full flex items-center justify-center">
              {company.isActive ? (
                <span className="text-[#16A34A] text-sm font-bold px-1">نشط</span>
              ) : (
                <span className="text-[#DC2626] text-sm font-bold px-1">غير نشط</span>
              )}
            </div>
            
            {/* Regions */}
            <div className="px-5 h-full flex flex-col items-center justify-center">
              <span className="text-sm font-black text-slate-900 leading-none mb-1">{company.regionsCount}</span>
              <span className="text-[10px] font-bold text-slate-400 leading-none">مناطق</span>
            </div>

            {/* Orders */}
            <div className="px-5 h-full flex flex-col items-center justify-center">
              <span className="text-sm font-black text-slate-900 leading-none mb-1">{company.ordersPerMonth}</span>
              <span className="text-[10px] font-bold text-slate-400 leading-none">طلب/شهر</span>
            </div>

          </div>
        </div>

        {/* Left Side - Action */}
        <div className="flex-1 w-full md:w-auto flex justify-end">
          <button 
            onClick={() => navigate(`/petrolCompany/companies/${company.id}`)}
            className="flex items-center justify-center gap-3 px-6 py-2.5 rounded-xl border border-blue-200 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors w-full md:w-auto bg-white"
          >
            <img src="/petrolCompany/transporters/arrowRight.svg" alt="" className="w-4 h-4" />
            <span>عرض التفاصيل</span>
          </button>
        </div>

      </div>
      
      {/* Divider */}
      {!isLast && (
        <div className="h-px bg-slate-100 mx-6"></div>
      )}
    </div>
  );
}
