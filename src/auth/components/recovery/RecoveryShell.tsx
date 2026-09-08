import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * spec 015 US7 — the visual language of `LoginPage`/`VerifyPage` (glass card,
 * logo, RTL, truck background) without the feature-cards strip, shared by the
 * three recovery screens.
 */
export function RecoveryShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className="flex min-h-svh w-full flex-col relative overflow-y-auto bg-cover bg-center"
      style={{ backgroundImage: 'url(/signIn/bg-truck.png)' }}
      dir="rtl"
    >
      <div className="flex-1 flex w-full max-w-7xl mx-auto items-center justify-start px-4 md:px-8 py-8">
        <div className="w-full max-w-[400px] bg-white/40 backdrop-blur-lg border border-white/60 rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4">
            <img src="/LOGO/Logo.svg" alt="CIRO Fuel" className="w-[180px] h-auto object-contain mb-2" />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
              {subtitle && <p className="text-sm text-slate-500 mt-2 leading-relaxed">{subtitle}</p>}
            </div>
          </div>

          {children}

          <div className="text-center">
            <Link to="/" className="text-xs font-medium text-blue-600 hover:text-blue-500">
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
