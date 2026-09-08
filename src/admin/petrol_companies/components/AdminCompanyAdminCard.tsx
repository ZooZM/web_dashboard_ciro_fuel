import { useTranslation } from 'react-i18next';
import { KeyRound } from 'lucide-react';
import { useCompanyAdmins } from '@/admin/petrol_companies/hooks/useCompanyAdmins';
import type { Role } from '@/constants/roles';

/**
 * The company's administrator account, and above all the number that account signs in
 * with. Every other card on these screens shows `Company.contactPhone` — a business
 * contact line that is NOT a credential and, in this platform's data, never matches the
 * administrator's own mobile. Showing only that left the sign-in number write-only: set
 * once on the onboarding form and never displayed again anywhere in the dashboard.
 */
export function AdminCompanyAdminCard({
  companyId,
  role,
}: {
  companyId: string;
  role: Role;
}) {
  const { t } = useTranslation();
  const { data: admins, isLoading, isError } = useCompanyAdmins(companyId, role);

  return (
    <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-start gap-2 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <KeyRound className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-base font-black text-[#162155]">{t('adminCompanies.adminAccount')}</h3>
      </div>

      {isLoading ? (
        <p className="text-sm font-bold text-slate-400">{t('common.loading')}</p>
      ) : isError ? (
        <p className="text-sm font-bold text-red-500">{t('errors.generic')}</p>
      ) : !admins || admins.length === 0 ? (
        <p className="text-sm font-bold text-slate-400">{t('adminCompanies.noAdmin')}</p>
      ) : (
        <div className="flex flex-col gap-5">
          {admins.map((admin) => (
            <div key={admin._id} className="flex flex-col gap-3">
              <div className="flex flex-col items-start">
                <span className="text-[11px] font-bold text-[#858C95] mb-1">
                  {t('common.fullName')}
                </span>
                <span className="text-sm font-black text-[#162155]">
                  {admin.fullName}
                  {!admin.isActive && (
                    <span className="mr-2 text-[11px] font-bold text-red-500">
                      ({t('common.inactive')})
                    </span>
                  )}
                </span>
              </div>

              <div className="flex flex-col items-start">
                <span className="text-[11px] font-bold text-[#858C95] mb-1">
                  {t('adminCompanies.email')}
                </span>
                <span className="text-sm font-black text-[#162155]" dir="ltr">{admin.email}</span>
              </div>

              <div className="flex flex-col items-start">
                <span className="text-[11px] font-bold text-[#858C95] mb-1">
                  {t('adminCompanies.signInPhone')}
                </span>
                <span className="text-sm font-black text-[#162155]" dir="ltr">{admin.phone}</span>
                <span className="text-[10px] font-bold text-slate-400 mt-1 leading-relaxed">
                  {t('adminCompanies.signInPhoneHint')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
