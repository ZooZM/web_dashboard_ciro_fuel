import { useTranslation } from 'react-i18next';
import { useCurrentCommissionTerm, useMyBillingBalances } from '@/petrol_company/invoices/hooks/useBilling';
import { CommissionBasis } from '@/petrol_company/invoices/api/billing.api';

// Feature 013 T154/T155/FR-055/FR-056/FR-061: real commission rate (`GET
// /billing/commission-terms/current`) and real accrued/owed balance (`GET
// /billing/balances/me`) — no edit affordance at all, deliberately, since setting the
// rate is the platform operator's action alone (US13), not this role's. The previous
// version's edit `Dialog`/`CommissionTypeSelector` trigger is removed rather than
// disabled, per T155.
export function PlatformCommissionBanner() {
  const { t, i18n } = useTranslation();
  const { data: term, isLoading: termLoading } = useCurrentCommissionTerm();
  const { data: balances, isLoading: balancesLoading } = useMyBillingBalances();

  const isLoading = termLoading || balancesLoading;

  return (
    <div className="bg-white shadow-sm border-r-4 border-[#F97316] rounded-xl p-5 mb-4 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#F97316] flex items-center justify-center shrink-0">
            <img src="/white-percentage-icon.svg" alt="Percentage" className="w-6 h-6 object-contain" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-slate-900 font-black text-lg">{t('billing.commissionTitle')}</span>
              {!isLoading && term && (
                <span className="text-[#1E5FFF] font-black text-lg" dir="ltr">
                  {term.rate}
                  {term.basis === CommissionBasis.PERCENTAGE ? ' %' : ''}
                </span>
              )}
              {!isLoading && !term && (
                <span className="text-slate-400 font-bold text-sm">{t('billing.notConfigured')}</span>
              )}
            </div>
            {!isLoading && term && (
              <span className="text-slate-400 text-xs font-medium mt-1">
                {term.basis === CommissionBasis.PERCENTAGE ? t('billing.basisPercentage') : t('billing.basisPerUnit')}
                {' — '}
                {t('billing.commissionSubtitle')}
              </span>
            )}
          </div>
        </div>

        {/* Left Section */}
        <div className="flex items-center gap-6">
          {!isLoading && term && (
            <div className="flex flex-col items-end gap-1">
              <span className="text-slate-400 text-[10px]">{t('billing.readOnlyNote')}</span>
              <span className="text-[#162155] font-bold text-sm">
                {new Date(term.effectiveFrom).toLocaleDateString(i18n.language)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-slate-100 my-1"></div>
      <div className="flex items-center justify-between">
        <span className="text-slate-400 font-bold text-xs">{t('billing.owed')}</span>
        <span className="text-[#162155] font-black text-sm" dir="ltr">
          {isLoading ? '—' : (balances?.commissionAccrued ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
          <span className="text-slate-500 text-[10px]">{balances?.currency ?? 'SAR'}</span>
        </span>
      </div>
    </div>
  );
}
