import { useState } from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DriverDetailsHeader() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Breadcrumb row */}
      <div className="flex items-center justify-start w-full">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/transport/drivers')}
            className="bg-white border border-slate-200 rounded-lg p-2 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
          <span className="text-slate-500 font-bold text-sm cursor-pointer" onClick={() => navigate('/transport/drivers')}>السائقين / <span className="text-slate-800">محمد إبراهيم</span></span>
        </div>
      </div>
      
      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col w-full gap-6">
        
        {/* Top Profile Row */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
           {/* Right side: Profile info */}
           <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                <img src="/transportCompany/DriverPage/editDriver/profile.jpg" alt="محمد إبراهيم" className="w-full h-full object-cover" />
             </div>
             <div className="flex flex-col gap-1.5 text-right">
                 <div className="flex items-center gap-3 justify-start">
                   <span className="text-[#162155] font-black text-xl">محمد إبراهيم</span>
                   <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-red-100 text-red-600'}`}>{isActive ? 'نشط' : 'موقوف'}</span>
                </div>
                <div className="flex items-center gap-2 justify-end text-slate-400 text-xs font-bold" dir="rtl">
                   <div className="flex items-center gap-1">
                      <span className="text-slate-800">4.1</span>
                      <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
                   </div>
                   <span>تقييم</span>
                   <span>-</span>
                   <span>DRV-2024-011</span>
                   <span>-</span>
                   <span>تاريخ الانضمام 2022/01/15</span>
                </div>
             </div>
           </div>
           
           {/* Left side: Buttons */}
           <div className="flex items-center gap-3 w-full md:w-auto justify-end md:justify-start">
              <button 
                onClick={() => setIsActive(!isActive)}
                className={`flex flex-1 md:flex-none justify-center items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-colors border ${isActive ? 'bg-[#FEF2F2] text-red-500 hover:bg-red-100 border-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100'}`}
              >
                 {isActive ? (
                   <>
                     <img src="/transportCompany/DriverPage/editDriver/pause.svg" alt="" className="w-4 h-4 object-contain" />
                     إيقاف السائق
                   </>
                 ) : (
                   <>
                     تفعيل السائق
                   </>
                 )}
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
