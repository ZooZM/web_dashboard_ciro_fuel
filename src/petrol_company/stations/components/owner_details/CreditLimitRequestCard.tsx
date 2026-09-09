import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { apiErrorMessage } from '@/lib/api/api-error';
import { Plus, Minus, X, Check } from 'lucide-react';
import {
  useCreditLimitRequests,
  useResolveCreditLimitRequest,
} from '@/petrol_company/stations/hooks/useCreditLimitRequests';
import { CreditLimitRequestState } from '@/petrol_company/stations/api/credit-limit-requests.api';

// Feature 013 T078/FR-029/FR-030/FR-031: wired to the real queue. Renders nothing when
// this owner has no PENDING request — there is no "just rejected" transient state on the
// platform to linger on (a resolved request simply drops out of the PENDING filter), and
// no rejection-reason field exists on `CreditLimitRequest`, so the mock's reason textarea
// is dropped along with it.
export function CreditLimitRequestCard({ ownerId }: { ownerId: string }) {
  const { t } = useTranslation();
  const { data: pending } = useCreditLimitRequests(CreditLimitRequestState.PENDING);
  const resolve = useResolveCreditLimitRequest();

  const request = useMemo(() => pending?.find((r) => r.clientId === ownerId), [pending, ownerId]);

  const [mode, setMode] = useState<'idle' | 'accepting'>('idle');
  const [grantedAmount, setGrantedAmount] = useState(0);

  if (!request) return null;

  function openAccepting() {
    setGrantedAmount(request!.requestedAmount);
    setMode('accepting');
  }

  async function handleAccept() {
    try {
      await resolve.mutateAsync({ id: request!._id, input: { accept: true, grantedAmount } });
      toast.success(t('creditLimitRequests.resolveSuccess'));
      setMode('idle');
    } catch (err) {
      toast.error(apiErrorMessage(err, t('errors.generic')));
    }
  }

  async function handleReject() {
    try {
      await resolve.mutateAsync({ id: request!._id, input: { accept: false } });
      toast.success(t('creditLimitRequests.resolveSuccess'));
    } catch (err) {
      toast.error(apiErrorMessage(err, t('errors.generic')));
    }
  }

  return (
    <div className="bg-white border-r-4 border-orange-500 rounded-2xl px-5 py-3 shadow-lg" dir="rtl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-[54px] h-[54px] rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
            <svg width="28" height="28" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.625 33.25H28.5M49.6512 23.75H7.34882M49.6512 23.75C49.2519 19.5857 48.3759 16.4173 47.5 15.8333C46.3125 15.0417 38 14.25 28.5 14.25C19 14.25 10.6875 15.0417 9.5 15.8333C8.62406 16.4173 7.74815 19.5857 7.34882 23.75M49.6512 23.75C49.7933 25.2312 49.875 26.8383 49.875 28.5C49.875 34.8333 48.6875 40.375 47.5 41.1667C46.3125 41.9583 38 42.75 28.5 42.75C19 42.75 10.6875 41.9583 9.5 41.1667C8.3125 40.375 7.125 34.8333 7.125 28.5C7.125 26.8383 7.20678 25.2312 7.34882 23.75" stroke="#FEEEDF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className='flex flex-col gap-2'>
            <span className="font-bold text-slate-900 text-lg">{t('creditLimitRequests.title')}</span>
            <div className="flex items-center justify-start">
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
                <span className="text-xs font-bold text-slate-500">{t('creditLimitRequests.requested')}</span>
                <span className="font-black text-orange-500 text-base" dir="ltr">{request.requestedAmount.toLocaleString()} <span className="text-[10px]">ر.س</span></span>
              </div>
            </div>
          </div>
        </div>

        {mode === 'idle' && (
          <div className='flex flex-col gap-2 shrink-0'>
            <button onClick={openAccepting} className="w-24 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1 hover:bg-blue-700 transition-colors">
              {t('creditLimitRequests.accept')}
              <Check className="w-3 h-3" />
            </button>
            <button onClick={handleReject} disabled={resolve.isPending} className="w-24 py-1.5 rounded-lg bg-white border border-red-200 text-red-500 font-bold text-xs flex items-center justify-center gap-1 hover:bg-red-50 transition-colors disabled:opacity-60">
              {t('creditLimitRequests.reject')}
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {mode === 'accepting' && (
        <div className="bg-[#F8FAFC] border border-[#E7E9EF] rounded-xl p-4 flex flex-col gap-4 mt-4">
          <span className="text-xs font-bold text-slate-400 pr-2">{t('creditLimitRequests.grantedAmount')} — {t('creditLimitRequests.grantedAmountHint')}</span>
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
            <button onClick={() => setGrantedAmount((v) => Math.max(0, v - 5000))} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-slate-100 shrink-0">
              <Minus className="w-4 h-4 text-slate-500" />
            </button>
            <div className="flex flex-col items-center">
              <span className="font-black text-sm text-slate-900 leading-none mt-1">{grantedAmount.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 font-bold mt-1">ر.س</span>
            </div>
            <button onClick={() => setGrantedAmount((v) => v + 5000)} className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center hover:bg-blue-100 shrink-0">
              <Plus className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button onClick={() => setMode('idle')} className="w-32 py-2.5 bg-white border border-red-200 text-red-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
              <X className="w-4 h-4" />
              {t('common.cancel')}
            </button>
            <button onClick={handleAccept} disabled={resolve.isPending} className="w-48 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-60">
              <Check className="w-4 h-4" />
              {t('common.confirm')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
