import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMyBillingBalances } from '@/petrol_company/invoices/hooks/useBilling';

// Feature 013 T154/T156/FR-061/FR-062c: real balances from `GET /billing/balances/me`.
// The two "من X عملية"/"من X فاتورة محولة" counts and the "آخر فاتورة"/"تحديث يومي"
// timestamp lines from the old mock had no backing data source and are dropped rather
// than fabricated; `ceilingWarning`/`ceilingExceeded` are read directly off the balances
// response (the same figures `BillingService.assertUnderCeiling` gates approval on) so
// this banner can never disagree with what actually blocks deferred/credit dealing.
export function ProfileCommissionSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: balances, isLoading } = useMyBillingBalances();

  const commissionBalance = balances?.commissionAccrued ?? 0;
  const commissionMaxLimit = balances?.commissionCeiling ?? 0;
  const cashbackBalance = balances?.cashbackAccrued ?? 0;
  const commissionPercentage = commissionMaxLimit > 0 ? Math.min((commissionBalance / commissionMaxLimit) * 100, 100) : 0;

  if (isLoading) {
    return <p className="text-center text-sm text-slate-400 py-6">{t('common.loading')}</p>;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Warning / Exceeded Banner */}
      {balances?.ceilingExceeded && (
        <div className="bg-red-50/50 border border-dashed border-red-500 rounded-2xl p-6 flex flex-col text-right gap-2">
          <div className="flex items-center gap-2 justify-start w-full">
            <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shrink-0">
              <span className="text-white font-black text-lg leading-none mb-0.5">!</span>
            </div>
            <span className="text-[#162155] font-black text-xl">{t('billing.ceilingExceededTitle')}</span>
          </div>
          <span className="text-[#858C95] font-bold text-sm pr-9">
            {t('billing.ceilingExceededBody', { accrued: commissionBalance.toLocaleString('en-US'), ceiling: commissionMaxLimit.toLocaleString('en-US') })}
          </span>
        </div>
      )}
      {!balances?.ceilingExceeded && balances?.ceilingWarning && (
        <div className="bg-amber-50/50 border border-dashed border-amber-500 rounded-2xl p-6 flex flex-col text-right gap-2">
          <div className="flex items-center gap-2 justify-start w-full">
            <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
              <span className="text-white font-black text-lg leading-none mb-0.5">!</span>
            </div>
            <span className="text-[#162155] font-black text-xl">{t('billing.ceilingWarningTitle')}</span>
          </div>
          <span className="text-[#858C95] font-bold text-sm pr-9">
            {t('billing.ceilingWarningBody', { accrued: commissionBalance.toLocaleString('en-US'), ceiling: commissionMaxLimit.toLocaleString('en-US') })}
          </span>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ gridAutoRows: '1fr' }}>

        {/* Cashback Card (Right in RTL) */}
        <div className="rounded-3xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-green-100 via-green-50 to-white/80">
          {/* Header */}
          <div className="flex justify-start items-start mb-6">
            <div className="flex flex-col text-right">
              <h3 className="text-[#162155] font-black text-lg">{t('billing.cashbackTitle')}</h3>
              <p className="text-[#858C95] text-xs font-semibold mt-1">{t('billing.cashbackSubtitle')}</p>
            </div>
          </div>

          {/* Middle Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-[#16A34A]">
              <span className="font-black text-[34px] tracking-tight">{cashbackBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="font-bold text-[15px] mt-1.5">{balances?.currency ?? 'SAR'}</span>
            </div>

            <div className="w-12 h-12 rounded-[14px] bg-[#16A34A] flex items-center justify-center shrink-0 shadow-sm shadow-green-500/20">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M35.517 14.9997H23.3629C20.5853 14.9997 18.3337 17.2383 18.3337 19.9997C18.3337 22.7611 20.5853 24.9997 23.3629 24.9997H35.517M23.3337 19.9997V20.0163M5.92625 9.53671C6.80588 8.93486 12.9633 8.33301 20.0003 8.33301C27.0374 8.33301 33.1948 8.93486 34.0744 9.53671C34.593 9.89152 35.1115 12.3348 35.4499 14.5831C35.5349 15.1479 35.6085 15.753 35.6679 16.3887C35.7731 17.5147 35.8337 18.7365 35.8337 19.9998C35.8337 21.9761 35.6855 23.851 35.4499 25.4164C35.1115 27.6647 34.593 30.1078 34.0744 30.4626C33.1948 31.0645 27.0374 31.6663 20.0003 31.6663C12.9633 31.6663 6.80588 31.0645 5.92625 30.4626C5.04662 29.8608 4.16699 24.8146 4.16699 19.9998C4.16699 18.7365 4.22754 17.5147 4.33276 16.3887C4.62856 13.2228 5.27741 9.98066 5.92625 9.53671Z" stroke="#F2E7FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[#bbf7d0] mb-4"></div>

          {/* Footer */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => navigate('/petrolCompany/invoices')}
              className="flex items-center gap-2 text-[#162155] font-black text-[13px] hover:text-[#16A34A] transition-colors group ease-in"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:[&_path]:stroke-[#16A34A] transition-colors">
                <path d="M9 13H13M9 17H15M15 4.27928V3H9V4.27928M15 4.27928V6H9V4.27928M15 4.27928C18.3745 5.0462 19.5 7.5037 19.5 13C19.5 19.8824 17.7353 22 12 22C6.26471 22 4.5 19.8824 4.5 13C4.5 7.5037 5.62549 5.0462 9 4.27928" stroke="#162155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t('billing.viewDetails')}
            </button>
          </div>
        </div>

        {/* Commission Card (Left in RTL) */}
        <div className="rounded-3xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-purple-200/40 via-purple-100/20 to-white/80">
          {/* Header */}
          <div className="flex justify-start items-start mb-6">
            <div className="flex flex-col text-right">
              <h3 className="text-[#162155] font-black text-lg">{t('billing.commissionTitle')}</h3>
              <p className="text-[#858C95] text-xs font-semibold mt-1">{t('billing.owed')}</p>
            </div>
          </div>

          {/* Middle Row */}
          <div className="flex items-center justify-between mb-4 mt-2">
            <div className="flex items-center gap-1.5 text-[#8b5cf6]">
              <span className="font-black text-[34px] tracking-tight">{commissionBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="font-bold text-[15px] mt-1.5">{balances?.currency ?? 'SAR'}</span>
            </div>

            <div className="w-12 h-12 rounded-[14px] bg-[#8b5cf6] flex items-center justify-center shrink-0 shadow-sm shadow-purple-600/20">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.33333 22.6667L22.6667 9.33333M31 16C31 24.2843 24.2843 31 16 31C7.71573 31 1 24.2843 1 16C1 7.71573 7.71573 1 16 1C24.2843 1 31 7.71573 31 16ZM24.3333 21C24.3333 22.8409 22.8409 24.3333 21 24.3333C19.1591 24.3333 17.6667 22.8409 17.6667 21C17.6667 19.1591 19.1591 17.6667 21 17.6667C22.8409 17.6667 24.3333 19.1591 24.3333 21ZM14.3333 11C14.3333 12.8409 12.8409 14.3333 11 14.3333C9.15905 14.3333 7.66667 12.8409 7.66667 11C7.66667 9.15905 9.15905 7.66667 11 7.66667C12.8409 7.66667 14.3333 9.15905 14.3333 11Z" stroke="#F2E7FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col gap-1.5 mb-5 mt-2">
            <div className="w-full bg-white rounded-full h-[10px] overflow-hidden flex justify-start shadow-lg">
              <div
                className="h-[10px] rounded-full transition-all duration-1000 ease-out bg-[#8B3FE8]"
                style={{ width: `${commissionPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-start text-[#94a3b8] text-[11px] font-semibold gap-1 mt-1">
              <span>{t('billing.ceilingLimit', { ceiling: commissionMaxLimit.toLocaleString('en-US') })}</span>
              <span dir="ltr">(%{commissionPercentage.toFixed(1)})</span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[#e9d5ff] mb-4"></div>

          {/* Footer */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => navigate('/petrolCompany/payment')}
              className="flex items-center gap-2 text-[#162155] font-black text-[13px] hover:text-[#8b5cf6] transition-colors group ease-in"
            >
              <svg width="24" className="group-hover:[&_path]:stroke-[#8b5cf6]" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 14H12M20.9058 10H3.09424M20.9058 10C20.7376 8.24663 20.3688 6.91254 20 6.66667C19.5 6.33333 16 6 12 6C8 6 4.5 6.33333 4 6.66667C3.63118 6.91254 3.26238 8.24663 3.09424 10M20.9058 10C20.9656 10.6237 21 11.3004 21 12C21 14.6667 20.5 17 20 17.3333C19.5 17.6667 16 18 12 18C8 18 4.5 17.6667 4 17.3333C3.5 17 3 14.6667 3 12C3 11.3004 3.03443 10.6237 3.09424 10" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t('billing.payOwed')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
