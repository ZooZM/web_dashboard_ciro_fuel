import { useTranslation } from 'react-i18next';
import { FUEL_TYPE_LABEL_KEY } from '@/constants/order-status';
import { ExchangeRequestState } from '@/constants/fuel-company';
import type { ExchangeRequestDetail } from '@/petrol_company/fuel_exchange/api/fuel-exchange.api';

interface FuelExchangeRequestDataProps {
  request: ExchangeRequestDetail;
  isRaiser: boolean;
}

// Feature 013 T233/FR-083/FR-098: supplier/receiver are DERIVED, not a new field — the
// raiser is requesting fuel FROM the recipient, so the recipient supplies and the raiser
// receives (FR-083 is satisfied by `raisedByCompanyId`/`recipientCompanyId`, already on
// the schema). The previous mock's free-text "notes" block had no backing field and is
// dropped rather than fabricated.
export function FuelExchangeRequestData({ request, isRaiser }: FuelExchangeRequestDataProps) {
  const { t, i18n } = useTranslation();
  const total = request.quantityLitres * request.unitPrice;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-start gap-2 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
          <img src="/petrolCompany/requests/details/details.svg" alt="" className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-black text-slate-900">{t('fuelExchange.requestData')}</h2>
      </div>

      {request.state === ExchangeRequestState.ACCEPTED && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 font-black">
                {(isRaiser ? request.counterparty.name : t('fuelExchange.you')).charAt(0)}
              </div>
              <div className="flex flex-col items-start text-right">
                <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.supplier')}</span>
                <span className="text-sm font-black text-slate-900">
                  {isRaiser ? request.counterparty.name : t('fuelExchange.you')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-green-600 font-black">
                {(isRaiser ? t('fuelExchange.you') : request.counterparty.name).charAt(0)}
              </div>
              <div className="flex flex-col items-start text-right">
                <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.receiver')}</span>
                <span className="text-sm font-black text-slate-900">
                  {isRaiser ? t('fuelExchange.you') : request.counterparty.name}
                </span>
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-slate-100 mb-6"></div>
        </>
      )}

      <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-right">
        <div className="flex flex-col items-start">
          <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.quantity')}</span>
          <span className="text-base font-black text-slate-900">{request.quantityLitres.toLocaleString()} {t('fuelExchange.litres')}</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.fuelType')}</span>
          <span className="text-base font-black text-slate-900">{t(FUEL_TYPE_LABEL_KEY[request.fuelType])}</span>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.unitPrice')}</span>
          <span className="text-base font-black text-slate-900">{request.unitPrice.toFixed(2)} {request.currency}</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.estimatedTotal')}</span>
          <span className="text-base font-black text-slate-900">{total.toLocaleString()} {request.currency}</span>
        </div>
      </div>

      <div className="h-px w-full bg-slate-100 my-6"></div>

      <div className="grid grid-cols-2 gap-4 text-right">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
            <img src="/petrolCompany/requests/details/gunStation.svg" alt="" className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.deliveryPlace')}</span>
            <span className="text-sm font-black text-slate-900">{request.deliveryPlaceText}</span>
          </div>
        </div>

        <div className="flex flex-col items-start pt-1">
          <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.deliveryDate')}</span>
          <span className="text-sm font-black text-slate-900">
            {new Date(request.deliveryAt).toLocaleString(i18n.language)}
          </span>
        </div>
      </div>
    </div>
  );
}
