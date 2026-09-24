import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useOnboardFuelCompany } from '@/admin/petrol_companies/hooks/useFuelCompanies';
import { ApiError } from '@/lib/api/api-error';
import { normalizeSaudiMobile } from '@/lib/auth/phone';

// Feature 013 T237/FR-088: raises a real `POST /companies` (multipart, `type: FUEL`
// implicit server-side) creating the company AND its first administrator atomically.
// The previous mock's "city/headquarters" field and free-text notes have no backing
// field on `Company` and are dropped.
//
// spec 015 R11: an earlier version of this comment claimed a FUEL_COMPANY_ADMIN "signs
// in with email+password, not phone+OTP". That is now false. After spec 015 an
// administrator signs in EITHER with their mobile number and an SMS code OR with their
// email and password (`CreateFuelCompanyDto` still requires a password, min 8 — Q2 chose
// coexistence). The admin phone is now a login identifier and must be a valid E.164
// number.
export function AddPetrolCompanyPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const onboard = useOnboardFuelCompany();

  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [adminFullName, setAdminFullName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [commercialRegister, setCommercialRegister] = useState<File | null>(null);

  // spec 015 R5/T101 — the admin phone is a LOGIN IDENTIFIER, so it must be a real Saudi
  // mobile, not merely well-formed E.164. `looksLikeE164` accepted any country
  // (`+12025550123` among them) for a field whose placeholder has always read
  // `+9665XXXXXXXX`; normalising also means an operator may type `05…` and have it
  // composed, which this form previously refused outright.
  const adminPhoneE164 = normalizeSaudiMobile(adminPhone);
  const adminPhoneInvalid = adminPhone.trim().length > 0 && adminPhoneE164 === null;

  const canSubmit =
    name.trim() &&
    contactEmail.trim() &&
    contactPhone.trim() &&
    adminFullName.trim() &&
    adminEmail.trim() &&
    adminPhoneE164 !== null &&
    adminPassword.length >= 8;

  async function handleSubmit() {
    if (!canSubmit) {
      toast.error(t('adminCompanies.formIncomplete'));
      return;
    }
    try {
      const company = await onboard.mutateAsync({
        name: name.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        adminFullName: adminFullName.trim(),
        adminEmail: adminEmail.trim(),
        // The NORMALISED value — an operator who typed `0512345678` must not send that.
        adminPhone: adminPhoneE164 ?? adminPhone.trim(),
        adminPassword,
        commercialRegister: commercialRegister ?? undefined,
      });
      toast.success(t('adminCompanies.companyCreated'));
      navigate(`/admin/petrol-companies/${company._id}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  return (
    <div className="w-full h-full min-h-full flex flex-col p-4 md:p-6 font-sans bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl" dir="rtl">
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={() => navigate('/admin/petrol-companies')}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/requests/details/chevronRight.svg" alt="Back" className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          {t('adminCompanies.title')} / {t('adminCompanies.addCompany')}
        </span>
      </div>

      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-black text-slate-900">{t('adminCompanies.addCompany')}</h1>
        <p className="text-sm font-bold text-slate-500">{t('adminCompanies.addCompanySubtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch flex-1">
        <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-start gap-2 mb-8 shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <img src="/petrolCompany/transporters/addTransporter/detail.svg" alt="" className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900">{t('adminCompanies.accountData')}</h2>
          </div>

          <div className="flex flex-col gap-6 flex-1">
            <div className="flex items-start gap-6">
              <label className="w-24 h-24 bg-blue-50 rounded-2xl border border-blue-200 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors shrink-0 overflow-hidden relative">
                <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => setCommercialRegister(e.target.files?.[0] ?? null)} />
                {commercialRegister && commercialRegister.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(commercialRegister)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <img src="/petrolCompany/transporters/addTransporter/image.svg" alt="Upload" className="w-10 h-10 mb-2" />
                    <span className="text-[10px] font-bold text-blue-500 text-center px-1">
                      {commercialRegister ? commercialRegister.name.slice(0, 12) : t('adminCompanies.commercialRegister')}
                    </span>
                  </>
                )}
              </label>
              <div className="flex w-full mt-3 flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('adminCompanies.companyName')} <span className="text-red-500">*</span></label>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder={t('adminCompanies.companyName')} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('adminCompanies.email')} <span className="text-red-500">*</span></label>
                <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} type="email" placeholder="company@example.com" dir="ltr" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-left" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('adminCompanies.phone')} <span className="text-red-500">*</span></label>
                <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} type="text" placeholder="+9665XXXXXXXX" dir="ltr" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-left" />
              </div>
            </div>

            <div className="mt-4 mb-2">
              <h3 className="text-sm font-bold text-slate-500">{t('adminCompanies.adminData')}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('adminCompanies.adminFullName')} <span className="text-red-500">*</span></label>
                <input value={adminFullName} onChange={(e) => setAdminFullName(e.target.value)} type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('adminCompanies.adminPhone')} <span className="text-red-500">*</span></label>
                <input value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} type="tel" placeholder="+9665XXXXXXXX" dir="ltr" aria-invalid={adminPhoneInvalid} className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium focus:outline-none focus:ring-1 text-left ${adminPhoneInvalid ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'}`} />
                {adminPhoneInvalid ? (
                  <span className="mt-2 text-xs font-bold text-red-500">{t('errors.phoneNotSaudi')}</span>
                ) : (
                  <span className="mt-2 text-xs font-bold text-slate-400">{t('errors.phoneHintSaudi')}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('adminCompanies.adminEmail')} <span className="text-red-500">*</span></label>
                <input value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} type="email" dir="ltr" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-left" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('adminCompanies.adminPassword')} <span className="text-red-500">*</span></label>
                <input value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} type="password" dir="ltr" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-left" />
              </div>
            </div>
          </div>

          <div className="mt-8 shrink-0">
            <div className="h-px bg-slate-100 mb-6"></div>
            <div className="flex items-center justify-end gap-4">
              <button onClick={() => navigate('/admin/petrol-companies')} disabled={onboard.isPending} className="bg-white text-slate-600 border border-slate-200 px-8 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50">
                {t('common.cancel')}
              </button>
              <button onClick={() => void handleSubmit()} disabled={!canSubmit || onboard.isPending} className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
                {onboard.isPending ? t('common.loading') : t('adminCompanies.createAccount')}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 h-full">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full border-[2px] border-dashed border-blue-400 rounded-2xl pointer-events-none"></div>
            <div className="flex flex-col gap-4 relative z-10 text-center">
              <div className="flex items-center justify-start gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <img src="/petrolCompany/transporters/addTransporter/about.svg" alt="" className="w-4 h-4 filter brightness-0 invert" />
                </div>
                <h3 className="text-base font-black text-blue-900">{t('adminCompanies.signInInfo')}</h3>
              </div>
              <p className="text-xs font-bold text-blue-600/80 leading-loose px-2 text-right">
                {t('adminCompanies.signInInfoBody')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
