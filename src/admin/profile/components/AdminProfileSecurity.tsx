import { useTranslation } from 'react-i18next';
import type { OperatorAccount } from '@/admin/profile/api/operator-account.api';

interface AdminProfileSecurityProps {
  account: OperatorAccount;
  onOpenPhoneModal: () => void;
}

/**
 * spec 017 (operator dashboard) T125/FR-057–FR-059 — how the operator signs in.
 *
 * Every value here was a literal: the number was "+966 55xxxxxxx", and the last
 * sign-in and session count were invented. All three are now the platform's.
 *
 * `lastSignInAt` comes from the append-only session audit log rather than from
 * `User.activeSessions`, which holds only CURRENT sessions — read from the
 * array it would report "never signed in" for an operator who signs in and out
 * daily (research R10).
 */
export function AdminProfileSecurity({ account, onOpenPhoneModal }: AdminProfileSecurityProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-b from-orange-100 via-orange-50 to-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col gap-6 w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
          <img
            src="/transportCompany/profilePage/lock.svg"
            alt=""
            className="w-6 h-6 object-contain"
          />
        </div>
        <span className="text-[#162155] font-black text-lg">{t('profile.security')}</span>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-[#E7E9EF] pb-4">
          <span className="text-[#858C95] text-xs font-bold">
            {t('operatorAccount.signInNumber')}
          </span>
          <span className="text-[#162155] font-black text-sm" dir="ltr">
            {account.phone}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-[#E7E9EF] pb-4">
          <span className="text-[#858C95] text-xs font-bold">
            {t('operatorAccount.lastSignIn')}
          </span>
          <span className="text-[#162155] font-black text-sm">
            {account.lastSignInAt
              ? new Date(account.lastSignInAt).toLocaleString()
              : t('operatorAccount.neverSignedIn')}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-[#E7E9EF] pb-4">
          <span className="text-[#858C95] text-xs font-bold">
            {t('operatorAccount.activeSessions')}
          </span>
          <span className="text-[#162155] font-black text-sm">
            {account.activeSessionCount}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenPhoneModal}
          className="w-full py-2.5 bg-white border border-[#E7E9EF] rounded-xl text-blue-600 text-sm font-bold hover:bg-slate-50 transition-colors"
        >
          {t('operatorAccount.changePhone')}
        </button>
      </div>
    </div>
  );
}
