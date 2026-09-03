import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { MeProfile } from '@/petrol_company/profile/api/profile.api';

// Feature 013 T127/FR-054: wired to the real profile. Dropped: a fabricated account code
// ("DRV-2024-011") and join date — `GET /auth/me` carries neither, and adding a second
// fetch just for a cosmetic date was not worth it.
export function ProfileHeader({ me }: { me: MeProfile }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-start w-full" dir="rtl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="bg-white border border-[#E7E9EF] rounded-lg p-1.5 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <span className="text-[#162155] font-bold text-sm cursor-pointer" onClick={() => navigate(-1)}>{t('profile.title')}</span>
        </div>
      </div>

      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col w-full">
        <div className="flex items-center justify-start w-full gap-4">
          <div className="relative w-16 h-16 rounded-full shrink-0 border border-[#E7E9EF] shadow-sm bg-slate-100 flex items-center justify-center">
            <span className="text-xl font-black text-slate-400">{me.fullName.charAt(0)}</span>
          </div>
          <div className="flex flex-col gap-1.5 text-right items-start">
            <div className="flex items-center gap-3 justify-end">
              <span className="text-[#162155] font-black text-xl">{me.fullName}</span>
              <span className={me.isActive ? "bg-[#DCFCE7] text-[#16A34A] px-3 py-0.5 rounded-full text-xs font-bold" : "bg-red-50 text-red-500 px-3 py-0.5 rounded-full text-xs font-bold"}>
                {me.isActive ? t('common.active') : t('common.inactive')}
              </span>
            </div>
            <span className="text-[#858C95] text-xs font-bold">{t('profile.roleLabel')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
