import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/lib/toast/toast';
import { useRequestLoginCode, useVerifyLoginCode } from '@/auth/hooks/useLoginCode';
import { ApiError } from '@/lib/api/api-error';

const CODE_LENGTH = 6; // FR-043 — OtpPrimitivesService.generateCode() is 6-digit
const RESEND_SECONDS = 45;

export function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const phone: string = location.state?.phone || '';
  const remember: boolean = location.state?.remember ?? false;

  const verifyCode = useVerifyLoginCode();
  const resendCode = useRequestLoginCode();

  const [otp, setOtp] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [timeLeft, setTimeLeft] = useState(RESEND_SECONDS);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // A missing phone means the user reached /verify directly — send them back
  // to enter one (replaces the two dead demo navigations that used to be here).
  useEffect(() => {
    if (!phone) navigate('/', { replace: true });
  }, [phone, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== CODE_LENGTH) return;

    verifyCode.mutate(
      { phone, code, remember },
      {
        onError: (err) => {
          if (err instanceof ApiError && err.error === 'LOGIN_RATE_LIMITED') {
            const wait = err.retryAfterSeconds ?? 60;
            toast.error(`محاولات كثيرة. حاول مرة أخرى بعد ${wait} ثانية.`);
            return;
          }
          // FR-034: ONE message for every failure state (wrong / expired /
          // superseded / attempt-locked) — no attempt counter.
          toast.error('الرمز غير صحيح أو منتهي الصلاحية.');
          setOtp(Array(CODE_LENGTH).fill(''));
          otpRefs.current[0]?.focus();
        },
      },
    );
  };

  const handleResend = () => {
    if (timeLeft > 0 || resendCode.isPending) return;
    resendCode.mutate(phone, {
      onSuccess: () => {
        setTimeLeft(RESEND_SECONDS);
        toast.success('تم إرسال رمز جديد.');
      },
      onError: (err) => {
        if (err instanceof ApiError && err.error === 'LOGIN_RATE_LIMITED') {
          const wait = err.retryAfterSeconds ?? 60;
          setTimeLeft(wait);
          toast.error(`محاولات كثيرة. حاول مرة أخرى بعد ${wait} ثانية.`);
          return;
        }
        toast.error('تعذّر إرسال رمز جديد.');
      },
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/\d/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < CODE_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const busy = verifyCode.isPending || resendCode.isPending;

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
              <h1 className="text-2xl font-bold text-slate-800">أدخل رمز التحقق</h1>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                تم إرسال رمز مكون من 6 أرقام إلى
                <br />
                <span className="font-bold text-slate-800 inline-block mx-1" dir="ltr">{phone || '+9665X XXX XXXX'}</span>
                <button type="button" onClick={() => navigate('/', { replace: true })} className="text-[#F97316] hover:text-orange-600 font-medium text-xs mr-2">تغيير الرقم</button>
              </p>
            </div>
          </div>

          <form onSubmit={handleVerifyCode} className="flex flex-col gap-4 w-full mt-2">
            <div className="flex justify-center gap-2 w-full my-2" dir="ltr">
              {otp.map((digit, index) => (
                <div key={index} className="relative">
                  <input
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-11 h-14 text-center text-xl font-bold bg-white border border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm text-slate-800"
                  />
                  {digit && <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />}
                </div>
              ))}
            </div>

            <div className="text-center mt-2 mb-2">
              <p className="text-xs font-medium text-slate-500">
                لم يصلك الرمز؟{' '}
                <button
                  type="button"
                  disabled={timeLeft > 0 || resendCode.isPending}
                  onClick={handleResend}
                  className={`font-semibold  ${timeLeft > 0 ? '  cursor-not-allowed' : 'cursor-pointer text-blue-500 hover:text-blue-400'}`}
                >
                  إعادة الإرسال {timeLeft > 0 && `خلال 00:${timeLeft.toString().padStart(2, '0')}`}
                </button>
              </p>
            </div>

            <Button
              type="submit"
              disabled={busy}
              className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <img src="/signIn/logout.svg" alt="Login" className="w-5 h-5 object-contain ml-1" />
              تسجيل الدخول
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
