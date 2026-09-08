import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FUEL_TYPE_LABEL_KEY } from '@/constants/order-status';
import type { OfferListItem } from '@/petrol_company/fuel_exchange/api/fuel-exchange.api';

interface AdminFuelExchangeListItemProps {
  offer: OfferListItem;
}

/**
 * spec 016 (broadcast fuel exchange offers) T100/FR-023 — read-only oversight, no raise,
 * answer, award or withdraw control anywhere. `raisedByCompanyName` now travels on the
 * offer itself (T034's viewer-shaped payload grants `SUPER_ADMIN` the same shape as the
 * raiser), so this no longer needs its own `GET /companies?type=FUEL` company-name
 * lookup the directed-model version required.
 *
 * **This screen renders correctly even when the isolation mechanism is broken** — see
 * `contracts/isolation-contract.md`: `SUPER_ADMIN` bypasses `party-set-scope.plugin.ts`
 * entirely and would see every offer here regardless of whether the plugin's `$or`
 * correctly scoped a FUEL_COMPANY_ADMIN's own view. Do not treat this screen loading
 * correctly as evidence the isolation mechanism works — only
 * `FuelExchangePage.tsx` (a real fuel company's own incoming list) can prove that.
 */
export function AdminFuelExchangeListItem({ offer }: AdminFuelExchangeListItemProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const created = new Date(offer.createdAt);

  return (
    <div
      onClick={() => navigate(`/admin/fuel-exchange/${offer._id}`)}
      className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 border border-slate-200 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all bg-white cursor-pointer"
    >
      <div className="flex items-center gap-4 w-full xl:w-auto xl:min-w-[220px]">
        <div className="flex flex-col">
          <span className="font-black text-slate-900 text-sm">{offer.raisedByCompanyName}</span>
          <span className="text-xs text-slate-500 font-bold mt-0.5">{t(`fuelExchange.state.${offer.state}`)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 w-full xl:w-auto bg-slate-50/50 rounded-xl p-3 border border-slate-100">
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm font-black text-slate-900">{t(FUEL_TYPE_LABEL_KEY[offer.fuelType])}</span>
          <span className="text-xs text-slate-500 mt-1 font-semibold">{t('fuelExchange.fuelType')}</span>
        </div>
        <div className="flex flex-col items-center justify-center md:border-r border-slate-200">
          <span className="text-sm font-black text-slate-900">{offer.quantityLitres.toLocaleString()}</span>
          <span className="text-xs text-slate-500 mt-1 font-semibold">{t('fuelExchange.litres')}</span>
        </div>
        {offer.agreedUnitPrice !== undefined ? (
          <>
            <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-r border-slate-200 pt-3 md:pt-0">
              <span className="text-sm font-black text-slate-900" dir="ltr">
                {offer.agreedUnitPrice.toFixed(2)} {offer.currency}
              </span>
              <span className="text-xs text-slate-500 mt-1 font-semibold">{t('fuelExchange.unitPrice')}</span>
            </div>
            <div className="flex flex-col items-center justify-center md:border-r border-slate-200 border-t md:border-t-0 pt-3 md:pt-0">
              <span className="text-sm font-black text-slate-900" dir="ltr">
                {offer.agreedTotal?.toLocaleString()} {offer.currency}
              </span>
              <span className="text-xs text-slate-500 mt-1 font-semibold">{t('fuelExchange.total')}</span>
            </div>
          </>
        ) : null}
      </div>

      <div className="flex items-center justify-end w-full xl:w-auto xl:min-w-[120px]">
        <span className="text-xs font-bold text-slate-400">{created.toLocaleDateString(i18n.language)}</span>
      </div>
    </div>
  );
}
