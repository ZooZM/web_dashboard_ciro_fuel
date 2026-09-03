import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/stores/session.store';
import { useExchangePartners } from '@/petrol_company/fuel_exchange/hooks/useFuelExchange';
import { FUEL_TYPE_LABEL_KEY } from '@/constants/order-status';
import { ExchangeRequestState } from '@/constants/fuel-company';
import type { ExchangeRequest } from '@/petrol_company/fuel_exchange/api/fuel-exchange.api';

interface FuelExchangeListItemProps {
  request: ExchangeRequest;
}

// Feature 013 T231/FR-079/FR-084/FR-098: `direction` is derived from `raisedByCompanyId`
// against the viewer's own company, never a fabricated `category` field. The counterparty
// name is resolved from `useExchangePartners()` — the list endpoint returns ids only, and
// every legitimate counterparty is, by definition, in that same partner list.
export function FuelExchangeListItem({ request }: FuelExchangeListItemProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const user = useSessionStore((s) => s.user);
  const { data: partners } = useExchangePartners();

  const isOutgoing = request.raisedByCompanyId === user?.companyId;
  const counterpartyId = isOutgoing ? request.recipientCompanyId : request.raisedByCompanyId;
  const counterpartyName = partners?.find((p) => p._id === counterpartyId)?.name ?? '—';
  const total = request.quantityLitres * request.unitPrice;
  const created = new Date(request.createdAt);

  return (
    <div
      onClick={() => navigate(`/petrolCompany/fuel-exchange/${request._id}`)}
      className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 border border-slate-200 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all bg-white cursor-pointer"
    >
      <div className="flex items-center gap-4 w-full xl:w-auto xl:min-w-[200px]">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 font-black">
          {counterpartyName.charAt(0)}
        </div>
        <div className="flex flex-col">
          <span className="font-black text-slate-900">{counterpartyName}</span>
          <span className="text-xs text-slate-500 font-bold mt-0.5">{isOutgoing ? t('fuelExchange.filterOutgoing') : t('fuelExchange.filterIncoming')}</span>
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

      <div className="flex items-center justify-between w-full xl:w-auto gap-8 xl:min-w-[200px]">
        <div className="flex flex-col items-start xl:items-end">
          <span className="text-sm font-bold text-slate-600">{created.toLocaleDateString(i18n.language)}</span>
          <span className="text-xs text-slate-400 font-bold mt-0.5">{created.toLocaleTimeString(i18n.language)}</span>
        </div>

        <div className="min-w-[110px] flex justify-end">
          <span
            className={
              request.state === ExchangeRequestState.AWAITING_RESPONSE
                ? 'px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold whitespace-nowrap'
                : request.state === ExchangeRequestState.ACCEPTED
                  ? 'px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-bold whitespace-nowrap'
                  : 'px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-sm font-bold whitespace-nowrap'
            }
          >
            {t(`fuelExchange.state.${request.state}`)}
          </span>
        </div>
      </div>
    </div>
  );
}
