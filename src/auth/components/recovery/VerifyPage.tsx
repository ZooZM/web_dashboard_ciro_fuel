import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast/toast';
import { verifyPasswordResetCode } from '@/auth/api/auth.api';
import { RecoveryShell } from './RecoveryShell';

const CODE_LENGTH = 6; // FR-070

/**
 * spec 015 US7 / FR-070 — six boxes, ONE message for every failure state, no
 * attempt counter. The returned `resetToken` is held in route state only and
 * never persisted.
 */
export function RecoveryVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone: string = location.state?.phone || '';

  const [otp, setOtp] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!phone) navigate('/recovery', { replace: true });
  }, [phone, navigate]);

  const mutation = useMutation({
    mutationFn: (code: string) => verifyPasswordResetCode({ phone, code }),
    onSuccess: ({ resetToken }) =>
      navigate('/recovery/new-password', { state: { resetToken } }),
    onError: () => {
      toast.error('الرمز غير صحيح أو منتهي الصلاحية.');
      setOtp(Array(CODE_LENGTH).fill(''));
      refs.current[0]?.focus();
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length === CODE_LENGTH) mutation.mutate(code);
  };

  const change = (i: number, v: string) => {
    if (v.length > 1) v = v.slice(-1);
    if (v && !/\d/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < CODE_LENGTH - 1) refs.current[i + 1]?.focus();
  };

  return (
    <RecoveryShell
      title="أدخل رمز الاستعادة"
      subtitle={
        <>
          تم إرسال رمز مكوّن من 6 أرقام إلى
          <br />
          <span className="font-bold text-slate-800 inline-block mx-1" dir="ltr">{phone}</span>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4 w-full">
        <div className="flex justify-center gap-2 w-full my-2" dir="ltr">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => change(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
              }}
              className="w-11 h-14 text-center text-xl font-bold bg-white border border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm text-slate-800"
            />
          ))}
        </div>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/30"
        >
          متابعة
        </Button>
      </form>
    </RecoveryShell>
  );
}
