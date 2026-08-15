import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/stores/session.store';
import {
  useCompanyProfile,
  useUpdateCompanyProfile,
  useFuelPrices,
  useSetFuelPrices,
} from '@/features/settings/hooks/useSettings';
import { FUEL_TYPES } from '@/constants/order-status';
import type { FuelPrice } from '@/features/settings/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useSession();
  const companyId = user?.companyId ?? '';

  const { data: profile } = useCompanyProfile(companyId);
  const updateProfile = useUpdateCompanyProfile(companyId);
  const [name, setName] = useState('');

  useEffect(() => {
    if (profile) setName(profile.name);
  }, [profile]);

  const { data: prices } = useFuelPrices(companyId);
  const setPrices = useSetFuelPrices(companyId);
  const [draftPrices, setDraftPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    if (prices) {
      setDraftPrices(Object.fromEntries(prices.map((p) => [p.fuelType, p.basePricePerLiter])));
    }
  }, [prices]);

  function onSavePrices(): void {
    const payload: FuelPrice[] = FUEL_TYPES.map((fuelType) => ({
      fuelType,
      basePricePerLiter: draftPrices[fuelType] ?? 0,
    }));
    setPrices.mutate(payload);
  }

  return (
    <div className="flex flex-col gap-8 max-w-lg">
      <section>
        <h1 className="mb-3 text-xl font-semibold">{t('settings.companyProfile')}</h1>
        <div className="flex flex-col gap-2">
          <Label htmlFor="company-name">{t('companies.name')}</Label>
          <Input id="company-name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button
            className="self-start"
            onClick={() => updateProfile.mutate(name)}
            disabled={updateProfile.isPending}
          >
            {t('common.save')}
          </Button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">{t('settings.fuelPrices')}</h2>
        <div className="flex flex-col gap-3">
          {FUEL_TYPES.map((fuelType) => (
            <div key={fuelType} className="flex items-center gap-3">
              <Label htmlFor={`price-${fuelType}`} className="w-16">
                {fuelType}
              </Label>
              <Input
                id={`price-${fuelType}`}
                type="number"
                step="0.01"
                value={draftPrices[fuelType] ?? ''}
                onChange={(e) =>
                  setDraftPrices((prev) => ({ ...prev, [fuelType]: Number(e.target.value) }))
                }
                aria-label={t('settings.basePricePerLiter')}
              />
            </div>
          ))}
          <Button className="self-start" onClick={onSavePrices} disabled={setPrices.isPending}>
            {t('common.save')}
          </Button>
        </div>
      </section>
    </div>
  );
}
