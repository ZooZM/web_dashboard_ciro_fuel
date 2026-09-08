import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useCreateOffer } from '@/petrol_company/fuel_exchange/hooks/useFuelExchange';
import { FUEL_TYPES, FUEL_TYPE_LABEL_KEY, FuelType } from '@/constants/order-status';
import { GovernorateCode, governorateLabel } from '@/constants/regions';
import { apiErrorMessage } from '@/lib/api/error-messages';
import { LocationField } from '@/components/ui/LocationField';
import { buildMapsUrl, parseLatLngFromUrl } from '@/lib/maps/maps-url';

export interface NewOfferFormProps {
  onCreated: () => void;
}

const ALL_GOVERNORATE_CODES = Object.values(GovernorateCode);
const DEFAULT_CITY = ALL_GOVERNORATE_CODES[0]!;

/**
 * spec 016 (broadcast fuel exchange offers) T041 — replaces `NewFuelRequestForm.tsx`
 * entirely (FR-040). Deliberately has NO recipient selector (an offer reaches every
 * eligible fuel company, never one named party) and NO price input (FR-005a: price is
 * proposed by each responder, never set by the raiser). Always expanded, never gated
 * behind a "new request" button (FR-032) — the approved design's estimated-total row is
 * replaced with a quantity-and-grade summary (FR-032a): no price exists at creation, so
 * a currency total could only ever read zero. The platform's own refusal
 * (`EXCHANGE_NO_ELIGIBLE_COMPANY`) is surfaced rather than pre-validated client-side —
 * the dashboard has no visibility into which companies sell what beyond attempting the
 * offer. The panel itself can no longer be dismissed (FR-032), so "cancel" resets the
 * form's own fields rather than hiding anything.
 */
export function NewOfferForm({ onCreated }: NewOfferFormProps) {
  const { t, i18n } = useTranslation();
  const createOffer = useCreateOffer();

  const [fuelType, setFuelType] = useState<FuelType>(FuelType.DIESEL);
  const [quantityLitres, setQuantityLitres] = useState(1000);
  const [deliveryAt, setDeliveryAt] = useState('');
  const [city, setCity] = useState<GovernorateCode>(DEFAULT_CITY);
  const [district, setDistrict] = useState('');
  const [locationUrl, setLocationUrl] = useState('');
  const [notes, setNotes] = useState('');

  function resetForm() {
    setFuelType(FuelType.DIESEL);
    setQuantityLitres(1000);
    setDeliveryAt('');
    setCity(DEFAULT_CITY);
    setDistrict('');
    setLocationUrl('');
    setNotes('');
  }

  const canSubmit = quantityLitres > 0 && deliveryAt && city;

  async function handleSubmit() {
    if (!canSubmit) {
      toast.error(t('fuelExchange.formIncomplete'));
      return;
    }
    try {
      await createOffer.mutateAsync({
        fuelType,
        quantityLitres,
        deliveryAt: new Date(deliveryAt).toISOString(),
        city,
        district: district.trim() || undefined,
        locationUrl: locationUrl.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      toast.success(t('fuelExchange.offerCreated'));
      resetForm();
      onCreated();
    } catch (err) {
      // The platform's refusals here are all code-addressable and all actionable —
      // EXCHANGE_NO_ELIGIBLE_COMPANY ("nobody else sells this grade") and
      // EXCHANGE_DELIVERY_IN_PAST ("pick a later time") in particular. Showing a generic
      // wall for either left an operator with a red toast and no idea what to change.
      toast.error(apiErrorMessage(err, t));
    }
  }

  return (
    <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 flex flex-col gap-6 w-full mb-6 font-sans shadow-sm" dir="rtl">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 mr-1">{t('fuelExchange.city')}</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value as GovernorateCode)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-900"
          >
            {ALL_GOVERNORATE_CODES.map((code) => (
              <option key={code} value={code}>
                {governorateLabel(code, i18n.language)}
              </option>
            ))}
          </select>
        </div>

        {/* research R8 — deliberately labelled "الحي" (neighbourhood), never "المنطقة":
            the platform already uses that word for its 13 administrative RegionCode
            regions elsewhere (transporter/company coverage), and this field is
            unrelated free text. */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 mr-1">{t('fuelExchange.district')}</label>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900"
          />
        </div>
      </div>

      {/* The operator picks the destination on a map rather than pasting a link. The FIELD
          is still `locationUrl` and still a URL on the wire (`@IsUrl` on the platform's
          `CreateOfferDto`, FR-028) — the conversion happens HERE, at this feature's own
          edge, so the shared picker stays coordinate-based and the station forms (which
          store real lat/lng numbers) reuse it without inheriting a URL. */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-500 mr-1">{t('fuelExchange.locationUrl')}</label>
        <LocationField
          value={parseLatLngFromUrl(locationUrl)}
          onChange={(next) => setLocationUrl(next ? buildMapsUrl(next) : '')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-500 mr-1">{t('fuelExchange.notes')}</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('fuelExchange.notesPlaceholder')}
          rows={3}
          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 resize-none"
        />
      </div>

      {/* FR-032a: quantity + grade only — never a currency total, which could only ever
          read zero since no price exists until a company proposes one. */}
      <div className="flex items-center justify-between bg-[#EFF6FF] border border-blue-100 rounded-xl px-5 py-4">
        <span className="text-sm font-bold text-slate-700">{t('fuelExchange.offerSummary')}</span>
        <span className="text-lg font-black text-blue-600">
          {t('fuelExchange.offerSummaryValue', {
            quantity: quantityLitres.toLocaleString(),
            fuelType: t(FUEL_TYPE_LABEL_KEY[fuelType]),
          })}
        </span>
      </div>

      <div className="flex items-center justify-end gap-3 mt-2">
        <button
          onClick={resetForm}
          disabled={createOffer.isPending}
          className="flex items-center justify-center gap-2 bg-red-50 text-red-500 px-6 py-3 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
        >
          {t('common.cancel')}
        </button>

        <button
          onClick={() => void handleSubmit()}
          disabled={!canSubmit || createOffer.isPending}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          {createOffer.isPending ? t('common.loading') : t('fuelExchange.sendOffer')}
        </button>
      </div>
    </div>
  );
}
