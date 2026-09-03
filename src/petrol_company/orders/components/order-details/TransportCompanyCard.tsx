import { useTranslation } from 'react-i18next';
import { useOrderDetailContext } from './OrderDetailContext';
import { useTransporterDetail } from '@/petrol_company/companies/hooks/useTransporters';

// Feature 013 T054/FR-020: the fabricated company name/phone/tank-selection/manager
// are gone. Shows the real transporter this order was routed to (`transportCompanyId`),
// looked up via `GET /companies/:id` — absent, not invented, before routing (FR-048).
export function TransportCompanyCard({ onEdit: _onEdit }: { onEdit?: () => void }) {
  const { t } = useTranslation();
  const { order } = useOrderDetailContext();
  const { data: transporter, isLoading } = useTransporterDetail(order?.transportCompanyId ?? '');

  if (!order?.transportCompanyId) {
    return (
      <div className="bg-white border-t-4 border-[#2563EB] rounded-[24px] p-6 shadow-sm">
        <h2 className="text-xl font-black text-[#162155] mb-4">{t('companies.title')}</h2>
        <p className="text-sm text-slate-400">{t('orders.noTransporterYet')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-t-4 border-[#2563EB] rounded-[24px] p-6 shadow-sm relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <img src="/petrolCompany/orderDetails/truck.svg" alt="" className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-black text-[#162155]">{t('companies.title')}</h2>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400">{t('common.loading')}</p>
      ) : transporter ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#2563EB] flex items-center justify-center shadow-sm">
            <img src="/transportCompany/orderPage/orderDetails/truck.svg" alt="" className="w-6 h-6 brightness-0 invert" />
          </div>
          <h3 className="text-lg font-black text-[#162155] mt-1">{transporter.name}</h3>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-sm font-semibold">{t('companies.name')}</span>
            <span className="text-[#2563EB] text-sm font-bold" dir="ltr">{transporter.contactPhone}</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400">{t('errors.notFound')}</p>
      )}
    </div>
  );
}
