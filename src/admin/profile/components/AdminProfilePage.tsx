import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AdminProfileHeader } from './AdminProfileHeader';
import { AdminProfileAccountCard } from './AdminProfileAccountCard';
import { AdminProfileSecurity } from './AdminProfileSecurity';
import { AdminChangePhoneModal } from './AdminChangePhoneModal';
import { useOperatorAccount } from '@/admin/profile/hooks/useOperatorAccount';

/**
 * spec 017 (operator dashboard) US7 — the operator's own account.
 *
 * **Three components are DELETED**, not emptied, and each is recorded in this
 * feature's Removals table (FR-063, FR-078):
 *
 *  - `AdminProfilePermissions` — the platform has **no permission model beyond
 *    `UserRole`**. There is nothing to fetch now and nothing to fetch later
 *    without a new feature, so the card could only ever have shown invented
 *    permissions.
 *  - `AdminProfileStats` — four per-account statistics (station owners, fuel
 *    companies, …) the platform records nowhere against a USER. The same
 *    figures exist platform-wide on the home dashboard, where they are real.
 *  - `AdminProfileAdditionalData` — a contract start date and a covered-cities
 *    count, neither of which exists on any account record.
 *
 * Rendering them empty would have been worse than removing them: an empty card
 * reads as "nothing yet", which invites someone to go and fill it.
 */
export function AdminProfilePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: account, isLoading, isError, refetch } = useOperatorAccount();
  const [isChangePhoneModalOpen, setIsChangePhoneModalOpen] = useState(false);

  return (
    <>
      <div
        className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans animate-in fade-in duration-500"
        dir="rtl"
      >
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div
              className="flex items-center gap-2 cursor-pointer w-fit"
              onClick={() => navigate('/admin')}
            >
              <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
                <img
                  src="/petrolCompany/requests/details/chevronRight.svg"
                  alt=""
                  className="w-4 h-4"
                />
              </button>
              <span className="text-sm font-semibold text-slate-500">{t('profile.title')}</span>
            </div>
          </div>

          {/* FR-076: loading, failed and loaded each render distinctly. */}
          {isLoading && (
            <div className="h-32 rounded-2xl bg-white border border-slate-200 animate-pulse" />
          )}

          {isError && (
            <div className="bg-white border border-red-200 rounded-2xl p-6 text-right">
              <p className="text-sm font-bold text-red-700 mb-3">{t('profile.failed')}</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold"
              >
                {t('common.retry')}
              </button>
            </div>
          )}

          {account && (
            <>
              <AdminProfileHeader account={account} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="flex flex-col gap-6 col-span-1 lg:col-span-2">
                  <AdminProfileAccountCard account={account} />
                </div>

                <div className="flex flex-col gap-6 col-span-1 lg:col-span-1">
                  <AdminProfileSecurity
                    account={account}
                    onOpenPhoneModal={() => setIsChangePhoneModalOpen(true)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <AdminChangePhoneModal
        isOpen={isChangePhoneModalOpen}
        onClose={() => setIsChangePhoneModalOpen(false)}
      />
    </>
  );
}
