import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useCurrentCashbackProgramme, useMyBillingBalances } from '@/petrol_company/invoices/hooks/useBilling';
import { CommissionBasis } from '@/petrol_company/invoices/api/billing.api';

// Feature 013 T154/T155/FR-055/FR-060/FR-061: real cashback programme (`GET
// /billing/cashback-programme/current`) and real available balance (`GET
// /billing/balances/me`). No edit dialog and no on/off toggle — turning the programme on
// or off, like setting the rate, is the platform operator's action alone (US13); this
// role only ever reads it, per T155.
export function CashbackBanner() {
  const { t, i18n } = useTranslation();
  const { data: programme, isLoading: programmeLoading } = useCurrentCashbackProgramme();
  const { data: balances, isLoading: balancesLoading } = useMyBillingBalances();

  const isLoading = programmeLoading || balancesLoading;
  const isActive = programme?.isActive ?? false;

  return (
    <div className="bg-white border-r-4 border-[#8B3FE8] shadow-sm rounded-xl p-5 mb-4 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#8B5CF6] flex items-center justify-center shrink-0">
            <img src="/gift-icon.svg" alt="Gift" className="w-6 h-6 object-contain" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-slate-900 font-black text-lg">{t('billing.cashbackTitle')}</span>
              {!isLoading && programme && (
                <span className="text-[#1E5FFF] font-black text-lg" dir="ltr">
                  {programme.rate}
                  {programme.basis === CommissionBasis.PERCENTAGE ? ' %' : ''}
                </span>
              )}
              {!isLoading && !programme && (
                <span className="text-slate-400 font-bold text-sm">{t('billing.notConfigured')}</span>
              )}
              {!isLoading && programme && (
                <div
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-bold',
                    isActive ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEE2E2] text-[#EF4444]',
                  )}
                >
                  {isActive ? t('billing.active') : t('billing.inactive')}
                </div>
              )}
            </div>
            {!isLoading && programme && (
              <span className="text-slate-400 text-xs font-medium mt-1">
                {programme.basis === CommissionBasis.PERCENTAGE ? t('billing.basisPercentage') : t('billing.basisPerUnit')}
                {' — '}
                {t('billing.cashbackSubtitle')}
              </span>
            )}
          </div>
        </div>

        {/* Left Section */}
        <div className="flex items-center gap-6">
          {!isLoading && programme && (
            <div className="flex flex-col items-end gap-1">
              <span className="text-slate-400 text-[10px]">{t('billing.readOnlyNote')}</span>
              <span className="text-[#162155] font-bold text-sm">
                {new Date(programme.effectiveFrom).toLocaleDateString(i18n.language)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-slate-100 my-1"></div>
      <div className="flex items-center justify-between">
        <span className="text-slate-400 font-bold text-xs">{t('billing.available')}</span>
        <span className="text-[#162155] font-black text-sm" dir="ltr">
          {isLoading ? '—' : (balances?.cashbackAccrued ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
          <span className="text-slate-500 text-[10px]">{balances?.currency ?? 'SAR'}</span>
        </span>
      </div>
    </div>
  );
}
