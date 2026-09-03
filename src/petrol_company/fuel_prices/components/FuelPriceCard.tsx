import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { FuelIcon } from '@/transport_company/tracking/components/FuelIcon';
import { fuelTypeLabelKey } from '@/constants/order-status';
import type { FuelType } from '@/constants/order-status';

// Feature 013 T093/T094/FR-037/FR-098: wired to a real `{fuelType, basePricePerLiter}`
// pair. Dropped: the change indicator, "last update"/"scheduled update" and an
// active/inactive toggle — none of these are tracked anywhere (`Company.fuelPrices` is
// just the current price, no history, no scheduling concept on this platform).
const COLOR_BY_FUEL_TYPE: Record<FuelType, { border: string; iconBg: string }> = {
  DIESEL: { border: 'border-[#FF5810]', iconBg: 'bg-[#FF5810]/10' },
  PETROL_91: { border: 'border-[#12A150]', iconBg: 'bg-[#12A150]/10' },
  PETROL_95: { border: 'border-[#EF3F3F]', iconBg: 'bg-[#EF3F3F]/10' },
  KEROSENE: { border: 'border-[#1E5FFF]', iconBg: 'bg-[#1E5FFF]/10' },
};

interface FuelPriceCardProps {
  fuelType: FuelType;
  price: number;
  onEdit: () => void;
}

export function FuelPriceCard({ fuelType, price, onEdit }: FuelPriceCardProps) {
  const { t } = useTranslation();
  const colors = COLOR_BY_FUEL_TYPE[fuelType];

  return (
    <div
      className={cn("bg-white rounded-2xl shadow-sm border-t-4 p-5 flex flex-col justify-between h-full", colors.border)}
      style={{ boxShadow: '0 2px 8px -2px rgba(0,0,0,0.05)' }}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colors.iconBg)}>
            <FuelIcon type={fuelType} className="w-5 h-5" />
          </div>
          <span className="font-black text-slate-900 text-lg">{t(fuelTypeLabelKey(fuelType))}</span>
        </div>

        <button
          onClick={onEdit}
          className="w-8 h-8 rounded-lg border border-blue-100 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
        >
          <img src="/petrolCompany/orderDetails/edit.svg" alt="" className='w-4 h-4' />
        </button>
      </div>

      <div className="flex items-end justify-start gap-1">
        <span className="text-3xl font-black text-[#162155] tracking-tight">{price.toFixed(2)}</span>
        <span className="text-[11px] font-bold text-slate-400 pb-1">{t('pricing.perLiter')}</span>
      </div>
    </div>
  );
}
