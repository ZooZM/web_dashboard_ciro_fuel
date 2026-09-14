import { useTranslation } from 'react-i18next';
import type { OperatorAccount } from '@/admin/profile/api/operator-account.api';

/**
 * spec 017 (operator dashboard) T125/FR-057/FR-058/FR-059 — the operator's
 * account, read-only.
 *
 * Was an edit form whose Save button closed the form and wrote nothing: there
 * is no route for an operator to change their own name or email, so the card
 * looked editable and was not. Shown as facts instead — the same call this
 * whole feature keeps making, that a control over a capability the platform
 * does not have is worse than no control.
 *
 * The sign-in number DOES have a change flow, and it lives beside this card in
 * `AdminProfileSecurity`, where the verification step it actually requires can
 * be presented properly.
 */
export function AdminProfileAccountCard({ account }: { account: OperatorAccount }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col gap-6 w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <img
            src="/transportCompany/profilePage/detail.svg"
            alt=""
            className="w-5 h-5 object-contain"
          />
        </div>
        <span className="text-[#162155] font-black text-lg">{t('profile.account')}</span>
      </div>

      <dl className="flex flex-col text-right">
        <Row label={t('common.fullName')} value={account.fullName} />
        <Row label={t('common.email')} value={account.email} ltr />
        {/* FR-057 — the REAL number, not the mask the mock rendered. */}
        <Row label={t('operatorAccount.signInNumber')} value={account.phone} ltr />
        <Row
          label={t('operatorAccount.activeSessions')}
          value={String(account.activeSessionCount)}
        />
        <Row
          label={t('operatorAccount.lastSignIn')}
          value={
            // `null` means genuinely never — a distinct fact from "not
            // recorded", so it gets its own wording rather than a blank.
            account.lastSignInAt
              ? new Date(account.lastSignInAt).toLocaleString()
              : t('operatorAccount.neverSignedIn')
          }
        />
      </dl>
    </div>
  );
}

function Row({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-[#E7E9EF] last:border-0">
      <dt className="text-xs font-bold text-[#858C95]">{label}</dt>
      <dd className="text-sm font-black text-[#162155]" dir={ltr ? 'ltr' : undefined}>
        {value}
      </dd>
    </div>
  );
}
