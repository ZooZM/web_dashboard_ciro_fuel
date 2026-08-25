import { useSession } from '@/stores/session.store';

export function AdminProfileHeader() {
  const { user } = useSession();
  return (
    <div className="w-full bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 relative overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img src="/topBar/profilePic.jpg" alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-[#E7E9EF]" />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
              <img src="/transportCompany/profilePage/whiteRightCheck.svg" alt="Verified" className="w-3 h-3" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 text-right">
          <div className="flex items-center gap-3">
            <span className="text-[#162155] font-black text-xl">{user?.fullName || 'حسين السيد'}</span>
            <div className="px-3 py-1 bg-[#ECFDF5] text-[#10B981] text-[10px] font-bold rounded-full">نشط</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center">
               <img src="/transportCompany/profilePage/detail.svg" alt="" className="w-2.5 h-2.5" />
            </div>
            <span className="text-[#858C95] text-xs font-bold">DRV-2024-011 - تاريخ الانضمام 2022/01/15</span>
          </div>
        </div>
      </div>
    </div>
  );
}
