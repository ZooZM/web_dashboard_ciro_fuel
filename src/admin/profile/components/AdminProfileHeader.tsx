import { useTranslation } from 'react-i18next';
import type { OperatorAccount } from '@/admin/profile/api/operator-account.api';

/**
 * spec 017 (operator dashboard) T125/FR-057 — the operator's real name and
 * email.
 *
 * The "DRV-2024-011 · تاريخ الانضمام 2022/01/15" caption is REMOVED: neither
 * value exists on an account record, and the first was a DRIVER-shaped
 * identifier on the platform operator's own profile.
 */
export function AdminProfileHeader({ account }: { account: OperatorAccount }) {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 relative overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-black">
          {account.fullName.charAt(0)}
        </div>
        <div className="flex flex-col gap-1.5 text-right">
          <div className="flex items-center gap-3">
            <span className="text-[#162155] font-black text-xl">{account.fullName}</span>
            <div className="px-3 py-1 bg-[#ECFDF5] text-[#10B981] text-[10px] font-bold rounded-full">
              {t('roles.SUPER_ADMIN')}
            </div>
          </div>
          <span className="text-[#858C95] text-xs font-bold" dir="ltr">
            {account.email}
          </span>
        </div>
      </div>
    </div>
  );
}
