import { useSession } from '@/stores/session.store';
import { useLayoutStore } from '@/stores/layout.store';

export function Topbar() {
  const { user } = useSession();
  const { toggleSidebar } = useLayoutStore();

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b rounded-xl mx-3 my-2 border-slate-200 bg-white px-4 md:px-6 shadow-sm" dir="ltr">
      {/* Left side: Logo & Mobile Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">

        <img src="/topBar/topBarLogo.svg" alt="CIRO FUEL" className="h-5 sm:h-6 shrink-0" />
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 items-center justify-end border-r border-slate-200 pr-3 mr-4">
        <div className="flex items-center w-[246px] h-[32px] rounded-lg border border-slate-200 bg-slate-50 px-4 gap-2 transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500" dir="rtl">
          <img src="/topBar/search.svg" alt="Search" className="w-4 h-4 object-contain opacity-50 shrink-0" />
          <input 
            type="text" 
            placeholder="ابحث بكود الطلب أو الشركة..." 
            className="flex-1 bg-transparent border-none outline-none text-[11px] text-slate-700 placeholder:text-slate-400 w-full h-full"
          />
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-3 md:gap-6 ml-auto md:ml-0">
        <div className="flex items-center gap-3 md:gap-4">
          <button className="text-blue-500 hover:text-blue-600 transition-colors">
            <img src="/topBar/i.svg" alt="Info" className="h-5 w-5 object-contain" />
          </button>
          <button className="relative text-blue-500 hover:text-blue-600 transition-colors">
            <img src="/topBar/notification.svg" alt="Notification" className="h-5 w-5 object-contain" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-500 text-[8px] font-bold text-white border-2 border-white">
              5
            </span>
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200"></div>

        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
          <img src="/topBar/profilePic.jpg" alt="Avatar" className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover border-2 border-white shadow-sm" />
          <div className="hidden sm:flex flex-col text-right" dir="rtl">
            <span className="text-sm font-bold text-slate-800">{user?.fullName || 'أحمد السبيعي'}</span>
            <span className="text-[10px] text-slate-500">مدير عمليات</span>
          </div>
          <img src="/topBar/chevronDown.svg" alt="Menu" className="h-3 w-3 object-contain opacity-50 group-hover:opacity-80 transition-opacity" />
        </div>
      </div>

              <button onClick={toggleSidebar} className="md:hidden p-1.5 shrink-0 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
    </header>
  );
}
