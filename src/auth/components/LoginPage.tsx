import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/lib/toast/toast';
import { useSessionStore } from '@/stores/session.store';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().optional(), // Keeping as email internally for backend compatibility
  password: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/verify', { state: { phone } });
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
              <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden shadow-sm h-14">
                <div className="flex-1 px-4 h-full relative">
                  <div className="absolute top-1.5 right-4 text-[10px] text-slate-400 font-medium">رقم الجوال</div>
                  <Input 
                    type="text"
                    placeholder="5X XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-0 focus-visible:ring-0 shadow-none h-full rounded-none bg-transparent pt-5 pb-1 px-0 text-sm font-medium placeholder:text-slate-300"
                  />
                </div>
                <div className="flex items-center px-4 border-r border-slate-200 text-slate-600 bg-transparent h-10 shrink-0 gap-1.5" dir="ltr">
                  <img src="/signIn/phone.svg" alt="Phone" className="w-4 h-4 ml-1 object-contain" />
                  <div className="w-[1px] h-10 bg-slate-200 mx-1"></div>
                  <span className="text-xs font-medium mt-0.5 text-slate-600">+966</span>
                  <ChevronDown className="w-3 h-3 mt-1.5 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end mt-3 mb-2 px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">تذكرني</span>
                <div className="relative flex items-center justify-center w-4 h-4 border border-blue-600 rounded bg-transparent focus-within:ring-2 ring-blue-500/20">
                  <input type="checkbox" className="peer w-4 h-4 opacity-0 absolute cursor-pointer" />
                  <svg className="w-3 h-3 text-blue-600 hidden peer-checked:block pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <img src="/signIn/message.svg" alt="Message" className="w-5 h-5 object-contain mr-1" />
              إرسال رمز التحقق
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
