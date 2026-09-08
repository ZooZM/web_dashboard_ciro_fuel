import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/lib/toast/toast';
import { requestPasswordReset } from '@/auth/api/auth.api';
import { toE164Saudi, looksLikeSaudiMobile } from '@/lib/auth/phone';
import { ApiError } from '@/lib/api/api-error';
import { RecoveryShell } from './RecoveryShell';

/**
 * spec 015 US7 / FR-068 — a NEUTRAL confirmation on 202 regardless of outcome.
 * Never reveals whether the number is registered.
 */
export function RecoveryRequestPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');

  const mutation = useMutation({
    mutationFn: (e164: string) => requestPasswordReset({ phone: e164 }),
    onSuccess: (_data, e164) => navigate('/recovery/verify', { state: { phone: e164 } }),
    onError: (err) => {
      if (err instanceof ApiError && err.error === 'RESET_RATE_LIMITED') {
        const wait = err.retryAfterSeconds ?? 60;
        toast.error(`محاولات كثيرة. حاول مرة أخرى بعد ${wait} ثانية.`);
        return;
      }
      toast.error('تعذّر إرسال الرمز. حاول مرة أخرى.');
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const e164 = toE164Saudi(phone);
    if (!looksLikeSaudiMobile(e164)) {
      toast.error('يرجى إدخال رقم جوال صحيح');
      return;
    }
    mutation.mutate(e164);
  };

  return (
    <RecoveryShell
      title="استعادة كلمة المرور"
      subtitle="أدخل رقم جوالك المسجّل وسنرسل لك رمزًا لإعادة تعيين كلمة المرور."
    >
      <form onSubmit={submit} className="flex flex-col gap-4 w-full">
        <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-14">
          <Input
            type="text"
            inputMode="numeric"
            placeholder="5X XXX XXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border-0 focus-visible:ring-0 shadow-none h-full rounded-none bg-transparent px-4 text-sm font-medium"
          />
          <div className="flex items-center px-4 border-r border-slate-200 text-slate-600 h-10 shrink-0" dir="ltr">
            <span className="text-xs font-medium text-slate-600">+966</span>
          </div>
        </div>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/30"
        >
          إرسال الرمز
        </Button>
      </form>
    </RecoveryShell>
  );
}
