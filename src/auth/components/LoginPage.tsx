import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/auth/hooks/useLogin';
import { toast } from '@/lib/toast/toast';
import { useTranslation } from 'react-i18next';

/**
 * Feature 009 Slice 0: every dashboard role (SUPER_ADMIN, FUEL_COMPANY_ADMIN,
 * TRANSPORT_COMPANY_ADMIN) authenticates by email + password (`LoginDto`) — the
 * platform's phone + OTP path exists only for CLIENT/DRIVER, neither of which may hold
 * a dashboard session (`DASHBOARD_LOGIN_ROLES`). The previous version of this screen
 * collected a phone number and a 4-digit code and passed them through as `email`/
 * `password`, which cannot authenticate any role this dashboard admits — the request
 * would always land on GENERIC_AUTH_ERROR. This replaces the fields with the pair the
 * platform actually validates, while keeping the screen's existing visual shell.
 */
export function LoginPage() {
  const { t } = useTranslation();
  const loginMutation = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    loginMutation.mutate(
      { email, password },
      {
        onError: () => {
          toast.error(t('auth.login.invalidCredentials') || 'بيانات الدخول غير صحيحة');
        },
      },
    );
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 px-1">{t('auth.login.email')}</label>
              <Input
                type="email"
                autoComplete="username"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-2xl bg-white border-slate-200 px-4 text-sm font-medium shadow-sm"
                dir="ltr"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 px-1">{t('auth.login.password')}</label>
              <Input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-2xl bg-white border-slate-200 px-4 text-sm font-medium shadow-sm"
                dir="ltr"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loginMutation.isPending ? t('common.loading') : t('auth.login.submit')}
            </Button>
          </form>

          <div className="text-center mt-3">
             <p className="text-[10px] text-slate-400">© 2026 CIRO Fuel Transport &amp; Logistics</p>
          </div>
        </div>
      </div>

      {/* Feature Cards Bottom Strip */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pb-8 flex flex-col md:flex-row gap-6 justify-between mt-auto z-10">

        <div className="flex-1 bg-slate-100/90 backdrop-blur-xl border border-white/50 rounded-3xl p-5 flex items-center justify-between shadow-lg">
          <div className="text-right flex-1 pl-2">
            <h3 className="font-bold text-slate-800 mb-1 text-sm">تتبع لحظي للشحنات</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">تابع طلباتك و شحناتك و حالة التواصل لحظة بلحظة.</p>
          </div>
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#10B981] flex items-center justify-center text-white shadow-sm">
            <img src="/signIn/truck.svg" alt="Truck" className="w-5 h-5 object-contain" />
          </div>
        </div>

        <div className="flex-1 bg-slate-100/90 backdrop-blur-xl border border-white/50 rounded-3xl p-5 flex items-center justify-between shadow-lg">
          <div className="text-right flex-1 pl-2">
            <h3 className="font-bold text-slate-800 mb-1 text-sm">إدارة متكاملة للوقود</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">تحكم كامل في دورة الطلب من البداية حتي التسليم.</p>
          </div>
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#2563EB] flex items-center justify-center text-white shadow-sm">
            <img src="/signIn/setting.svg" alt="Settings" className="w-5 h-5 object-contain" />
          </div>
        </div>

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
