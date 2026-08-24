import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '@/stores/session.store';
import { toast } from '@/lib/toast/toast';
import { Shield, Truck, Fuel } from 'lucide-react';
import type { Role } from '@/constants/roles';

export function RoleSelectionPage() {
  const navigate = useNavigate();
  const setSession = useSessionStore((s) => s.setSession);

  const handleSelectRole = (role: Role, route: string, name: string) => {
    setSession(
      { id: '1', email: 'admin@ciro.com', fullName: name, role } as any,
      'dummy-token'
    );
    toast.success(`تم تسجيل الدخول بصلاحية ${name}`);
    navigate(route);
  };

  return (
    <div
      className="flex min-h-svh w-full flex-col relative overflow-y-auto bg-cover bg-center"
      style={{ backgroundImage: 'url(/signIn/bg-truck.png)' }}
      dir="rtl"
    >
      <div className="flex-1 flex w-full max-w-7xl mx-auto items-center justify-center px-4 md:px-8 py-8 md:py-0">
        <div className="w-full max-w-[500px] bg-white/40 backdrop-blur-lg border border-white/60 rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-6 mt-8 md:mt-0 items-center">
          
          <img src="/LOGO/Logo.svg" alt="CIRO Fuel" className="w-[180px] h-auto object-contain mb-4" />
          
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-slate-800">اختر صلاحية الدخول</h1>
            <p className="text-sm text-slate-500 mt-2">
              (نسخة تجريبية) الرجاء اختيار نوع الحساب للمتابعة
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <button 
              onClick={() => handleSelectRole('SUPER_ADMIN', '/admin', 'مدير النظام')}
              className="flex items-center gap-4 bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-right">
                <h3 className="font-bold text-slate-800">مدير النظام (Admin)</h3>
                <p className="text-xs text-slate-500 mt-1">إدارة النظام بالكامل و جميع الشركات</p>
              </div>
            </button>

            <button 
              onClick={() => handleSelectRole('CLIENT', '/petrolCompany', 'علامة تجارية')}
              className="flex items-center gap-4 bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                <Fuel className="w-6 h-6" />
              </div>
              <div className="text-right">
                <h3 className="font-bold text-slate-800">علامة تجارية (Petrol Brand)</h3>
                <p className="text-xs text-slate-500 mt-1">إدارة المحطات، الطلبات، والفواتير</p>
              </div>
            </button>

            <button 
              onClick={() => handleSelectRole('COMPANY_ADMIN', '/transport', 'شركة نقل')}
              className="flex items-center gap-4 bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div className="text-right">
                <h3 className="font-bold text-slate-800">شركة نقل (Transportation)</h3>
                <p className="text-xs text-slate-500 mt-1">إدارة السائقين، الشحنات، والتتبع</p>
              </div>
            </button>
          </div>

          <button 
            onClick={() => navigate('/')} 
            className="mt-4 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    </div>
  );
}
