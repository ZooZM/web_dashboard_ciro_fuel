import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AdminProfileHeader } from './AdminProfileHeader';
import { AdminProfileStats } from './AdminProfileStats';
import { AdminProfileAccountCard } from './AdminProfileAccountCard';
import { AdminProfilePermissions } from './AdminProfilePermissions';
import { AdminProfileSecurity } from './AdminProfileSecurity';
import { AdminProfileAdditionalData } from './AdminProfileAdditionalData';
import { AdminChangePhoneModal } from './AdminChangePhoneModal';

export function AdminProfilePage() {
  const navigate = useNavigate();

  const [isChangePhoneModalOpen, setIsChangePhoneModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);

  return (
    <>
      <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans animate-in fade-in duration-500" dir="rtl">
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 cursor-pointer w-fit" onClick={() => navigate('/admin')}>
              <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
                <img src="/petrolCompany/requests/details/chevronRight.svg" alt="Back" className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                الحساب الشخصي
              </span>
            </div>
          </div>

          <AdminProfileHeader />
          <AdminProfileStats />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="flex flex-col gap-6 col-span-1 lg:col-span-2">
              <AdminProfileAccountCard />
              <AdminProfilePermissions />
            </div>

            <div className="flex flex-col gap-6 col-span-1 lg:col-span-1">
              <AdminProfileSecurity onOpenPhoneModal={() => setIsChangePhoneModalOpen(true)} />
              <AdminProfileAdditionalData />
            </div>
          </div>

        </div>
      </div>

      <AdminChangePhoneModal 
        isOpen={isChangePhoneModalOpen} 
        onClose={() => setIsChangePhoneModalOpen(false)} 
        modalStep={modalStep}
        setModalStep={setModalStep}
      />
    </>
  );
}
