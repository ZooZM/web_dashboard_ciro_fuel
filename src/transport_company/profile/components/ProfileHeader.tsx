import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DriverEditForm } from '@/transport_company/drivers/components/driver-details/DriverEditForm';

export function ProfileHeader({ 
  isEditing, 
  onEditClick,
  onCancelEdit
}: { 
  isEditing: boolean; 
  onEditClick: () => void; 
  onCancelEdit: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Breadcrumb row */}
      <div className="flex items-center justify-start w-full">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="bg-white border border-slate-200 rounded-lg p-2 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
          <span className="text-slate-500 font-bold text-sm cursor-pointer" onClick={() => navigate(-1)}>الطلبات / <span className="text-slate-800">ORD-2024-256</span></span>
        </div>
      </div>
      
      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col w-full gap-6">
        
        {/* Top Profile Row */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
           {/* Right side: Profile info */}
           <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                <img src="/profilePage/profile.jpg" alt="أحمد السبيعي" className="w-full h-full object-cover" />
             </div>
             <div className="flex flex-col gap-1.5 text-right">
                <div className="flex items-center gap-3 justify-start">
                   <span className="text-[#162155] font-black text-xl">أحمد السبيعي</span>
                   <span className="bg-[#DCFCE7] text-[#16A34A] px-3 py-0.5 rounded-full text-xs font-bold">نشط</span>
                </div>
                <div className="flex items-center gap-2 justify-end text-slate-400 text-xs font-bold" dir="rtl">
                   <span>DRV-2024-011</span>
                   <span>-</span>
                   <span>تاريخ الانضمام 2022/01/15</span>
                </div>
             </div>
           </div>
           
           {/* Left side: Buttons */}
           <div className="flex items-center gap-3 w-full md:w-auto justify-end md:justify-start">
              {!isEditing && (
                <button 
                  onClick={onEditClick}
                  className="flex flex-1 md:flex-none justify-center items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                   <img src="/profilePage/edit.svg" alt="" className="w-4 h-4 object-contain" />
                   تعديل بيانات السائق
                </button>
              )}
           </div>
        </div>

        {/* Edit Form Area */}
        {isEditing && (
          <div className="w-full mt-4 pt-4 border-t border-slate-100">
             <DriverEditForm onCancel={onCancelEdit} />
          </div>
        )}
      </div>
    </div>
  );
}
