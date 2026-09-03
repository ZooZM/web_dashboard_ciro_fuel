import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FUEL_TYPE_LABEL_KEY } from '@/constants/order-status';
import type { ExchangeRequest } from '@/petrol_company/fuel_exchange/api/fuel-exchange.api';

interface AdminFuelExchangeListItemProps {
  request: ExchangeRequest;
  companyNameById: Map<string, string>;
}

// Feature 013 T242/FR-089: real `ExchangeRequest` data (`GET /fuel-exchange/requests`,
// SUPER_ADMIN bypasses the party-set plugin and sees every request on the platform).
// Unlike the FCA-facing `FuelExchangeListItem.tsx`, this shows BOTH company names
// explicitly rather than "you"/counterparty — the operator has no side in the exchange,
// so "incoming"/"outgoing" (computed against `user.companyId`) is meaningless here.
//
// **This screen renders correctly even when the party-set isolation mechanism is
// broken.** If `ExchangeRequest` were (hypothetically) marked multi-party instead of
// party-set, `SUPER_ADMIN` would still bypass that plugin too and see every request
// exactly as it does here — the defect research R3 found is only observable from a real
// fuel company's own incoming list (`FuelExchangePage.tsx`), never from this one. Do not
// treat this screen loading correctly as evidence the isolation mechanism works
// (`contracts/isolation-contract.md`, quickstart 3.3).
export function AdminFuelExchangeListItem({ request, companyNameById }: AdminFuelExchangeListItemProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const raiserName = companyNameById.get(request.raisedByCompanyId) ?? '—';
  const recipientName = companyNameById.get(request.recipientCompanyId) ?? '—';
  const total = request.quantityLitres * request.unitPrice;
  const created = new Date(request.createdAt);

  return (
    <div
      onClick={() => navigate(`/admin/fuel-exchange/${request._id}`)}
      className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 border border-slate-200 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all bg-white cursor-pointer"
    >
      <div className="flex items-center gap-4 w-full xl:w-auto xl:min-w-[220px]">
        <div className="flex flex-col">
          <span className="font-black text-slate-900 text-sm">{raiserName} ← {recipientName}</span>
          <span className="text-xs text-slate-500 font-bold mt-0.5">{t(`fuelExchange.state.${request.state}`)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 w-full xl:w-auto bg-slate-50/50 rounded-xl p-3 border border-slate-100">
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm font-black text-slate-900">{t(FUEL_TYPE_LABEL_KEY[request.fuelType])}</span>
          <span className="text-xs text-slate-500 mt-1 font-semibold">{t('fuelExchange.fuelType')}</span>
        </div>
        <div className="flex flex-col items-center justify-center md:border-r border-slate-200">
          <span className="text-sm font-black text-slate-900">{request.quantityLitres.toLocaleString()}</span>
          <span className="text-xs text-slate-500 mt-1 font-semibold">{t('fuelExchange.litres')}</span>
        </div>
        <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-r border-slate-200 pt-3 md:pt-0">
          <span className="text-sm font-black text-slate-900">{request.unitPrice.toFixed(2)} {request.currency}</span>
          <span className="text-xs text-slate-500 mt-1 font-semibold">{t('fuelExchange.unitPrice')}</span>
        </div>
        <div className="flex flex-col items-center justify-center md:border-r border-slate-200 border-t md:border-t-0 pt-3 md:pt-0">
          <span className="text-sm font-black text-slate-900">{total.toLocaleString()} {request.currency}</span>
          <span className="text-xs text-slate-500 mt-1 font-semibold">{t('fuelExchange.total')}</span>
        </div>
      </div>

      <div className="flex items-center justify-end w-full xl:w-auto xl:min-w-[120px]">
        <span className="text-xs font-bold text-slate-400">{created.toLocaleDateString(i18n.language)}</span>
      </div>
    </div>
  );
}
