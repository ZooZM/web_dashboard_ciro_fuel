import { useTranslation } from 'react-i18next';
import type { FuelCompany } from '@/admin/petrol_companies/api/fuel-companies.api';

interface AdminPetrolCompanyInfoCardProps {
  company: FuelCompany;
}

// Feature 013 T238/FR-089: real `Company` fields only. The previous mock's manager
// name/job title/city/region and an "edit" affordance are all dropped — `Company` has no
// such fields, and the platform has no general-purpose `PATCH /companies/:id` at all
// (only `:id/status` and `:id/commission-ceiling`), so an edit control here would be a
// button with nothing behind it.
export function AdminPetrolCompanyInfoCard({ company }: AdminPetrolCompanyInfoCardProps) {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col h-full border border-[#E7E9EF]">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <img src="/petrolCompany/owner/user.svg" alt="" className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black text-[#162155]">{t('adminCompanies.companyInfo')}</h3>
      </div>

      <div className="grid grid-cols-2 gap-y-6 gap-x-6">
        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-[#858C95] mb-1">{t('adminCompanies.companyName')}</span>
          <span className="text-sm font-black text-[#162155]">{company.name}</span>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-[#858C95] mb-1">{t('adminCompanies.joinedOn')}</span>
          <span className="text-sm font-black text-[#162155]">{new Date(company.createdAt).toLocaleDateString(i18n.language)}</span>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-[#858C95] mb-1">{t('adminCompanies.email')}</span>
          <span className="text-sm font-black text-[#162155] break-all" dir="ltr">{company.contactEmail}</span>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-[#858C95] mb-1">{t('adminCompanies.phone')}</span>
          <span className="text-sm font-black text-[#162155]" dir="ltr">{company.contactPhone}</span>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-[#858C95] mb-1">{t('adminCompanies.fuelGrades')}</span>
          <span className="text-sm font-black text-[#162155]">{company.fuelPrices.length}</span>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-[#858C95] mb-1">{t('adminCompanies.commercialRegister')}</span>
          <span className="text-sm font-black text-[#162155]">
            {company.commercialRegisterFileId ? t('adminCompanies.onFile') : t('adminCompanies.notProvided')}
          </span>
        </div>
      </div>
    </div>
  );
}
