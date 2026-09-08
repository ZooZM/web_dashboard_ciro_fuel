import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { MapPin, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useSessionStore } from '@/stores/session.store';
import { useCompanyProfile } from '@/transport_company/settings/hooks/useSettings';
import {
  useDeliveryRates,
  useSetDeliveryRates,
} from '@/transport_company/delivery_areas/hooks/useDeliveryRates';
import type { DeliveryRate } from '@/transport_company/delivery_areas/api/delivery-rates.api';
import {
  REGION_GOVERNORATES,
  governorateLabel,
  regionLabel,
  type GovernorateCode,
  type RegionCode,
} from '@/constants/regions';
import { apiErrorMessage } from '@/lib/api/error-messages';

/**
 * Wired to `GET`/`PUT /companies/:id/delivery-rates` — `:id` is the acting transporter's
 * own company. Before this the screen was 370 lines of hardcoded fixtures with no import
 * from `apiClient` at all (feature 009 disclosed it as one of two knowingly-unwired mock
 * screens).
 *
 * THREE THINGS THE MOCK SHOWED DO NOT EXIST ON THIS PLATFORM, and are dropped rather than
 * faked — the `MapTrackingCard` precedent from feature 009, where an invented breakdown
 * was removed instead of being given a plausible-looking data source:
 *
 *  · **A list of fuel companies, each with its own areas.** `Company.parentFuelCompanyId`
 *    is SINGULAR: a transporter is created by, and belongs to, exactly one fuel company.
 *    The mock's four companies could never have been populated. Areas are not a
 *    per-fuel-company dimension at all — `deliveryRates` is one flat list on the
 *    transporter, keyed by `(regionCode, governorateCode?)`.
 *  · **The قبول / رفض (accept / reject) row.** There is no invitation or approval flow
 *    between a fuel company and a transporter anywhere in the platform; the transporter is
 *    created already belonging to its parent (`POST /companies/:id/transporters`).
 *  · **The map and the "areas by company" table.** An area is a region/governorate CODE.
 *    The platform stores no geometry for one, so there is nothing to draw and nothing to
 *    break down.
 *
 * The two stat cards are now COMPUTED from the loaded rates. They previously read a
 * hardcoded `5` and `1.85 ر.س`, which is the specific failure worth naming: a fabricated
 * average fare is indistinguishable from a real one, so the screen looked correct while
 * telling an operator a number about their own pricing that nothing produced.
 */
export function DeliveryAreasPage() {
  const { t, i18n } = useTranslation();
  const companyId = useSessionStore((s) => s.user?.companyId) ?? '';

  const company = useCompanyProfile(companyId);
  const { data: rates, isLoading, isError } = useDeliveryRates(companyId);
  const setRates = useSetDeliveryRates(companyId);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draftPricePerKm, setDraftPricePerKm] = useState('');
  const [draftMinPrice, setDraftMinPrice] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const servedRegions = company.data?.servedRegions ?? [];

  // The platform's own key for an area — `governorateCode` absent means the whole region,
  // and the controller refuses two entries that collapse to the same key, because a
  // duplicate would make the quote depend on which happened to be stored first.
  const keyOf = (rate: Pick<DeliveryRate, 'regionCode' | 'governorateCode'>) =>
    `${rate.regionCode}:${rate.governorateCode ?? '*'}`;

  const stats = useMemo(() => {
    const list = rates ?? [];
    if (list.length === 0) return { total: 0, avgPricePerKm: null as number | null };
    const sum = list.reduce((acc, r) => acc + r.pricePerKm, 0);
    return { total: list.length, avgPricePerKm: sum / list.length };
  }, [rates]);

  /** Every write is the WHOLE list — `SetDeliveryRatesDto` takes no partial update. */
  async function commit(next: Omit<DeliveryRate, 'updatedAt'>[]) {
    try {
      await setRates.mutateAsync(next);
      toast.success(t('deliveryAreas.saved'));
      setEditingKey(null);
      setIsAdding(false);
    } catch (err) {
      toast.error(apiErrorMessage(err, t));
    }
  }

  function startEdit(rate: DeliveryRate) {
    setIsAdding(false);
    setEditingKey(keyOf(rate));
    setDraftPricePerKm(String(rate.pricePerKm));
    setDraftMinPrice(String(rate.minPrice));
  }

  function saveEdit(rate: DeliveryRate) {
    const pricePerKm = Number(draftPricePerKm);
    const minPrice = Number(draftMinPrice);
    // `@Min(0)`, not `@Min(0.01)`: zero is a legitimate rate here — a transporter may
    // cover a nearby area on the minimum charge alone, and a zero floor is how they say
    // "per-km only, no minimum".
    if (!Number.isFinite(pricePerKm) || pricePerKm < 0 || !Number.isFinite(minPrice) || minPrice < 0) {
      toast.error(t('deliveryAreas.priceRequired'));
      return;
    }
    const next = (rates ?? []).map((r) =>
      keyOf(r) === keyOf(rate)
        ? { regionCode: r.regionCode, governorateCode: r.governorateCode, pricePerKm, minPrice }
        : { regionCode: r.regionCode, governorateCode: r.governorateCode, pricePerKm: r.pricePerKm, minPrice: r.minPrice },
    );
    void commit(next);
  }

  function removeRate(rate: DeliveryRate) {
    if (!window.confirm(t('deliveryAreas.removeConfirm'))) return;
    const next = (rates ?? [])
      .filter((r) => keyOf(r) !== keyOf(rate))
      .map((r) => ({
        regionCode: r.regionCode,
        governorateCode: r.governorateCode,
        pricePerKm: r.pricePerKm,
        minPrice: r.minPrice,
      }));
    void commit(next);
  }

  function addRate(entry: Omit<DeliveryRate, 'updatedAt'>) {
    if ((rates ?? []).some((r) => keyOf(r) === keyOf(entry))) {
      toast.error(t('deliveryAreas.duplicateArea'));
      return;
    }
    const next = [
      ...(rates ?? []).map((r) => ({
        regionCode: r.regionCode,
        governorateCode: r.governorateCode,
        pricePerKm: r.pricePerKm,
        minPrice: r.minPrice,
      })),
      entry,
    ];
    void commit(next);
  }

  return (
    <div className="p-4 md:p-6 w-full h-full space-y-6 bg-slate-50/50 min-h-screen" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-blue-900 mb-2">{t('deliveryAreas.title')}</h1>
        <p className="text-sm font-bold text-slate-400">{t('deliveryAreas.subtitle')}</p>
      </div>

      {/* Both figures COMPUTED from the loaded rates — never a constant. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          icon="/transportCompany/delivery/locationPin.svg"
          tone="blue"
          label={t('deliveryAreas.totalAreas')}
          value={isLoading ? '…' : String(stats.total)}
        />
        <StatCard
          icon="/transportCompany/delivery/orangeCoin.svg"
          tone="orange"
          label={t('deliveryAreas.avgPricePerKm')}
          // No priced area means no average — an em dash, never a zero that reads as a
          // real rate of zero.
          value={
            isLoading
              ? '…'
              : stats.avgPricePerKm === null
                ? '—'
                : `${stats.avgPricePerKm.toFixed(2)} ${t('deliveryAreas.currency')}`
          }
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-lg font-black text-slate-900">{t('deliveryAreas.servedRegions')}</h2>
          <button
            type="button"
            onClick={() => {
              setEditingKey(null);
              setIsAdding((v) => !v);
            }}
            disabled={servedRegions.length === 0 || setRates.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {t('deliveryAreas.addArea')}
          </button>
        </div>

        {/* The transporter prices only what its parent fuel company assigned it. With no
            assigned region there is nothing it could legitimately price, and the reason is
            stated rather than left as an empty list. */}
        {servedRegions.length === 0 && !company.isLoading && (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
            {t('deliveryAreas.noServedRegions')}
          </p>
        )}

        {isAdding && servedRegions.length > 0 && (
          <AddAreaForm
            servedRegions={servedRegions}
            language={i18n.language}
            isPending={setRates.isPending}
            onCancel={() => setIsAdding(false)}
            onAdd={addRate}
          />
        )}

        {isError && (
          <p className="py-8 text-center text-sm font-bold text-red-500">{t('deliveryAreas.loadError')}</p>
        )}

        {isLoading && <p className="py-8 text-center text-sm font-bold text-slate-400">…</p>}

        {!isLoading && !isError && (rates?.length ?? 0) === 0 && servedRegions.length > 0 && (
          <div className="py-10 text-center">
            <p className="text-sm font-black text-slate-500">{t('deliveryAreas.empty')}</p>
            <p className="mt-1 text-xs font-bold text-slate-400">{t('deliveryAreas.emptyHint')}</p>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3">
          {(rates ?? []).map((rate) => {
            const key = keyOf(rate);
            const isEditing = editingKey === key;
            return (
              <div
                key={key}
                className={`rounded-xl border bg-slate-50 p-4 transition-all ${
                  isEditing ? 'border-blue-200 shadow-sm' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-blue-900">
                        {rate.governorateCode
                          ? governorateLabel(rate.governorateCode, i18n.language)
                          : regionLabel(rate.regionCode, i18n.language)}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {rate.governorateCode
                          ? regionLabel(rate.regionCode, i18n.language)
                          : t('deliveryAreas.wholeRegion')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-green-600" dir="ltr">
                        {rate.pricePerKm.toFixed(2)} {t('deliveryAreas.currency')}{' '}
                        <span className="text-xs text-green-600/70">{t('deliveryAreas.perKm')}</span>
                      </span>
                      <span className="mt-1 text-xs font-bold text-slate-400">
                        {t('deliveryAreas.minPriceLabel')} {rate.minPrice.toFixed(2)}{' '}
                        {t('deliveryAreas.currency')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => (isEditing ? setEditingKey(null) : startEdit(rate))}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-blue-600 transition-colors hover:bg-blue-50"
                      >
                        {isEditing ? <X className="h-5 w-5" /> : <Pencil className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRate(rate)}
                        disabled={setRates.isPending}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex flex-col gap-4">
                    <div className="flex flex-wrap items-end gap-4">
                      <PriceInput
                        label={t('deliveryAreas.pricePerKm')}
                        value={draftPricePerKm}
                        onChange={setDraftPricePerKm}
                      />
                      <PriceInput
                        label={t('deliveryAreas.minPrice')}
                        value={draftMinPrice}
                        onChange={setDraftMinPrice}
                      />
                      <button
                        type="button"
                        onClick={() => saveEdit(rate)}
                        disabled={setRates.isPending}
                        className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
                      >
                        {setRates.isPending ? t('common.loading') : t('deliveryAreas.save')}
                      </button>
                    </div>
                    {rate.governorateCode && (
                      <span className="text-xs font-bold text-slate-400">
                        {t('deliveryAreas.governorateSpecificNote')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  tone,
  label,
  value,
}: {
  icon: string;
  tone: 'blue' | 'orange';
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
          tone === 'blue' ? 'bg-blue-50' : 'bg-orange-50'
        }`}
      >
        <img src={icon} alt="" className="h-6 w-6" />
      </div>
      <div className="flex-1 pl-4 text-right">
        <div className="mb-1 text-xs font-bold text-slate-400">{label}</div>
        <div
          className={`text-xl font-black ${tone === 'blue' ? 'text-blue-600' : 'text-orange-500'}`}
          dir="ltr"
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function PriceInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="flex min-w-[180px] flex-1 flex-col gap-2">
      <span className="text-right text-xs font-bold text-slate-400">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir="ltr"
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

function AddAreaForm({
  servedRegions,
  language,
  isPending,
  onCancel,
  onAdd,
}: {
  servedRegions: RegionCode[];
  language: string;
  isPending: boolean;
  onCancel: () => void;
  onAdd: (entry: { regionCode: RegionCode; governorateCode?: GovernorateCode; pricePerKm: number; minPrice: number }) => void;
}) {
  const { t } = useTranslation();
  const [regionCode, setRegionCode] = useState<RegionCode>(servedRegions[0]!);
  // '' is the WHOLE region, which is what an absent `governorateCode` means to the
  // platform — not a missing selection.
  const [governorateCode, setGovernorateCode] = useState<GovernorateCode | ''>('');
  const [pricePerKm, setPricePerKm] = useState('');
  const [minPrice, setMinPrice] = useState('');

  function submit() {
    const perKm = Number(pricePerKm);
    const min = Number(minPrice);
    if (!Number.isFinite(perKm) || perKm < 0 || !Number.isFinite(min) || min < 0) {
      toast.error(t('deliveryAreas.priceRequired'));
      return;
    }
    onAdd({
      regionCode,
      ...(governorateCode ? { governorateCode } : {}),
      pricePerKm: perKm,
      minPrice: min,
    });
  }

  return (
    <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50/40 p-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex min-w-[180px] flex-1 flex-col gap-2">
          <span className="text-right text-xs font-bold text-slate-400">{t('deliveryAreas.region')}</span>
          <select
            value={regionCode}
            onChange={(e) => {
              setRegionCode(e.target.value as RegionCode);
              setGovernorateCode('');
            }}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900"
          >
            {servedRegions.map((code) => (
              <option key={code} value={code}>
                {regionLabel(code, language)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex min-w-[180px] flex-1 flex-col gap-2">
          <span className="text-right text-xs font-bold text-slate-400">
            {t('deliveryAreas.governorate')}
          </span>
          <select
            value={governorateCode}
            onChange={(e) => setGovernorateCode(e.target.value as GovernorateCode | '')}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900"
          >
            <option value="">{t('deliveryAreas.wholeRegion')}</option>
            {REGION_GOVERNORATES[regionCode].map((code) => (
              <option key={code} value={code}>
                {governorateLabel(code, language)}
              </option>
            ))}
          </select>
        </div>

        <PriceInput label={t('deliveryAreas.pricePerKm')} value={pricePerKm} onChange={setPricePerKm} />
        <PriceInput label={t('deliveryAreas.minPrice')} value={minPrice} onChange={setMinPrice} />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={submit}
            disabled={isPending}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? t('common.loading') : t('deliveryAreas.addArea')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
