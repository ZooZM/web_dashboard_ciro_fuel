import { useSession } from '@/stores/session.store';
import { useLayoutStore } from '@/stores/layout.store';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { User, Globe, Headset, Info, ChevronLeft, ChevronUp, LifeBuoy } from 'lucide-react';

export function Topbar() {
  const { user } = useSession();
  const { toggleSidebar } = useLayoutStore();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let basePath = '/transport';
  if (user?.role === 'SUPER_ADMIN') basePath = '/admin';
  else if (user?.role === 'CLIENT') basePath = '/petrol';

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
            <img src="/topBar/i.svg" alt="Info" className="h-5 w-5 object-contain" onClick={()=> navigate(`${basePath}/terms`)} />
          </button>
          <button className="relative text-blue-500 hover:text-blue-600 transition-colors" onClick={()=> navigate(`${basePath}/notifications`)}>
            <img src="/topBar/notification.svg" alt="Notification" className="h-5 w-5 object-contain" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-500 text-[8px] font-bold text-white border-2 border-white">
              5
            </span>
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200"></div>

        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img src="/topBar/profilePic.jpg" alt="Avatar" className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover border-2 border-white shadow-sm" />
            <div className="hidden sm:flex flex-col text-right" dir="rtl">
              <span className="text-sm font-bold text-slate-800">{user?.fullName || 'أحمد السبيعي'}</span>
              <span className="text-[10px] text-slate-500">مدير عمليات</span>
            </div>
            <img src="/topBar/chevronDown.svg" alt="Menu" className={`h-3 w-3 object-contain opacity-50 group-hover:opacity-80 transition-all ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-lg z-50 p-2 flex flex-col gap-1 text-right" dir="rtl">
              <button onClick={() => { setIsDropdownOpen(false); navigate(`${basePath}/profile`); }} className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-bold text-slate-700">الحساب</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
              </button>
              
              <div className="h-px bg-slate-100 mx-2" />
              
              <div className="flex flex-col">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsLangOpen(!isLangOpen); }}
                  className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold text-slate-700">اللغة</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-500 transition-colors">
                    <span className="text-xs font-bold">عربي</span>
                    {isLangOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </div>
                </button>

                {isLangOpen && (
                  <div className="flex flex-col gap-2 p-2 mx-1 mt-1 bg-slate-100/50 rounded-xl">
                    <button className="flex items-center justify-between px-4 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                       <span className="text-sm font-bold text-[#162155]">English</span>
                       <div className="w-2 h-2 rounded-full bg-slate-400" />
                    </button>
                    <button className="flex items-center justify-between px-4 py-2 border border-blue-500 rounded-lg bg-blue-50/50 hover:bg-blue-50 transition-colors">
                       <span className="text-sm font-bold text-blue-700">اللغة العربية</span>
                       <div className="w-2 h-2 rounded-full bg-blue-600" />
                    </button>
                  </div>
                )}
              </div>

              <div className="h-px bg-slate-100 mx-2" />

              <button onClick={() => { setIsDropdownOpen(false); navigate(`${basePath}/help`); }} className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <LifeBuoy className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-bold text-slate-700">الدعم والمساعدة</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
              </button>

              <div className="h-px bg-slate-100 mx-2" />

              <button onClick={() => { setIsDropdownOpen(false); navigate(`${basePath}/terms`); }} className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-bold text-slate-700">الشروط والأحكام</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
              </button>
            </div>
          )}
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
