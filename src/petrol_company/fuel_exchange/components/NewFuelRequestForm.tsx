import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useCreateExchangeRequest, useExchangePartners } from '@/petrol_company/fuel_exchange/hooks/useFuelExchange';
import { FUEL_TYPES, FUEL_TYPE_LABEL_KEY, FuelType } from '@/constants/order-status';
import { ApiError } from '@/lib/api/api-error';

export interface NewFuelRequestFormProps {
  onCancel: () => void;
  onCreated: () => void;
}

// Feature 013 T232/FR-078/FR-085/FR-086/FR-098: raises a real `POST
// /fuel-exchange/requests`. Every field the backend needs is here — the previous mock's
// city/region/location-link/notes inputs are dropped (the schema has no such fields;
// `deliveryPlaceText` is the one free-text destination the platform actually stores) and
// `recipientCompanyId` (previously entirely absent from the form) is now the first
// choice, sourced from `GET /companies/exchange-partners` — the platform's own refusal
// (`EXCHANGE_GRADE_NOT_SOLD`) is surfaced rather than pre-validated client-side, since
// the dashboard has no visibility into what a partner sells beyond attempting the request.
export function NewFuelRequestForm({ onCancel, onCreated }: NewFuelRequestFormProps) {
  const { t } = useTranslation();
  const { data: partners, isLoading: partnersLoading } = useExchangePartners();
  const createRequest = useCreateExchangeRequest();

  const [recipientCompanyId, setRecipientCompanyId] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>(FuelType.DIESEL);
  const [quantityLitres, setQuantityLitres] = useState(1000);
  const [unitPrice, setUnitPrice] = useState('');
  const [deliveryAt, setDeliveryAt] = useState('');
  const [deliveryPlaceText, setDeliveryPlaceText] = useState('');

  const estimatedTotal = quantityLitres * (Number(unitPrice) || 0);
  const canSubmit =
    recipientCompanyId && quantityLitres > 0 && Number(unitPrice) > 0 && deliveryAt && deliveryPlaceText.trim();

  async function handleSubmit() {
    if (!canSubmit) {
      toast.error(t('fuelExchange.formIncomplete'));
      return;
    }
    try {
      await createRequest.mutateAsync({
        recipientCompanyId,
        fuelType,
        quantityLitres,
        unitPrice: Number(unitPrice),
        deliveryAt: new Date(deliveryAt).toISOString(),
        deliveryPlaceText: deliveryPlaceText.trim(),
      });
      toast.success(t('fuelExchange.requestCreated'));
      onCreated();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  return (
    <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 flex flex-col gap-6 w-full mb-6 font-sans shadow-sm" dir="rtl">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-500 mr-1">{t('fuelExchange.recipientCompany')}</label>
        <select
          value={recipientCompanyId}
          onChange={(e) => setRecipientCompanyId(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-900"
        >
          <option value="">{partnersLoading ? t('common.loading') : t('fuelExchange.selectCompany')}</option>
          {partners?.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 mr-1">{t('fuelExchange.deliveryDate')}</label>
          <input
            type="datetime-local"
            value={deliveryAt}
            onChange={(e) => setDeliveryAt(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-900"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 mr-1">{t('fuelExchange.fuelType')}</label>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value as FuelType)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-900"
          >
            {FUEL_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(FUEL_TYPE_LABEL_KEY[type])}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 mr-1">{t('fuelExchange.quantity')}</label>
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-2 py-2">
            <button
              onClick={() => setQuantityLitres((v) => Math.max(0, v - 1000))}
              className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <img src="/petrolCompany/requests/minus.svg" alt="" className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-slate-900">{quantityLitres.toLocaleString()}</span>
              <span className="text-xs font-bold text-slate-400">{t('fuelExchange.litres')}</span>
            </div>
            <button
              onClick={() => setQuantityLitres((v) => v + 1000)}
              className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <img src="/petrolCompany/requests/add.svg" alt="" className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 mr-1">{t('fuelExchange.unitPrice')}</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            placeholder="0.00"
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-900"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-500 mr-1">{t('fuelExchange.deliveryPlace')}</label>
        <input
          type="text"
          value={deliveryPlaceText}
          onChange={(e) => setDeliveryPlaceText(e.target.value)}
          placeholder={t('fuelExchange.deliveryPlacePlaceholder')}
          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900"
        />
      </div>

      <div className="flex items-center justify-between bg-[#EFF6FF] border border-blue-100 rounded-xl px-5 py-4">
        <span className="text-sm font-bold text-slate-700">{t('fuelExchange.estimatedTotal')}</span>
        <span className="text-lg font-black text-blue-600" dir="ltr">
          {estimatedTotal.toLocaleString()} SAR
        </span>
      </div>

      <div className="flex items-center justify-end gap-3 mt-2">
        <button
          onClick={onCancel}
          disabled={createRequest.isPending}
          className="flex items-center justify-center gap-2 bg-red-50 text-red-500 px-6 py-3 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
        >
          {t('common.cancel')}
        </button>

        <button
          onClick={() => void handleSubmit()}
          disabled={!canSubmit || createRequest.isPending}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          {createRequest.isPending ? t('common.loading') : t('fuelExchange.sendRequest')}
        </button>
      </div>
    </div>
  );
}
