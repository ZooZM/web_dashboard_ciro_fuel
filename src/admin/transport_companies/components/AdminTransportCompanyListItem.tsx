import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { CompanyStatus } from '@/constants/order-status';
import type { TransportCompany } from '@/admin/transport_companies/api/transport-companies.api';

interface AdminTransportCompanyListItemProps {
  company: TransportCompany;
  /**
   * Orders raised in the period, from the ONE batched call the page makes for
   * the whole page (FR-026b). `undefined` while that call is in flight, which
   * renders as a dash — never as `0`, which is a real answer meaning "never
   * routed to".
   */
  orderCount: number | undefined;
  isLast?: boolean;
}

/**
 * spec 017 (operator dashboard) T070/FR-025/FR-026 — one transporter row.
 *
 * The covered-area count is derived from `servedRegions.length` in the SAME
 * payload the row already has, so it costs no extra request. The order volume
 * comes from `GET /platform/transport-company-volumes`, issued once for the
 * whole rendered page.
 */
export function AdminTransportCompanyListItem({
  company,
  orderCount,
  isLast,
}: AdminTransportCompanyListItemProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isActive = company.status === CompanyStatus.ACTIVE;

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row items-center justify-between p-4 gap-4 transition-colors hover:bg-slate-50',
        !isLast && 'border-b border-slate-100',
      )}
    >
      <div className="flex items-center justify-end gap-3 w-full md:w-[250px] shrink-0 order-3 md:order-1 text-right">
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-900 leading-tight mb-0.5">
            {company.name}
          </span>
          <span className="text-[10px] font-bold text-slate-400" dir="ltr">
            {company.contactEmail}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 p-2 overflow-hidden border-2 border-white shadow-sm">
          <img
            src="/Admin/transporter/blueTruck.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="flex items-center justify-between bg-[#F8FAFC] rounded-2xl px-8 py-3 w-full flex-1 max-w-[350px] mx-auto order-2">
        <div
          className={cn(
            'px-4 py-1.5 rounded-xl text-xs font-bold shrink-0 text-center',
            isActive ? 'bg-[#E4F7EC] text-[#12A150]' : 'bg-[#FEF2F2] text-[#EF4444]',
          )}
        >
          {isActive ? t('companies.active') : t('companies.suspended')}
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-sm font-black text-slate-900">
            {company.servedRegions?.length ?? 0}
          </span>
          <span className="text-[10px] font-bold text-slate-500">
            {t('transportCompanies.coveredAreas')}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-sm font-black text-slate-900">
            {orderCount === undefined ? '—' : orderCount.toLocaleString()}
          </span>
          <span className="text-[10px] font-bold text-slate-500">
            {t('transportCompanies.orderVolume')}
          </span>
        </div>
      </div>

      <div className="w-full md:w-auto flex justify-end shrink-0 order-1 md:order-3">
        <button
          onClick={() => navigate(`/admin/transport-companies/${company._id}`)}
          className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl border border-blue-100 text-blue-600 bg-white hover:bg-blue-50 transition-colors w-full md:w-auto shadow-sm"
        >
          <img src="/petrolCompany/station/arrowRight.svg" alt="" className="w-4 h-4" />
          <span className="text-xs font-bold">{t('common.viewDetails')}</span>
        </button>
      </div>
    </div>
  );
}
