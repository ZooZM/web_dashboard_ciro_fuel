import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProfileHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Breadcrumb row */}
      <div className="flex items-center justify-start w-full" dir="rtl">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="bg-white border border-[#E7E9EF] rounded-lg p-1.5 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <span className="text-[#162155] font-bold text-sm cursor-pointer" onClick={() => navigate(-1)}>الحساب الشخصي</span>
        </div>
      </div>
      
      {/* Profile Card */}
      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col w-full">
        
        {/* Top Profile Row */}
        <div className="flex items-center justify-start w-full gap-4">
           {/* Avatar */}
           <div className="relative w-16 h-16 rounded-full shrink-0 border border-[#E7E9EF] shadow-sm">
              <img src="/transportCompany/profilePage/profile.jpg" alt="أحمد السبيعي" className="w-full h-full object-cover rounded-full" />
              {/* Blue verified badge in bottom right (left in RTL context but visual bottom left of image, let's put it at bottom left of avatar circle) */}
              <div className="absolute -bottom-1 left-0 z-10 bg-white  rounded-lg w-6 h-6 flex items-center justify-center border-2 border-white">
                <img src="/transportCompany/profilePage/edit (2).svg" alt="" className="w-4 h-4 object-contain" />
              </div>
           </div>
           {/* Profile info */}
           <div className="flex flex-col gap-1.5 text-right items-start">
              <div className="flex items-center gap-3 justify-end">
                 <span className="text-[#162155] font-black text-xl">إبراهيم القحطاني</span>
                 <span className="bg-[#DCFCE7] text-[#16A34A] px-3 py-0.5 rounded-full text-xs font-bold">نشط</span>
              </div>
              <div className="flex items-center gap-2 justify-end text-[#858C95] text-xs font-bold" dir="rtl">
                 <span>DRV-2024-011</span>
                 <span>-</span>
                 <span>تاريخ الانضمام 2022/01/15</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
