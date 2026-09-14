import { useTranslation } from 'react-i18next';

/**
 * spec 017 (operator dashboard) T091a/FR-042 — the driver's employing transport
 * company, read from `GET /companies/:id`.
 *
 * Was entirely hardcoded ("شركة النقل المتحدة", "05xxxxxxxx"). The number shown
 * is the COMPANY's `contactPhone`, and it is labelled as such: feature 013
 * found that rendering a company number under the same label the sign-in field
 * uses sent operators to type the wrong number into the login page, since on
 * this platform no company's `contactPhone` equals its administrator's own.
 */
export interface DriverTransportCompany {
  _id: string;
  name: string;
  contactPhone: string;
  contactEmail: string;
}

export function AdminDriverTransportCompanyCard({
  company,
  isLoading,
}: {
  company: DriverTransportCompany | null | undefined;
  isLoading?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <img src="/petrolCompany/truck.svg" alt="" className="w-4 h-4" />
          </div>
          <h3 className="text-base font-black text-[#162155]">{t('driverRoster.employer')}</h3>
        </div>
      </div>

      {isLoading && (
        <div className="w-full h-16 rounded-xl bg-slate-100 animate-pulse" aria-hidden />
      )}

      {/*
        FR-076 — a driver with no employing company renders as an explicit
        statement, never as an empty card that reads as "still loading".
      */}
      {!isLoading && !company && (
        <p className="text-sm font-bold text-slate-400 py-4">{t('common.notAvailable')}</p>
      )}

      {!isLoading && company && (
        <>
          <h4 className="text-lg font-black text-[#162155] mb-1">{company.name}</h4>

          <div className="flex flex-col items-center gap-1 mb-2">
            <span className="text-sm font-black text-[#162155]" dir="ltr">
              {company.contactPhone}
            </span>
            {/* Labelled as the COMPANY's contact number, not a sign-in number. */}
            <span className="text-xs font-bold text-slate-400">
              {t('companies.contactPhone')}
            </span>
            <span className="text-xs font-bold text-slate-400" dir="ltr">
              {company.contactEmail}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
