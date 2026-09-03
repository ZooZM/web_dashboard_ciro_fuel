import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Transporter } from '@/petrol_company/companies/api/transporters.api';

interface CompanyListItemProps {
  company: Transporter;
  isLast: boolean;
}

// Feature 013 T084/FR-033/FR-048: "orders/month" dropped — no per-transporter order
// aggregation exists on the platform; `servedRegions.length` is the real, live figure.
export function CompanyListItem({ company, isLast }: CompanyListItemProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isActive = company.status === 'ACTIVE';

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
            <span className="text-xs font-bold text-slate-400">{company._id}</span>
          </div>
        </div>

        {/* Center - Status & Stats block */}
        <div className="shrink-0 flex items-center justify-center w-full md:w-auto">
          <div className="bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl flex items-center divide-x divide-x-reverse divide-slate-200 h-12 px-2">
            <div className="px-5 h-full flex items-center justify-center">
              {isActive ? (
                <span className="text-[#16A34A] text-sm font-bold px-1">{t('common.active')}</span>
              ) : (
                <span className="text-[#DC2626] text-sm font-bold px-1">{t('common.inactive')}</span>
              )}
            </div>

            <div className="px-5 h-full flex flex-col items-center justify-center">
              <span className="text-sm font-black text-slate-900 leading-none mb-1">{company.servedRegions.length}</span>
              <span className="text-[10px] font-bold text-slate-400 leading-none">{t('companies.regionsCount')}</span>
            </div>
          </div>
        </div>

        {/* Left Side - Action */}
        <div className="flex-1 w-full md:w-auto flex justify-end">
          <button
            onClick={() => navigate(`/petrolCompany/companies/${company._id}`)}
            className="flex items-center justify-center gap-3 px-6 py-2.5 rounded-xl border border-blue-200 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors w-full md:w-auto bg-white"
          >
            <img src="/petrolCompany/transporters/arrowRight.svg" alt="" className="w-4 h-4" />
            <span>{t('owners.viewDetail')}</span>
          </button>
        </div>

      </div>

      {!isLast && (
        <div className="h-px bg-slate-100 mx-6"></div>
      )}
    </div>
  );
}
