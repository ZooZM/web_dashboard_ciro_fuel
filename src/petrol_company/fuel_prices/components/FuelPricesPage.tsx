import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FuelPriceCard } from './FuelPriceCard';
import { EditPriceModal } from './EditPriceModal';
import { PricingConfigCard } from './PricingConfigCard';
import { useFuelPrices, useSetFuelPrices } from '@/petrol_company/fuel_prices/hooks/usePricing';
import { FUEL_TYPES } from '@/constants/order-status';
import type { FuelType } from '@/constants/order-status';
import { ApiError } from '@/lib/api/api-error';

// Feature 013 T091-T099/FR-037/FR-038/FR-039/FR-040/FR-098: wired to `GET`/`PUT
// /companies/:id/fuel-prices` and `/pricing-config`. `data.ts`'s mock and every fabricated
// section it drove — a change-vs-last-update indicator, a comparison table against a
// "previous price" the platform never records, a coverage-range card duplicating T058/T086a
// data out of scope here, and a "prices status" card with no real last-updated field — are
// all gone (FR-047/FR-048). Only T033's own 4 platform grades are ever offered (T094); a
// grade with no price set yet still renders, as "not set" rather than a silent 0.00.
export function FuelPricesPage() {
  const { t } = useTranslation();
  const { data: prices, isLoading, isError, refetch } = useFuelPrices();
  const setFuelPrices = useSetFuelPrices();

  const [editingType, setEditingType] = useState<FuelType | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const priceByType = new Map((prices ?? []).map((p) => [p.fuelType, p.basePricePerLiter]));

  async function handleSave(newPrice: number) {
    if (!editingType) return;
    setModalError(null);
    const nextPrices = FUEL_TYPES.filter((type) => priceByType.has(type) || type === editingType).map((type) => ({
      fuelType: type,
      basePricePerLiter: type === editingType ? newPrice : priceByType.get(type)!,
    }));
    try {
      await setFuelPrices.mutateAsync(nextPrices);
      toast.success(t('pricing.saveSuccess'));
      setEditingType(null);
    } catch (err) {
      setModalError(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-[calc(100vh-6rem)] font-sans" dir="rtl">
      <div className="flex flex-col gap-8 max-w-[1600px] mx-auto">

        <div className="flex flex-col gap-1 text-right mt-2">
          <h1 className="text-2xl font-black text-[#162155]">{t('pricing.title')}</h1>
          <p className="text-slate-500 font-bold text-sm">{t('pricing.subtitle')}</p>
        </div>

        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('common.loading')}</p>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <p className="text-sm text-red-500">{t('pricing.loadError')}</p>
            <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
              {t('common.retry')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {FUEL_TYPES.map((fuelType) => (
              <FuelPriceCard
                key={fuelType}
                fuelType={fuelType}
                price={priceByType.get(fuelType) ?? 0}
                onEdit={() => {
                  setModalError(null);
                  setEditingType(fuelType);
                }}
              />
            ))}
          </div>
        )}

        <PricingConfigCard />
      </div>

      {editingType && (
        <EditPriceModal
          fuelType={editingType}
          currentPrice={priceByType.get(editingType) ?? 0}
          onClose={() => setEditingType(null)}
          onSave={handleSave}
          isSaving={setFuelPrices.isPending}
          error={modalError}
        />
      )}
    </div>
  );
}
