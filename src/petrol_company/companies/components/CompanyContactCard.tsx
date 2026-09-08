import { useTranslation } from 'react-i18next';
import type { Transporter } from '@/petrol_company/companies/api/transporters.api';

// Feature 013 T086/FR-035: wired to the transporter's own `contactEmail`/`contactPhone`.
// The mock's named contact person ("أحمد السبيعي", "مدير عمليات") has no backing field —
// `Company` records a company-level email/phone, not a contact person's name or title.
export function CompanyContactCard({ company }: { company: Transporter }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-start gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <img src="/petrolCompany/transporters/details/detail.svg" alt="" className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-black text-slate-900">{t('companies.contact')}</h2>
      </div>

      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 mb-3 bg-slate-50 flex items-center justify-center">
          <img src="/petrolCompany/transporters/truck.svg" alt={company.name} className="w-8 h-8" />
        </div>
        <span className="text-base font-black text-slate-900">{company.name}</span>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col items-start text-right w-full">
          <span className="text-xs font-bold text-slate-400 mb-1 w-full">{t('companies.contactPhone')}</span>
          <span className="text-sm font-black text-slate-900 w-full text-left" dir="ltr">{company.contactPhone}</span>
        </div>
        <div className="flex flex-col items-start text-right w-full">
          <span className="text-xs font-bold text-slate-400 mb-1 w-full">{t('common.email')}</span>
          <span className="text-sm font-black text-slate-900 w-full text-left">{company.contactEmail}</span>
        </div>
      </div>

      <a
        href={`tel:${company.contactPhone}`}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-blue-200 text-blue-600 bg-white hover:bg-blue-50 transition-colors text-sm font-bold"
      >
        <img src="/petrolCompany/transporters/details/phone.svg" alt="Phone" className="w-4 h-4" />
        <span>{company.contactPhone}</span>
      </a>
    </div>
  );
}
