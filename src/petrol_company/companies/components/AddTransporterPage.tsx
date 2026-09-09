import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useSessionStore } from '@/stores/session.store';
import { useOnboardTransporter } from '@/petrol_company/companies/hooks/useTransporters';
import { apiErrorMessage } from '@/lib/api/api-error';
import { normalizeSaudiMobile } from '@/lib/auth/phone';

// Feature 013 T085/FR-034: wired to `POST /companies/:id/transporters`
// (`CreateTransportCompanyDto`). Two things the mock modelled were dropped outright rather
// than wired to nothing: an "add by code" linking flow (no such capability exists —
// `createTransportCompany` always creates a brand-new company+admin, never links an
// existing one) and a commercial-register/city/job-title set of fields
// `CreateTransportCompanyDto`'s own comment says a transporter's onboarding does not
// collect (unlike a Fuel Company's).
//
// spec 015 R11: an earlier version of this comment said "`POST /auth/login` is the
// platform's only login route". That is no longer true — after spec 015 an administrator
// signs in EITHER with mobile number + SMS code OR with email + password.
// `CreateTransportCompanyDto.adminPassword` is still required (min 8, Q2 coexistence),
// and the admin phone is now a login identifier that must be a valid E.164 number.
export function AddTransporterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const companyId = useSessionStore((s) => s.user?.companyId);
  const onboardTransporter = useOnboardTransporter();

  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [adminFullName, setAdminFullName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Both numbers go through `normalizeSaudiMobile`, the same accept-or-refuse
  // `AddStationOwnerPage` uses: it takes every form an operator actually types
  // (`0512345678`, `966…`, `+9665…`, with any spacing) and refuses a non-966 country code
  // outright rather than coercing it into a plausible-looking number nobody entered.
  const phoneE164 = normalizeSaudiMobile(contactPhone);
  const phoneInvalid = contactPhone.trim().length > 0 && phoneE164 === null;
  const adminPhoneE164 = normalizeSaudiMobile(adminPhone);
  const adminPhoneInvalid = adminPhone.trim().length > 0 && adminPhoneE164 === null;

  // A blanket `errors.generic` for every branch made a mistyped mobile — the one failure
  // an operator can actually fix from this screen — indistinguishable from a server
  // outage. The phone branch names itself, as it does on the station-owner form.
  function validate(): string | null {
    if (
      !name.trim() ||
      !contactEmail.trim() ||
      !adminFullName.trim() ||
      !adminEmail.trim() ||
      adminPassword.length < 8
    ) {
      return t('errors.generic');
    }
    // spec 015 R5/T101 — the admin phone is a LOGIN IDENTIFIER, so it must be a real
    // Saudi mobile, not merely well-formed E.164 (which accepted any country).
    if (!phoneE164 || !adminPhoneE164) return t('errors.phoneNotSaudi');
    return null;
  }

  async function handleSubmit() {
    const invalid = validate();
    setError(invalid);
    // `!phoneE164 || !adminPhoneE164` is redundant with `validate()` at runtime, but it is
    // what narrows the nullable normalised values for the call below — never a non-null
    // assertion, which would go stale the moment validate() stopped checking them.
    if (invalid || !phoneE164 || !adminPhoneE164) return;

    try {
      const result = await onboardTransporter.mutateAsync({
        name,
        contactEmail,
        contactPhone: phoneE164,
        adminFullName,
        adminEmail,
        adminPhone: adminPhoneE164,
        adminPassword,
      });
      navigate(`/petrolCompany/companies/${result.company._id}`);
    } catch (err) {
      // A 409 here is the likeliest real failure and names its own cause — the platform
      // says which field clashed ("A company with this name already exists", "This email
      // is already registered", "This phone number is already registered") because the
      // operator cannot pick a different one otherwise. Flattening all three into
      // `errors.generic` left them retrying the same name against a name collision.
      const message = apiErrorMessage(err, t('errors.generic'));
      setError(message);
      toast.error(message);
    }
  }

  if (!companyId) return null;

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full border border-[#E7E9EF] rounded-2xl" dir="rtl">

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={() => navigate('/petrolCompany/companies')}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/requests/details/chevronRight.svg" alt="Back" className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          {t('nav.companies')} / {t('owners.add')}
        </span>
      </div>

      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-black text-slate-900">{t('companies.onboard')}</h1>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Right side - Form */}
        <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-start gap-2 mb-8">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <img src="/petrolCompany/transporters/addTransporter/detail.svg" alt="" className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900">{t('companies.name')}</h2>
          </div>

          <div className="flex flex-col gap-6">

            <div className="flex flex-col">
              <label className="text-sm font-bold text-slate-700 mb-2">{t('companies.name')} <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('common.phone')} <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+9665XXXXXXXX"
                  dir="ltr"
                  aria-invalid={phoneInvalid}
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium focus:outline-none focus:ring-1 text-left ${
                    phoneInvalid
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {/* Stated while typing, not only on submit: the operator is looking at the
                    field they got wrong, rather than at a summary after the form bounced. */}
                {phoneInvalid ? (
                  <span className="mt-2 text-xs font-bold text-red-500">{t('errors.phoneNotSaudi')}</span>
                ) : (
                  <span className="mt-2 text-xs font-bold text-slate-400">{t('errors.phoneHintSaudi')}</span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('common.email')} <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2"></div>

            <p className="text-sm font-bold text-slate-400">{t('companies.adminFullName')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('companies.adminFullName')} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={adminFullName}
                  onChange={(e) => setAdminFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('companies.adminPhone')} <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  placeholder="+9665XXXXXXXX"
                  dir="ltr"
                  aria-invalid={adminPhoneInvalid}
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium focus:outline-none focus:ring-1 text-left ${
                    adminPhoneInvalid
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {adminPhoneInvalid ? (
                  <span className="mt-2 text-xs font-bold text-red-500">{t('errors.phoneNotSaudi')}</span>
                ) : (
                  <span className="mt-2 text-xs font-bold text-slate-400">{t('errors.phoneHintSaudi')}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('companies.adminEmail')} <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-left"
                  dir="ltr"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('companies.adminPassword')} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  dir="ltr"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-left"
                />
              </div>
            </div>

            {error && <p className="text-sm font-bold text-red-500">{error}</p>}

          </div>

          <div className="h-px bg-slate-100 my-8"></div>

          <div className="flex items-center justify-end gap-4">
            <button
              onClick={() => navigate('/petrolCompany/companies')}
              className="bg-white text-red-500 border border-red-100 px-8 py-3 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors shadow-sm"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={onboardTransporter.isPending}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
            >
              {t('owners.create')}
            </button>
          </div>

        </div>

        {/* Left side - Sidebar */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0">

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-start gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <img src="/petrolCompany/transporters/addTransporter/seen.svg" alt="" className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900">{t('companies.name')}</h3>
            </div>

            <div className="flex flex-col gap-4 text-center">
              <div className="flex flex-col items-center">
                <span className="text-base font-black text-slate-900 mb-1">{name || '—'}</span>
                <span className="text-xs font-bold text-slate-400">{contactEmail || '—'}</span>
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900" dir="ltr">{contactPhone || '—'}</span>
                <span className="text-xs font-bold text-slate-400">{t('companies.contactPhone')}</span>
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900">{adminFullName || '—'}</span>
                <span className="text-xs font-bold text-slate-400">{t('companies.adminFullName')}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full border-2 border-dashed border-blue-200 rounded-2xl pointer-events-none"></div>
            <div className="flex flex-col gap-4 relative z-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <img src="/petrolCompany/transporters/addTransporter/about.svg" alt="" className="w-4 h-4 filter brightness-0 invert" />
                </div>
                <h3 className="text-base font-black text-blue-900">{t('auth.login.title')}</h3>
              </div>
              <p className="text-xs font-bold text-blue-600/80 leading-loose px-2">
                {t('owners.passwordHint')}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
