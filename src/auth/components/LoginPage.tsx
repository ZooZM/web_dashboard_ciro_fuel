import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/lib/toast/toast';
import { useRequestLoginCode } from '@/auth/hooks/useLoginCode';
import { toE164Saudi, looksLikeSaudiMobile, looksLikeE164 } from '@/lib/auth/phone';
import { ApiError } from '@/lib/api/api-error';
import { cn } from '@/lib/utils';
import { COUNTRIES } from '@/auth/constants/countries';

const SAUDI_CODE = '+966';

/**
 * Composes the E.164 value the platform requires from the selected country prefix and
 * whatever the operator typed. Saudi keeps `toE164Saudi` (and its tolerance for `05…`,
 * `9665…`, `009665…`); any other prefix strips an international `00`/country-code echo and
 * one national trunk `0`, then prepends the prefix.
 */
function composeE164(countryCode: string, input: string): string {
  if (countryCode === SAUDI_CODE) return toE164Saudi(input);
  const cc = countryCode.slice(1);
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith(cc)) digits = digits.slice(cc.length);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return `${countryCode}${digits}`;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState(SAUDI_CODE);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isSaudi = countryCode === SAUDI_CODE;

  // Close the country dropdown on an outside click.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [touched, setTouched] = useState(false);
  const [remember, setRemember] = useState(false);
  // Set by the server when it says the number belongs to no administrator — only
  // reachable when that environment runs LOGIN_CODE_REVEAL_UNKNOWN_PHONE=true. Under the
  // default (FR-015) every well-formed number succeeds and this stays null.
  const [accountError, setAccountError] = useState<string | null>(null);
  const requestCode = useRequestLoginCode();

  // Format feedback belongs on the field, not only in a toast on submit: behind the +966
  // chip "9 digits starting with 5" is the whole rule and the operator can be told the
  // moment it is not met. Other prefixes get the generic E.164 check only — the platform
  // validates E.164, and this screen has no per-country numbering plan to be stricter with.
  const digits = phone
    .replace(/\D/g, '')
    .replace(/^00966/, '')
    .replace(/^966/, '')
    .replace(/^0/, '');
  const e164 = composeE164(countryCode, phone);
  const isValidFormat = isSaudi ? looksLikeSaudiMobile(e164) : looksLikeE164(e164);
  const formatError =
    !touched || phone.trim() === '' || isValidFormat
      ? null
      : !isSaudi
        ? 'رقم الجوال غير صحيح'
        : digits.length !== 9
          ? `رقم الجوال يجب أن يتكوّن من ٩ أرقام (أدخلت ${digits.length})`
          : 'رقم الجوال يجب أن يبدأ بالرقم ٥';
  // One error slot on the field: a malformed number is reported before the server is
  // asked at all, so the two can never contradict each other.
  const fieldError = formatError ?? accountError;

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setAccountError(null);
    // Saudi-specific (for the default +966 prefix), not the generic E.164 check: a number of
    // any other length is a typo, and the platform's 202-for-everything
    // response (FR-015) would otherwise turn that typo into an unexplained missing SMS.
    if (!isValidFormat) {
      toast.error('يرجى إدخال رقم جوال صحيح');
      return;
    }
    requestCode.mutate(e164, {
      // FR-015: a 202 is returned for every outcome — navigate regardless.
      onSuccess: () => navigate('/verify', { state: { phone: e164, remember } }),
      onError: (err) => {
        if (err instanceof ApiError && err.error === 'LOGIN_RATE_LIMITED') {
          const wait = err.retryAfterSeconds ?? 60;
          toast.error(`محاولات كثيرة. حاول مرة أخرى بعد ${wait} ثانية.`);
          return;
        }
        if (err instanceof ApiError && err.error === 'PHONE_NOT_REGISTERED') {
          // Kept on the field rather than in a toast: it names the thing the operator
          // must change, and a toast disappears before they have retyped it.
          setAccountError(`لا يوجد حساب إداري مسجّل بهذا الرقم ${e164}`);
          return;
        }
        toast.error('تعذّر إرسال رمز التحقق. حاول مرة أخرى.');
      },
    });
  };

  return (
    <div
      className="flex min-h-svh w-full flex-col relative overflow-y-auto bg-cover bg-center"
      style={{ backgroundImage: 'url(/signIn/bg-truck.png)' }}
      dir="rtl"
    >
      {/* Main Content Area */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto items-center justify-start px-4 md:px-8 py-8 md:py-0">

        {/* Login Card */}
        <div className="w-full max-w-[400px] bg-white/40 backdrop-blur-lg border border-white/60 rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-6 mt-8 md:mt-0">

          <div className="flex flex-col items-center gap-4">
            <img src="/LOGO/Logo.svg" alt="CIRO Fuel" className="w-[180px] h-auto object-contain mb-2" />

            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-800">مرحباً بعودتك</h1>
              <p className="text-sm text-slate-500 mt-2">
                سجل و تابع طلبات اليوم لحظة بلحظة.
              </p>
            </div>
          </div>

          <form onSubmit={handleSendCode} className="flex flex-col gap-4 w-full mt-2">
            {/* Phone Input with Country Code */}
            <div className="space-y-1.5">
              <div
                className={cn(
                  // No overflow-hidden: it would clip the country dropdown below.
                  'relative flex items-center bg-white rounded-2xl border shadow-sm h-14 focus-within:ring-1',
                  fieldError
                    ? 'border-red-400 focus-within:border-red-500 focus-within:ring-red-500'
                    : 'border-slate-200 focus-within:border-primary focus-within:ring-primary',
                )}
              >
                <div className="flex-1 px-4 h-full relative">
                  <div className="absolute top-1.5 right-4 text-[10px] text-slate-400 font-medium">رقم الجوال</div>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder={isSaudi ? '5X XXX XXXX' : 'XXXXXXXXX'}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setAccountError(null);
                    }}
                    onBlur={() => setTouched(true)}
                    aria-invalid={fieldError ? true : undefined}
                    aria-describedby={fieldError ? 'phone-format-error' : undefined}
                    className="border-0 focus-visible:ring-0 shadow-none h-full rounded-none bg-transparent pt-5 pb-1 px-0 text-sm font-medium placeholder:text-slate-300"
                  />
                </div>
                <div className="flex items-center px-3 border-r border-slate-200 text-slate-600 bg-transparent h-10 shrink-0 gap-1.5" dir="ltr" ref={dropdownRef}>
                  <img src="/signIn/phone.svg" alt="Phone" className="w-4 h-4 ml-1 object-contain" />
                  <div className="w-[1px] h-10 bg-slate-200 mx-1"></div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen((open) => !open)}
                      aria-haspopup="listbox"
                      aria-expanded={isDropdownOpen}
                      className="flex items-center gap-1.5 px-1 py-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-medium text-slate-600" dir="ltr">{countryCode}</span>
                      <ChevronDown className={cn('w-3 h-3 text-slate-400 transition-transform', isDropdownOpen && 'rotate-180')} />
                    </button>

                    {isDropdownOpen && (
                      <div
                        role="listbox"
                        className="absolute top-full left-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 min-w-[140px] py-1 animate-in fade-in slide-in-from-top-2 duration-200"
                      >
                        {COUNTRIES.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            role="option"
                            aria-selected={countryCode === country.code}
                            onClick={() => {
                              setCountryCode(country.code);
                              setIsDropdownOpen(false);
                              setAccountError(null);
                            }}
                            className={cn(
                              'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium hover:bg-blue-50 transition-colors cursor-pointer',
                              countryCode === country.code ? 'bg-blue-50 text-blue-700' : 'text-slate-700',
                            )}
                          >
                            <img src={country.flag} alt={country.name} className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm" />
                            <span>{country.name}</span>
                            <span className="text-slate-400 ml-auto">{country.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {fieldError && (
                <p id="phone-format-error" className="text-xs font-medium text-red-600 px-1">
                  {fieldError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-3 mb-2 px-1">
              <Link
                to="/recovery"
                className="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
              <label className="flex items-center gap-2 cursor-pointer group">
                <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">تذكرني</span>
                <div className="relative flex items-center justify-center w-4 h-4 border border-blue-600 rounded bg-transparent focus-within:ring-2 ring-blue-500/20">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="peer w-4 h-4 opacity-0 absolute cursor-pointer"
                  />
                  <svg className="w-3 h-3 text-blue-600 hidden peer-checked:block pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </label>
            </div>

            <Button
              type="submit"
              disabled={requestCode.isPending}
              className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <img src="/signIn/message.svg" alt="Message" className="w-5 h-5 object-contain mr-1" />
              {requestCode.isPending ? 'جارٍ التحقق من أنك لست روبوت…' : 'إرسال رمز التحقق'}
            </Button>
          </form>

          <div className="text-center mt-3">
             <p className="text-[10px] text-slate-400">© 2026 CIRO Fuel Transport &amp; Logistics</p>
          </div>
        </div>
      </div>

      {/* Feature Cards Bottom Strip */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pb-8 flex flex-col md:flex-row gap-6 justify-between mt-auto z-10">

        {/* Card 1 (Rightmost in view due to RTL) */}
        <div className="flex-1 bg-slate-100/90 backdrop-blur-xl border border-white/50 rounded-3xl p-5 flex items-center justify-between shadow-lg">
          <div className="text-right flex-1 pl-2">
            <h3 className="font-bold text-slate-800 mb-1 text-sm">تتبع لحظي للشحنات</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">تابع طلباتك و شحناتك و حالة التواصل لحظة بلحظة.</p>
          </div>
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#10B981] flex items-center justify-center text-white shadow-sm">
            <img src="/signIn/truck.svg" alt="Truck" className="w-5 h-5 object-contain" />
          </div>
        </div>

        {/* Card 2 (Middle) */}
        <div className="flex-1 bg-slate-100/90 backdrop-blur-xl border border-white/50 rounded-3xl p-5 flex items-center justify-between shadow-lg">
          <div className="text-right flex-1 pl-2">
            <h3 className="font-bold text-slate-800 mb-1 text-sm">إدارة متكاملة للوقود</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">تحكم كامل في دورة الطلب من البداية حتي التسليم.</p>
          </div>
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#2563EB] flex items-center justify-center text-white shadow-sm">
            <img src="/signIn/setting.svg" alt="Settings" className="w-5 h-5 object-contain" />
          </div>
        </div>

        {/* Card 3 (Leftmost) */}
        <div className="flex-1 bg-slate-100/90 backdrop-blur-xl border border-white/50 rounded-3xl p-5 flex items-center justify-between shadow-lg">
          <div className="text-right flex-1 pl-2">
            <h3 className="font-bold text-slate-800 mb-1 text-sm">شبكة موثوقة و آمنة</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">ربط آمن بين المحطات و العلامات التجارية و الناقلون المعتمدين.</p>
          </div>
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#10B981] flex items-center justify-center text-white shadow-sm">
            <img src="/signIn/protection.svg" alt="Protection" className="w-5 h-5 object-contain" />
          </div>
        </div>

      </div>
    </div>
  );
}
