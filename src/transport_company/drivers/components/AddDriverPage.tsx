import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCreateDriver } from '@/transport_company/drivers/hooks/useDrivers';
import { toast } from '@/lib/toast/toast';

/**
 * Feature 009 Phase 6/T090: previously every field here was unwired — no state, no
 * onChange, no submit handler at all; the "create account" button did nothing. Rewired to
 * real driver creation (`CreateUserDto`: fullName/email/phone/password). The truck section
 * is removed — a vehicle is chosen at assignment time, never stored on the driver (spec 008
 * cutover) — and the sidebar's login-method note is corrected: drivers sign in with
 * email + password, not a phone OTP (no such admin-created-account flow exists on the
 * platform).
 */
/** Mirrors the platform's E164_PATTERN exactly (`src/common/constants/phone.ts`). */
const E164 = /^\+[1-9]\d{7,14}$/;

export function AddDriverPage(): React.JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createDriver = useCreateDriver();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  function goBack(): void {
    const basePath = window.location.pathname.startsWith('/admin') ? '/admin' : '/transport';
    navigate(`${basePath}/drivers`);
  }

  function onSubmit(): void {
    if (!canSubmit) return;
    createDriver.mutate(
      { fullName: fullName.trim(), email: email.trim(), phone: phone.trim(), password },
      {
        onSuccess: goBack,
        onError: () => toast.error(t('drivers.createError')),
      },
    );
  }

  // The placeholder already promises E.164 but nothing enforced it, so a
  // locally-formatted number reached `CreateUserDto` (which requires the
  // country prefix) and came back as a generic createError toast naming no
  // field — the operator had no way to tell which of four inputs was wrong.
  const phoneValid = E164.test(phone.trim());
  const phoneInvalid = phone.trim().length > 0 && !phoneValid;
  const canSubmit = Boolean(
    fullName.trim() && email.trim() && phoneValid && password.length >= 8,
  );

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full border border-[#E7E9EF] rounded-2xl" dir="rtl">
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={goBack}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/requests/details/chevronRight.svg" alt="Back" className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          {t('drivers.title')} / {t('drivers.add')}
        </span>
      </div>

      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-black text-slate-900">{t('drivers.add')}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-8">{t('common.fullName')}</h2>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-bold text-slate-700 mb-2">
                {t('common.fullName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">
                  {t('auth.login.email')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">
                  {t('companies.adminPhone')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+9665XXXXXXXX"
                  dir="ltr"
                  aria-invalid={phoneInvalid}
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium focus:outline-none focus:ring-1 text-right ${
                    phoneInvalid
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {phoneInvalid && (
                  <span className="mt-1.5 text-xs font-bold text-red-500" dir="ltr">
                    +9665XXXXXXXX
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-bold text-slate-700 mb-2">
                {t('auth.login.password')} <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right"
              />
            </div>
          </div>

          <div className="h-px bg-slate-100 my-8"></div>

          <div className="flex items-center justify-start gap-4 flex-row-reverse">
            <button
              onClick={onSubmit}
              disabled={!canSubmit || createDriver.isPending}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {t('common.submit')}
            </button>
            <button
              onClick={goBack}
              className="bg-white text-red-500 border border-red-100 px-8 py-3 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors shadow-sm"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>

        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex flex-col gap-4 relative z-10 text-center">
              <h3 className="text-base font-black text-blue-900">{t('auth.login.title')}</h3>
              <p className="text-xs font-bold text-blue-600/80 leading-loose px-2">
                {t('drivers.loginMethodNote')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
