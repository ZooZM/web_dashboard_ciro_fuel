import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateTank } from '@/transport_company/trucks/hooks/useTanks';
import { FUEL_TYPES, type FuelType } from '@/constants/order-status';
import type { TankMaterial } from '@/transport_company/trucks/types';
import { toast } from '@/lib/toast/toast';
import { apiErrorMessage } from '@/lib/api/api-error';
import { cn } from '@/lib/utils';

interface AddTankFormProps {
  onCancel: () => void;
  entityName: string;
}

const CAPACITY_STEP = 1000;
const MIN_CAPACITY = 1000;

/**
 * Feature 009 T085/FR-040: `capacityLiters` and `fuelTypes` are required, not optional
 * detail — they are what the assignment guards (TANK_CAPACITY_EXCEEDED/TANK_GRADE_
 * UNSUPPORTED) validate against.
 */
export function AddTankForm({ onCancel, entityName }: AddTankFormProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [material, setMaterial] = useState<TankMaterial>('ALUMINIUM');
  const [capacity, setCapacity] = useState(20_000);
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);

  const createTank = useCreateTank();

  function toggleFuelType(type: FuelType): void {
    setFuelTypes((prev) => (prev.includes(type) ? prev.filter((f) => f !== type) : [...prev, type]));
  }

  function onCreate(): void {
    if (!code.trim() || fuelTypes.length === 0) return;
    createTank.mutate(
      { code: code.trim(), material, maxCapacityLiters: capacity, fuelTypes },
      {
        onSuccess: onCancel,
        // Asserted "duplicate tank code" for every failure alike — same trap as the plate
        // above. Kept as the fallback, but never stated over the platform's own message.
        onError: (err) => toast.error(apiErrorMessage(err, t('trucks.duplicateTankCode'))),
      },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-6 w-full">
        <div className="flex flex-col flex-1 gap-2">
          <span className="text-xs font-bold text-slate-400 text-right">{t('trucks.tankCode')}</span>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t('trucks.tankCode')}
            className="w-full h-[60px] border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm text-right"
          />
        </div>

        <div className="flex flex-col flex-1 gap-2">
          <span className="text-xs font-bold text-slate-400 text-right">{t('trucks.capacity')}</span>
          <div className="flex items-center justify-between border border-slate-200 rounded-xl bg-white p-2 h-[60px] shadow-sm">
            <button
              type="button"
              onClick={() => setCapacity((c) => Math.max(MIN_CAPACITY, c - CAPACITY_STEP))}
              className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors shrink-0"
            >
              −
            </button>
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm font-black text-slate-900" dir="ltr">{capacity.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-slate-400">{t('trucks.liters')}</span>
            </div>
            <button
              type="button"
              onClick={() => setCapacity((c) => c + CAPACITY_STEP)}
              className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors shrink-0"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-400 text-right">{t('trucks.material')}</span>
        <div className="flex gap-6 w-full">
          <button
            type="button"
            onClick={() => setMaterial('ALUMINIUM')}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-3 border rounded-xl p-6 transition-colors shadow-sm',
              material === 'ALUMINIUM' ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200 hover:border-blue-200',
            )}
          >
            <span className="text-sm font-bold text-slate-700">{t('trucks.materialAluminium')}</span>
          </button>
          <button
            type="button"
            onClick={() => setMaterial('IRON')}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-3 border rounded-xl p-6 transition-colors shadow-sm',
              material === 'IRON' ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200 hover:border-blue-200',
            )}
          >
            <span className="text-sm font-bold text-slate-700">{t('trucks.materialIron')}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-400 text-right">{t('drivers.fuelTypes')}</span>
        <div className="flex flex-wrap gap-2">
          {FUEL_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={fuelTypes.includes(type)}
              onClick={() => toggleFuelType(type)}
              className={cn(
                'rounded-md border px-3 py-1.5 text-xs font-bold transition-colors',
                fuelTypes.includes(type) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600',
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-2">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 px-6 py-2.5 rounded-xl transition-colors text-sm font-bold"
        >
          {t('common.cancel')}
        </button>
        <button
          onClick={onCreate}
          disabled={createTank.isPending || !code.trim() || fuelTypes.length === 0}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-colors text-sm font-bold shadow-sm disabled:opacity-50"
        >
          {t('trucks.addEntity', { entity: entityName })}
        </button>
      </div>
    </div>
  );
}
