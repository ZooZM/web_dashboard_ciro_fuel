import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Check, X } from 'lucide-react';
import { useUpdateMyName } from '@/petrol_company/profile/hooks/useProfile';
import { ApiError } from '@/lib/api/api-error';
import type { MeProfile } from '@/petrol_company/profile/api/profile.api';

// Feature 013 T127/FR-054: wired to `GET /auth/me`/`PATCH /users/:id`. Dropped the
// fabricated "job title" field entirely — no such field exists on `User`. Phone stays
// read-only here (it has its own real, OTP-verified change flow, wired on `ProfilePage`
// instead); email is immutable everywhere on the platform, also read-only.
export function ProfileAccountCard({ me }: { me: MeProfile }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(me.fullName);
  const updateName = useUpdateMyName(me.id);

  async function handleSave() {
    try {
      await updateName.mutateAsync(fullName);
      toast.success(t('profile.saveSuccess'));
      setIsEditing(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  return (
    <div className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col gap-8 w-full h-full relative transition-colors ${isEditing ? 'border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,1)]' : 'border-[#E7E9EF]'}`}>
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-6 left-6 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
        >
          <img src="/transportCompany/profilePage/edit (2).svg" alt={t('common.edit')} className="w-6 h-6 object-contain" />
        </button>
      ) : (
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <button
            onClick={() => { setFullName(me.fullName); setIsEditing(false); }}
            className="w-8 h-8 rounded-lg bg-white border border-red-200 flex items-center justify-center hover:bg-red-50 transition-colors"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
          <button
            onClick={handleSave}
            disabled={updateName.isPending}
            className="flex items-center gap-1.5 px-3 h-8 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] hover:bg-green-100 transition-colors text-xs font-bold disabled:opacity-60"
          >
            {t('common.save')}
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-start w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/transportCompany/profilePage/user.svg" alt="" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-[#162155] font-black text-lg">{t('profile.accountData')}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-2">
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-2 text-right">
            <span className="text-[#858C95] text-xs font-bold">{t('profile.fullName')}</span>
            {!isEditing ? (
              <span className="text-[#162155] font-black text-sm">{me.fullName}</span>
            ) : (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 border border-[#E7E9EF] rounded-lg px-3 outline-none focus:border-blue-500 transition-colors text-sm font-bold text-[#162155]"
              />
            )}
          </div>
          <div className="flex flex-col gap-2 text-right">
            <span className="text-[#858C95] text-xs font-bold">{t('common.phone')}</span>
            <span className="text-[#162155] font-black text-sm" dir="ltr">{me.phone}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-2 text-right">
            <span className="text-[#858C95] text-xs font-bold">{t('profile.accountEmail')}</span>
            <span className="text-[#162155] font-black text-sm" dir="ltr">{me.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
