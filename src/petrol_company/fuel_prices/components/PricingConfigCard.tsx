import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';
import { usePricingConfig, useSetPricingConfig } from '@/petrol_company/fuel_prices/hooks/usePricing';
import { ApiError } from '@/lib/api/api-error';

const EMPTY_FORM = { deliveryFee: 0, serviceFeePercent: 0, taxRatePercent: 0, tankerCapacitiesLiters: [1000] };

// Feature 013 T091/T096/T097/FR-038/FR-040: wired to `GET`/`PUT /companies/:id/pricing-config`
// — genuinely new UI (the previous mock never surfaced these fields at all). FR-011j's
// 409 ("pricing not configured") renders as an honest empty state with a real form to
// fill in, not a crash or a silently zeroed screen.
export function PricingConfigCard() {
  const { t } = useTranslation();
  const { data: config, isLoading, isError, refetch } = usePricingConfig();
  const setPricingConfig = useSetPricingConfig();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (config) setForm(config);
  }, [config]);

  function openEditing() {
    setForm(config ?? EMPTY_FORM);
    setError(null);
    setIsEditing(true);
  }

  function updateCapacity(index: number, value: number) {
    setForm((f) => ({
      ...f,
      tankerCapacitiesLiters: f.tankerCapacitiesLiters.map((v, i) => (i === index ? value : v)),
    }));
  }

  function addCapacity() {
    setForm((f) => ({
      ...f,
      tankerCapacitiesLiters: [...f.tankerCapacitiesLiters, (f.tankerCapacitiesLiters.at(-1) ?? 0) + 1000],
    }));
  }

  function removeCapacity(index: number) {
    setForm((f) => ({
      ...f,
      tankerCapacitiesLiters: f.tankerCapacitiesLiters.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setError(null);
    try {
      await setPricingConfig.mutateAsync(form);
      toast.success(t('pricing.saveSuccess'));
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-[#162155]">{t('pricing.deliveryConfig')}</h2>
        {!isEditing && !isLoading && !isError && (
          <button
            onClick={openEditing}
            className="px-4 py-2 rounded-xl border border-blue-100 text-blue-600 bg-white hover:bg-blue-50 transition-colors font-bold text-sm"
          >
            {t('common.edit')}
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-center text-sm text-slate-400 py-6">{t('common.loading')}</p>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-6">
          <p className="text-sm text-red-500">{t('pricing.loadError')}</p>
          <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
            {t('common.retry')}
          </button>
        </div>
      ) : !config && !isEditing ? (
        <div className="flex flex-col items-center gap-3 py-6">
          <p className="text-sm font-bold text-slate-400">{t('pricing.notConfigured')}</p>
          <button onClick={openEditing} className="text-sm font-bold text-blue-600 hover:underline">
            {t('pricing.configure')}
          </button>
        </div>
      ) : isEditing ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 text-right">
              <span className="text-xs font-bold text-slate-500">{t('pricing.deliveryFee')}</span>
              <input
                type="number"
                value={form.deliveryFee}
                onChange={(e) => setForm((f) => ({ ...f, deliveryFee: Number(e.target.value) }))}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none text-sm font-bold text-right"
              />
            </div>
            <div className="flex flex-col gap-2 text-right">
              <span className="text-xs font-bold text-slate-500">{t('pricing.serviceFeePercent')}</span>
              <input
                type="number"
                value={form.serviceFeePercent}
                onChange={(e) => setForm((f) => ({ ...f, serviceFeePercent: Number(e.target.value) }))}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none text-sm font-bold text-right"
              />
            </div>
            <div className="flex flex-col gap-2 text-right">
              <span className="text-xs font-bold text-slate-500">{t('pricing.taxRatePercent')}</span>
              <input
                type="number"
                value={form.taxRatePercent}
                onChange={(e) => setForm((f) => ({ ...f, taxRatePercent: Number(e.target.value) }))}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none text-sm font-bold text-right"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500">{t('pricing.tankerCapacities')}</span>
            <span className="text-[11px] font-bold text-slate-400">{t('pricing.tankerCapacitiesHint')}</span>
            <div className="flex flex-col gap-2">
              {form.tankerCapacitiesLiters.map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => updateCapacity(index, Number(e.target.value))}
                    className="flex-1 bg-white border border-slate-200 rounded-xl p-3 outline-none text-sm font-bold text-right"
                  />
                  <button
                    onClick={() => removeCapacity(index)}
                    disabled={form.tankerCapacitiesLiters.length <= 1}
                    className="w-9 h-9 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 disabled:opacity-40"
                    title={t('pricing.removeCapacity')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addCapacity}
              className="self-start flex items-center gap-2 text-blue-600 text-sm font-bold hover:underline"
            >
              <Plus className="w-4 h-4" />
              {t('pricing.addCapacity')}
            </button>
          </div>

          {error && <p className="text-sm font-bold text-red-500">{error}</p>}

          <div className="flex items-center justify-end gap-3 mt-2">
            <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-white border border-red-200 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50">
              {t('common.cancel')}
            </button>
            <button onClick={handleSave} disabled={setPricingConfig.isPending} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-60">
              {t('common.save')}
            </button>
          </div>
        </div>
      ) : config ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-right">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 mb-1">{t('pricing.deliveryFee')}</span>
            <span className="text-lg font-black text-[#162155]">{config.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 mb-1">{t('pricing.serviceFeePercent')}</span>
            <span className="text-lg font-black text-[#162155]" dir="ltr">{config.serviceFeePercent}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 mb-1">{t('pricing.taxRatePercent')}</span>
            <span className="text-lg font-black text-[#162155]" dir="ltr">{config.taxRatePercent}%</span>
          </div>
          <div className="flex flex-col sm:col-span-3">
            <span className="text-xs font-bold text-slate-400 mb-2">{t('pricing.tankerCapacities')}</span>
            <div className="flex flex-wrap gap-2">
              {config.tankerCapacitiesLiters.map((v) => (
                <span key={v} className="bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1 text-sm font-bold text-slate-700" dir="ltr">
                  {v.toLocaleString()}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
