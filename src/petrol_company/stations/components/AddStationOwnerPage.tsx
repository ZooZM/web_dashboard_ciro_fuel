import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateOwner } from '@/petrol_company/stations/hooks/useOwners';
import { ApiError } from '@/lib/api/api-error';
import { normalizeSaudiMobile } from '@/lib/auth/phone';
import {
  RegionCode,
  ALL_REGION_CODES,
  REGION_GOVERNORATES,
  regionLabel,
  governorateLabel,
} from '@/constants/regions';
import type { GovernorateCode } from '@/constants/regions';
import { LocationField } from '@/components/ui/LocationField';
import { isValidLatLng } from '@/lib/maps/maps-url';

// Feature 013 T074/FR-025/FR-028: wired to `POST /users` (role CLIENT). The mock's "no
// password needed, OTP-only login" copy described a flow that did not exist for this
// role, so the admin issues a real initial password (`CreateUserDto` requires one, min 8).
// spec 015 R11: "`POST /auth/login` is the sole login route" is no longer true in general
// — administrators now also sign in with a mobile number and an SMS code
// (`/auth/login/code/*`). A station owner is a CLIENT and still signs in with phone +
// password on the mobile app, so nothing here changes.
export function AddStationOwnerPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const createOwner = useCreateOwner();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // The platform creates a CLIENT and their first station in ONE call — `POST /users`
  // refuses a CLIENT with no station — so these fields are part of onboarding, not an
  // extra. Further stations are added from the owner-detail screen afterwards.
  const [regionCode, setRegionCode] = useState<RegionCode>(RegionCode.RIYADH);
  const [governorateCode, setGovernorateCode] = useState<GovernorateCode>(
    REGION_GOVERNORATES[RegionCode.RIYADH][0]!,
  );
  const [stationName, setStationName] = useState('');
  const [addressText, setAddressText] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [error, setError] = useState<string | null>(null);

  function onRegionChange(code: RegionCode) {
    setRegionCode(code);
    // Governorate must belong to the region — the platform rejects a mismatched pair
    // ('governorateCode does not belong to regionCode'), so it is re-seeded here rather
    // than left pointing at the previous region's first governorate.
    setGovernorateCode(REGION_GOVERNORATES[code][0]!);
  }

  // `CreateUserDto.phone` is E.164-only. A Saudi local number typed as `05…` is what an
  // operator actually has in front of them, so compose it here rather than refusing it.
  //
  // This used to compose with `toE164Saudi` ONLY when the input had no leading `+`, and
  // validate a `+` number with the generic `looksLikeE164` — so `+12025550123` passed and
  // became a station owner's login identifier. `normalizeSaudiMobile` is one accept-or-
  // refuse for every form an operator types, and refuses a non-966 country code outright.
  const phoneE164 = normalizeSaudiMobile(phone);
  const phoneInvalid = phone.trim().length > 0 && phoneE164 === null;

  // `Number('')` is 0, which is finite and in range — an empty coordinate field would
  // otherwise validate cleanly and put the station in the Gulf of Guinea. Blank is checked
  // before the numeric range, never folded into it.
  const lat = latitude.trim() === '' ? NaN : Number(latitude);
  const lng = longitude.trim() === '' ? NaN : Number(longitude);

  // Every branch below used to set the SAME `errors.generic` string — "something went
  // wrong, try again" — for four different, individually fixable problems, and the catch
  // discarded the platform's own message on top of that. A password of 6 characters (which
  // `CreateUserDto` refuses at `@MinLength(8)`) therefore looked identical to a server
  // outage, and the one action that would fix it was never stated.
  function validate(): string | null {
    if (fullName.trim().length < 2) return t('owners.errors.fullNameRequired');
    if (!phoneE164) return t('errors.phoneNotSaudi');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return t('owners.errors.emailInvalid');
    if (password.length < 8) return t('owners.errors.passwordTooShort');
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) return t('owners.errors.latitudeInvalid');
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) return t('owners.errors.longitudeInvalid');
    return null;
  }

  async function handleSubmit() {
    const invalid = validate();
    setError(invalid);
    // `!phoneE164` is redundant with `validate()` at runtime, but it is what narrows the
    // nullable normalised value for the call below — never a non-null assertion, which
    // would go stale the moment validate() stopped checking it.
    if (invalid || !phoneE164) return;

    try {
      const owner = await createOwner.mutateAsync({
        fullName: fullName.trim(),
        phone: phoneE164,
        email: email.trim(),
        password,
        station: {
          regionCode,
          governorateCode,
          latitude: lat,
          longitude: lng,
          name: stationName.trim() || undefined,
          addressText: addressText.trim() || undefined,
        },
      });
      navigate(`/petrolCompany/stations/owners/${owner._id}`);
    } catch (err) {
      // 409 is the likeliest real failure here (the phone or email already belongs to an
      // account) and is entirely actionable, so it must not be flattened into "try again".
      const message =
        err instanceof ApiError
          ? err.statusCode === 409
            ? t('owners.errors.duplicate')
            : err.message
          : t('errors.generic');
      setError(message);
      toast.error(message);
    }
  }

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full border border-[#E7E9EF] rounded-2xl" dir="rtl">

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={() => navigate('/petrolCompany/stations')}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/requests/details/chevronRight.svg" alt="Back" className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          {t('owners.title')} / {t('owners.add')}
        </span>
      </div>

      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-black text-slate-900">{t('owners.add')}</h1>
        <p className="text-sm font-bold text-slate-500">{t('owners.addSubtitle')}</p>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Right side - Form */}
        <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-start gap-2 mb-8">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <img src="/petrolCompany/transporters/addTransporter/detail.svg" alt="" className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900">{t('owners.accountData')}</h2>
          </div>

          <div className="flex flex-col gap-6">

            <div className="flex flex-col">
              <label className="text-sm font-bold text-slate-700 mb-2">{t('common.fullName')} <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('common.phone')} <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-bold text-slate-700 mb-2">{t('owners.password')} <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-left"
              />
              <span className="text-[11px] font-bold text-slate-400 mt-2">{t('owners.passwordRule')}</span>
              <span className="text-[11px] font-bold text-slate-400 mt-1">{t('owners.passwordHint')}</span>
            </div>

            {/* First station — required by the platform at account creation, NOT an
                optional extra: `POST /users` refuses a CLIENT that arrives without one. */}
            <div className="h-px bg-slate-100 mt-2"></div>

            <div className="flex items-center justify-start gap-2">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex flex-col text-right">
                <h3 className="text-base font-black text-slate-900">{t('owners.firstStation')}</h3>
                <span className="text-[11px] font-bold text-slate-400">{t('owners.firstStationHint')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('stations.region')} <span className="text-red-500">*</span></label>
                <select
                  value={regionCode}
                  onChange={(e) => onRegionChange(e.target.value as RegionCode)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {ALL_REGION_CODES.map((code) => (
                    <option key={code} value={code}>{regionLabel(code, i18n.language)}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('stations.governorate')} <span className="text-red-500">*</span></label>
                <select
                  value={governorateCode}
                  onChange={(e) => setGovernorateCode(e.target.value as GovernorateCode)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {REGION_GOVERNORATES[regionCode].map((code) => (
                    <option key={code} value={code}>{governorateLabel(code, i18n.language)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* The same shared picker the fuel-exchange offer form uses. The two number
                fields stay: they are what is actually stored and submitted, they remain
                the only way to enter a coordinate read off a survey or a document, and
                keeping them means the map is an ACCELERATOR for this required field rather
                than a dependency it cannot be filled without. The map writes into them. */}
            <div className="text-right">
              <LocationField
                value={
                  isValidLatLng({ lat: Number(latitude), lng: Number(longitude) }) &&
                  latitude.trim() !== '' &&
                  longitude.trim() !== ''
                    ? { lat: Number(latitude), lng: Number(longitude) }
                    : null
                }
                onChange={(next) => {
                  setLatitude(next ? String(next.lat.toFixed(6)) : '');
                  setLongitude(next ? String(next.lng.toFixed(6)) : '');
                }}
              />
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('stations.latitude')} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="24.7136"
                  dir="ltr"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-left"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('stations.longitude')} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="46.6753"
                  dir="ltr"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-left"
                />
              </div>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('stations.name')}</label>
                <input
                  type="text"
                  value={stationName}
                  onChange={(e) => setStationName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">{t('stations.addressText')}</label>
                <input
                  type="text"
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && <p className="text-sm font-bold text-red-500">{error}</p>}

          </div>

          <div className="h-px bg-slate-100 my-8"></div>

          <div className="flex items-center justify-end gap-4">
            <button
              onClick={() => navigate('/petrolCompany/stations')}
              className="bg-white text-red-500 border border-red-100 px-8 py-3 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors shadow-sm"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={createOwner.isPending}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
            >
              {t('owners.create')}
            </button>
          </div>

        </div>

        {/* Left side - Sidebar Cards */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0">

          {/* Account Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-start gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <img src="/petrolCompany/transporters/addTransporter/seen.svg" alt="" className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900">{t('owners.accountData')}</h3>
            </div>

            <div className="flex flex-col gap-4 text-center">
              <div className="flex flex-col items-center">
                <span className="text-base font-black text-slate-900 mb-1">{fullName || '—'}</span>
                <span className="text-xs font-bold text-slate-400">{email || '—'}</span>
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900" dir="ltr">{phone || '—'}</span>
                <span className="text-xs font-bold text-slate-400">{t('common.phone')}</span>
              </div>
            </div>
          </div>

          {/* Login Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full border-[2px] border-dashed border-blue-400 rounded-2xl pointer-events-none "></div>
            <div className="flex flex-col gap-4 relative z-10 text-center">
              <div className="flex items-center justify-start gap-2 mb-2">
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

          {/* Next Steps */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-start gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <img src="/petrolCompany/transporters/addTransporter/detail.svg" alt="" className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900">{t('owners.addSubtitle')}</h3>
            </div>

            <div className="flex flex-col gap-6 relative">
              <div className="absolute right-3.5 top-2 bottom-2 w-0.5 bg-slate-100 z-0"></div>

              <div className="flex items-start gap-4 relative z-10 text-right">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-black flex items-center justify-center shrink-0 border-2 border-white shadow-sm mt-0.5">
                  1
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 mb-1">{t('owners.create')}</span>
                </div>
              </div>

              <div className="flex items-start gap-4 relative z-10 text-right">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-xs font-black flex items-center justify-center shrink-0 border-2 border-white shadow-sm mt-0.5">
                  2
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 mb-1">{t('stations.add')}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
