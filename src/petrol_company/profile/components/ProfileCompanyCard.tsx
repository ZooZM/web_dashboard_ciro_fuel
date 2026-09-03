import { useTranslation } from 'react-i18next';
import type { MyCompany } from '@/petrol_company/profile/api/profile.api';

// Feature 013 T127/FR-054: wired to `GET /companies/:id`. Read-only throughout — no
// endpoint lets a FUEL_COMPANY_ADMIN edit their own company's core fields (only
// fuel-prices/pricing-config/covered-regions have dedicated write routes, all elsewhere
// on this dashboard). Dropped: a fabricated commercial-register NUMBER (the real field is
// a stored file reference, not a text number — `commercialRegisterFileId`, no download UI
// built here), a city/headquarters address (no such field exists on `Company` at all) and
// a fake short "company code" (replaced with the real `_id`).
export function ProfileCompanyCard({ company }: { company: MyCompany }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col gap-8 w-full h-full">
      <div className="flex items-center justify-start w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/transportCompany/profilePage/filledTruck.svg" alt="" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-[#162155] font-black text-lg">{t('profile.companyData')}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-2">
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-2 text-right">
            <span className="text-[#858C95] text-xs font-bold">{t('profile.companyName')}</span>
            <span className="text-[#162155] font-black text-sm">{company.name}</span>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <span className="text-[#858C95] text-xs font-bold">{t('common.email')}</span>
            <span className="text-[#162155] font-black text-sm" dir="ltr">{company.contactEmail}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-2 text-right">
            <span className="text-[#858C95] text-xs font-bold">{t('common.phone')}</span>
            <span className="text-[#162155] font-black text-sm" dir="ltr">{company.contactPhone}</span>
          </div>
          <div className="flex flex-col gap-2 text-right items-start">
            <div className="flex flex-row items-center justify-start gap-2 mt-1 w-full">
              <span className="text-[#858C95] text-xs font-bold">{t('profile.companyCode')}</span>
              <span className="bg-[#F1F3F5] text-[#858C95] px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                <img src="/transportCompany/profilePage/filledLock.svg" alt="" className="w-3 h-3 object-contain" />
                {t('profile.notEditable')}
              </span>
            </div>
            <span className="text-[#162155] font-black text-sm text-end w-full" dir="ltr">{company._id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
