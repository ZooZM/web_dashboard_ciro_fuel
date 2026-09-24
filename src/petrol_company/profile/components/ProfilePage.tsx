import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Check, ChevronDown, Lock } from 'lucide-react';
import { ProfileHeader } from './ProfileHeader';
import { ProfileStats } from './ProfileStats';
import { ProfileAccountCard } from './ProfileAccountCard';
import { ProfileCompanyCard } from './ProfileCompanyCard';
import { ProfileCommissionSection } from './ProfileCommissionSection';
import {
  useMyProfile,
  useMyCompany,
  useRequestPhoneVerification,
  useConfirmPhoneVerification,
} from '@/petrol_company/profile/hooks/useProfile';
import { ApiError } from '@/lib/api/api-error';

// Feature 013 T127/T128/FR-054: wired to the administrator's real account, company and
// role. Dropped outright (FR-047/FR-048, no real data behind any of them): the
// "Permissions" list (a static, hand-picked list — not derived from any real RBAC
// introspection), "last login"/"active sessions" (not tracked anywhere), and "contract
// start date"/"cities covered" (neither exists on `Company`). The phone-change modal
// keeps its visual shape but now calls the real 6-digit OTP flow (spec 005 T097,
// `POST /users/me/phone/verification` + `/confirm`) — the mock's 4-digit input and its
// fully client-side, no-network "confirm" step were replaced; `ProfileCommissionSection`
// stays unwired per T128, belonging to US9 (Phase 12).
export function ProfilePage() {
  const { t } = useTranslation();
  const { data: me, isLoading, isError, refetch } = useMyProfile();
  const { data: company } = useMyCompany(me?.companyId ?? null);

  const [isChangePhoneModalOpen, setIsChangePhoneModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);
  const [localNumber, setLocalNumber] = useState('');
  const [code, setCode] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);

  const requestVerification = useRequestPhoneVerification();
  const confirmVerification = useConfirmPhoneVerification();

  const newPhoneE164 = `+966${localNumber.replace(/^0+/, '')}`;

  function closeModal() {
    setIsChangePhoneModalOpen(false);
    setModalStep(1);
    setLocalNumber('');
    setCode('');
    setModalError(null);
  }

  async function handleSendCode() {
    setModalError(null);
    try {
      await requestVerification.mutateAsync(newPhoneE164);
      setModalStep(2);
    } catch (err) {
      setModalError(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  async function handleConfirmCode() {
    setModalError(null);
    try {
      await confirmVerification.mutateAsync(code);
      setModalStep(3);
    } catch (err) {
      setModalError(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  if (isLoading) {
    return <div className="p-6 text-center text-sm text-slate-400">{t('common.loading')}</div>;
  }
  if (isError || !me) {
    return (
      <div className="p-6 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-red-500">{t('errors.generic')}</p>
        <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
        <div className="flex flex-col gap-6 w-full">
          <ProfileHeader me={me} />
          <ProfileStats />
          <ProfileCommissionSection />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="flex flex-col gap-6 col-span-1 lg:col-span-2">
              <ProfileAccountCard me={me} />
              {company && <ProfileCompanyCard company={company} />}
            </div>

            <div className="flex flex-col gap-6 col-span-1 lg:col-span-1">
              <div className="bg-gradient-to-b from-orange-100 via-orange-50 to-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col gap-6 w-full">
                <div className="flex items-center justify-start w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
                      <img src="/transportCompany/profilePage/lock.svg" alt="" className="w-6 h-6 object-contain" />
                    </div>
                    <span className="text-[#162155] font-black text-lg">{t('profile.changePhoneTitle')}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b border-[#E7E9EF] pb-4">
                    <span className="text-[#858C95] text-xs font-bold">{t('profile.currentPhone')}</span>
                    <span className="text-[#162155] font-black text-sm" dir="ltr">{me.phone}</span>
                  </div>

                  <button
                    onClick={() => setIsChangePhoneModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg py-3 transition-colors font-bold text-sm"
                  >
                    <img src="/transportCompany/profilePage/orangeEdit.svg" alt="" className="w-4 h-4 object-contain" />
                    {t('profile.changePhone')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isChangePhoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative m-4">
            <div className="flex items-center justify-between w-full mb-8">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-400" strokeWidth={1.5} />
                <span className="text-[#162155] font-black text-lg">{t('profile.changePhoneTitle')}</span>
              </div>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center bg-[#F8FAFC] rounded-lg hover:bg-slate-100 transition-colors">
                <img src="/transportCompany/profilePage/X.svg" alt="Close" className="w-4 h-4 object-contain" />
              </button>
            </div>

            {modalStep === 1 ? (
              <>
                <div className="flex flex-col items-center justify-center gap-2 mb-8 text-center">
                  <h3 className="text-[#162155] font-black text-base">{t('profile.newPhoneLabel')}</h3>
                  <p className="text-[#858C95] text-xs font-medium">{t('profile.newPhoneHint')}</p>
                </div>

                <div className="w-full mb-4">
                  <div className="flex items-center border border-[#E7E9EF] rounded-xl overflow-hidden h-12 focus-within:border-blue-500 transition-colors" dir="ltr">
                    <div className="flex items-center gap-2 px-4 h-full bg-[#F8FAFC] border-r border-[#E7E9EF]">
                      <span className="text-[#162155] font-bold text-sm">+966</span>
                      <ChevronDown className="w-4 h-4 text-[#858C95]" />
                    </div>
                    <input
                      type="text"
                      placeholder="5X XXX XXXX"
                      value={localNumber}
                      onChange={(e) => setLocalNumber(e.target.value)}
                      className="flex-1 h-full px-4 outline-none text-[#162155] font-bold text-left placeholder:text-[#858C95]/50"
                      dir="ltr"
                    />
                  </div>
                </div>

                {modalError && <p className="text-sm font-bold text-red-500 mb-4">{modalError}</p>}

                <div className="flex items-center gap-4 w-full">
                  <button onClick={closeModal} className="flex-1 py-3 rounded-xl border border-blue-600 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors">
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleSendCode}
                    disabled={requestVerification.isPending || !localNumber}
                    className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
                  >
                    {t('profile.sendCode')}
                  </button>
                </div>
              </>
            ) : modalStep === 2 ? (
              <>
                <div className="flex flex-col items-center justify-center gap-2 mb-8 text-center">
                  <p className="text-[#858C95] text-xs font-bold" dir="rtl">
                    {t('profile.codeSentTo', { phone: newPhoneE164 })}
                  </p>
                </div>

                <div className="flex items-center justify-center mb-6" dir="ltr">
                  <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="w-40 h-14 rounded-xl border border-[#E7E9EF] text-center text-xl font-black tracking-[0.3em] text-[#162155] outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {modalError && <p className="text-sm font-bold text-red-500 mb-4 text-center">{modalError}</p>}

                <div className="flex items-center gap-4 w-full">
                  <button onClick={() => setModalStep(1)} className="flex-1 py-3 rounded-xl border border-blue-600 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors">
                    {t('profile.back')}
                  </button>
                  <button
                    onClick={handleConfirmCode}
                    disabled={confirmVerification.isPending || code.length !== 6}
                    className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
                  >
                    {t('profile.confirm')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center w-full mb-8 mt-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <Check className="w-6 h-6 text-green-500" strokeWidth={3} />
                  </div>
                  <h3 className="text-[#162155] font-black text-base">{t('profile.changeSuccess')}</h3>
                </div>
                <div className="w-full">
                  <button
                    onClick={() => { closeModal(); toast.success(t('profile.changeSuccess')); }}
                    className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors"
                  >
                    {t('profile.done')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
