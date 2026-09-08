import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/lib/toast/toast';
import { completePasswordReset } from '@/auth/api/auth.api';
import { RecoveryShell } from './RecoveryShell';

/**
 * spec 015 US7 / FR-072 — on 204, return to sign-in with a success notice.
 * Every one of the account's sessions has ended.
 */
export function RecoveryNewPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken: string = location.state?.resetToken || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  useEffect(() => {
    if (!resetToken) navigate('/recovery', { replace: true });
  }, [resetToken, navigate]);

  const mutation = useMutation({
    mutationFn: (newPassword: string) => completePasswordReset({ resetToken, newPassword }),
    onSuccess: () => {
      toast.success('تم تعيين كلمة المرور. سجّل الدخول بها الآن.');
      navigate('/', { replace: true });
    },
    onError: () => toast.error('تعذّر تعيين كلمة المرور. قد تكون الجلسة منتهية.'),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    if (password !== confirm) {
      toast.error('كلمتا المرور غير متطابقتين');
      return;
    }
    mutation.mutate(password);
  };

  return (
    <RecoveryShell title="تعيين كلمة مرور جديدة">
      <form onSubmit={submit} className="flex flex-col gap-4 w-full">
        <Input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-14 rounded-2xl bg-white border border-slate-200 px-4 text-sm"
        />
        <Input
          type="password"
          placeholder="تأكيد كلمة المرور"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="h-14 rounded-2xl bg-white border border-slate-200 px-4 text-sm"
        />
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/30"
        >
          حفظ كلمة المرور
        </Button>
      </form>
    </RecoveryShell>
  );
}
