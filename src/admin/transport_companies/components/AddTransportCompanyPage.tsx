import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFuelCompaniesList } from '@/admin/petrol_companies/hooks/useFuelCompanies';
import { useOnboardTransportCompany } from '@/admin/transport_companies/hooks/useTransportCompanyMutations';
import { toApiError } from '@/lib/api/api-error';

/**
 * spec 017 (operator dashboard) T072/US4 — the operator onboards a transport
 * company and its first administrator, in one request.
 *
 * **`parentFuelCompanyId` is a REQUIRED select, populated from
 * `?type=FUEL`** (FR-030), and the form says the parent cannot be changed
 * afterwards. Both halves matter:
 *
 *  - Required, because a transport company with no parent is unroutable —
 *    routing resolves a transporter through its parent fuel company, so an
 *    unparented one would sign in, appear in every list, and never receive an
 *    order. A failure with no error message anywhere.
 *  - Named rather than implied, because a `SUPER_ADMIN` has no tenant of their
 *    own to take it from. The fuel company's own onboarding route can imply it;
 *    this one cannot.
 *
 * The select shows company NAMES, never ids: an operator cannot verify an
 * ObjectId by eye, and picking the wrong parent is silent and permanent.
 *
 * The company and its administrator are ONE unit of work server-side, so a
 * duplicate administrator email leaves neither behind (FR-028) — the form can
 * simply be corrected and resubmitted.
 */
export function AddTransportCompanyPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fuelCompanies = useFuelCompaniesList();
  const onboard = useOnboardTransportCompany();

  const [form, setForm] = useState({
    name: '',
    contactEmail: '',
    contactPhone: '',
    parentFuelCompanyId: '',
    adminFullName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: '',
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const error = onboard.error ? toApiError(onboard.error) : null;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const created = await onboard.mutateAsync(form);
    navigate(`/admin/transport-companies/${created.company._id}`);
  }

  return (
    <div
      className="w-full h-full min-h-full flex flex-col p-4 md:p-6 font-sans bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl"
      dir="rtl"
    >
      <div
        className="flex items-center gap-2 mb-6 cursor-pointer w-fit"
        onClick={() => navigate('/admin/transport-companies')}
      >
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img
            src="/petrolCompany/requests/details/chevronRight.svg"
            alt=""
            className="w-4 h-4"
          />
        </button>
        <span className="text-sm font-semibold text-slate-500">{t('common.back')}</span>
      </div>

      <div className="flex flex-col gap-1 mb-8 text-right">
        <h1 className="text-2xl font-black text-[#162155]">
          {t('transportCompanies.addTitle')}
        </h1>
      </div>

      <form
        onSubmit={submit}
        className="flex-1 w-full bg-white border border-[#E7E9EF] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6 text-right"
      >
        <Field
          label={t('companies.name')}
          value={form.name}
          onChange={set('name')}
          required
        />
        <Field
          label={t('companies.contactEmail')}
          value={form.contactEmail}
          onChange={set('contactEmail')}
          type="email"
          required
        />
        <Field
          label={t('companies.contactPhone')}
          value={form.contactPhone}
          onChange={set('contactPhone')}
          required
        />

        {/* FR-030 — the required parent, by name. */}
        <div className="flex flex-col">
          <label htmlFor="parent-fuel-company" className="text-sm font-bold text-slate-700 mb-2">
            {t('transportCompanies.parentCompany')} <span className="text-red-500">*</span>
          </label>
          <select
            id="parent-fuel-company"
            required
            value={form.parentFuelCompanyId}
            onChange={(event) => set('parentFuelCompanyId')(event.target.value)}
            className="w-full px-4 py-3 bg-white border border-[#E7E9EF] rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="" disabled>
              {t('common.choose')}
            </option>
            {(fuelCompanies.data ?? []).map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
          <span className="text-[11px] font-semibold text-amber-700 mt-1">
            {t('transportCompanies.parentImmutable')}
          </span>
        </div>

        <hr className="border-slate-100" />

        <h2 className="text-base font-black text-[#162155]">
          {t('transportCompanies.firstAdmin')}
        </h2>

        <Field
          label={t('common.fullName')}
          value={form.adminFullName}
          onChange={set('adminFullName')}
          required
        />
        <Field
          label={t('common.email')}
          value={form.adminEmail}
          onChange={set('adminEmail')}
          type="email"
          required
        />
        <Field
          label={t('operatorAccount.signInNumber')}
          value={form.adminPhone}
          onChange={set('adminPhone')}
          placeholder="+9665XXXXXXXX"
          required
        />
        <Field
          label={t('auth.password')}
          value={form.adminPassword}
          onChange={set('adminPassword')}
          type="password"
          required
        />

        {/*
          The platform's own refusal, stated. `INVALID_PARENT_FUEL_COMPANY`
          means the named parent does not exist or is not a FUEL company;
          a 409 means the administrator's email or phone is already taken, and
          NOTHING was created — so correcting and resubmitting is the right
          next move and actually works (FR-028).
        */}
        {error && (
          <p className="text-sm font-bold text-red-700">
            {error.error === 'INVALID_PARENT_FUEL_COMPANY'
              ? t('transportCompanies.invalidParent')
              : error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={onboard.isPending}
          className="self-start bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-bold"
        >
          {onboard.isPending ? t('common.saving') : t('common.save')}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-bold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-4 py-3 bg-white border border-[#E7E9EF] rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
