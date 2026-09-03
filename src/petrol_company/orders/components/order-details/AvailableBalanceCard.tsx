import { useTranslation } from 'react-i18next';
import { useOrderDetailContext } from './OrderDetailContext';
import { useLitreBalancesList } from '@/petrol_company/litre_balances/hooks/useLitreBalances';
import { FUEL_TYPE_LABEL_KEY } from '@/constants/order-status';

// Feature 013 T207/FR-073c/FR-074/FR-098: the station owner's litre balance for THIS
// order's own fuel grade — wired to `GET /litre-balances?clientId=`, the same endpoint
// `DueLitersBalanceCard.tsx` uses for the owner's full list. Litres, always with the
// grade named alongside the number (FR-098's "state the unit" applies to litres exactly
// as it does to currency).
export function AvailableBalanceCard() {
  const { t } = useTranslation();
  const { order } = useOrderDetailContext();
  const { data: balances, isLoading } = useLitreBalancesList(order?.clientId);

  if (!order) return null;
  const balance = balances?.find((b) => b.fuelType === order.fuelType);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-2">
      <span className="text-xs font-bold text-slate-400">{t('litreBalances.availableForGrade', { grade: t(FUEL_TYPE_LABEL_KEY[order.fuelType]) })}</span>
      {isLoading ? (
        <span className="text-sm text-slate-400">{t('common.loading')}</span>
      ) : (
        <span className="text-2xl font-black text-[#162155]">
          {(balance?.balanceLitres ?? 0).toLocaleString()} <span className="text-sm font-bold text-slate-500">L</span>
        </span>
      )}
    </div>
  );
}
