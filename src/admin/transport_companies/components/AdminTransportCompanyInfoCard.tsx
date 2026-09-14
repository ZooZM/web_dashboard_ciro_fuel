import { useTranslation } from 'react-i18next';
import type { TransportCompany } from '@/admin/transport_companies/api/transport-companies.api';

/**
 * spec 017 (operator dashboard) T071/FR-034 — the transport company's own
 * record.
 *
 * Was a local `useState` form seeded with literals ("شركة النقل المتحدة",
 * "أحمد السبيعي", "ahmed.subaie@trn.sa") whose Save button wrote to that same
 * state and nowhere else — it looked like an edit form and edited nothing.
 *
 * Rendered **read-only** now. The platform has no route for an operator to edit
 * a transport company's contact details: `PUT /companies/:id/*` covers prices,
 * pricing config, regions, delivery rates and the commission ceiling, none of
 * which is this. Presenting a working-looking editor over a capability that
 * does not exist is the failure mode this whole feature is correcting, so the
 * fields are shown as facts rather than as inputs.
 *
 * The "manager name / job title / notes" fields go entirely: `Company` carries
 * no such fields, and the administrator's real name and sign-in number are
 * shown by `AdminCompanyAdminCard` beside this one, from `GET /users`.
 */
export function AdminTransportCompanyInfoCard({ company }: { company: TransportCompany }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-start gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#F4F8FD] flex items-center justify-center">
          <img src="/petrolCompany/truck.svg" alt="" className="w-5 h-5" />
        </div>
        <h3 className="text-base font-black text-[#162155]">{t('companies.details')}</h3>
      </div>

      <dl className="flex flex-col text-right">
        <Row label={t('companies.name')} value={company.name} />
        <Row label={t('companies.contactEmail')} value={company.contactEmail} ltr />
        <Row label={t('companies.contactPhone')} value={company.contactPhone} ltr />
        <Row
          label={t('transportCompanies.coveredAreas')}
          value={
            company.servedRegions?.length
              ? company.servedRegions.map((region) => t(`regions.${region}`)).join('، ')
              : t('common.notAvailable')
          }
        />
      </dl>
    </div>
  );
}

function Row({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#E7E9EF] last:border-0">
      <dt className="text-xs font-bold text-slate-500 shrink-0">{label}</dt>
      <dd
        className="text-sm font-black text-[#162155] text-left"
        dir={ltr ? 'ltr' : undefined}
      >
        {value}
      </dd>
    </div>
  );
}
