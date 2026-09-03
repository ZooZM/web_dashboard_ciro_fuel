import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useLitreBalancesList, useRecordLitreCorrection } from '@/petrol_company/litre_balances/hooks/useLitreBalances';
import { FUEL_TYPE_LABEL_KEY } from '@/constants/order-status';
import { ApiError } from '@/lib/api/api-error';

interface DueLitersBalanceCardProps {
  ownerId: string;
}

// Feature 013 T207/FR-073/FR-074/FR-075/FR-076/FR-077: wired to `GET
// /litre-balances?clientId=` — every grade this owner has a balance for is shown
// (FR-077's "grades the company stopped selling stay visible" is automatic here: a
// balance only ever exists for a grade that was sold at least once, so there is nothing
// to filter). Every correction MUST carry a reason (FR-075) — the control refuses to
// submit without one, mirroring the backend's own `BALANCE_CORRECTION_REASON_REQUIRED`.
export function DueLitersBalanceCard({ ownerId }: DueLitersBalanceCardProps) {
  const { t } = useTranslation();
  const { data: balances, isLoading, isError, refetch } = useLitreBalancesList(ownerId);
  const correction = useRecordLitreCorrection();
  const [correctingId, setCorrectingId] = useState<string | null>(null);
  const [litres, setLitres] = useState('');
  const [reason, setReason] = useState('');

  async function handleSubmitCorrection() {
    if (!correctingId) return;
    const litresValue = Number(litres);
    if (!Number.isFinite(litresValue) || litresValue === 0 || !reason.trim()) {
      toast.error(t('litreBalances.correctionIncomplete'));
      return;
    }
    try {
      await correction.mutateAsync({ balanceId: correctingId, litres: litresValue, reason: reason.trim() });
      toast.success(t('litreBalances.correctionApplied'));
      setCorrectingId(null);
      setLitres('');
      setReason('');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <h2 className="text-lg font-black text-[#162155]">{t('litreBalances.title')}</h2>

      {isLoading ? (
        <p className="text-sm text-slate-400">{t('common.loading')}</p>
      ) : isError ? (
        <div className="flex flex-col items-center gap-2 py-4">
          <p className="text-sm text-red-500">{t('litreBalances.loadError')}</p>
          <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
            {t('common.retry')}
          </button>
        </div>
      ) : !balances || balances.length === 0 ? (
        <p className="text-sm text-slate-400">{t('litreBalances.empty')}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {balances.map((b) => (
            <div key={b._id} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400">{t(FUEL_TYPE_LABEL_KEY[b.fuelType])}</span>
                <span className="text-lg font-black text-[#162155]">
                  {b.balanceLitres.toLocaleString()} <span className="text-xs font-bold text-slate-500">L</span>
                </span>
              </div>
              <button
                onClick={() => setCorrectingId(b._id)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                {t('litreBalances.correct')}
              </button>
            </div>
          ))}
        </div>
      )}

      {correctingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-[360px] p-5 flex flex-col gap-4" dir="rtl">
            <h3 className="text-base font-black text-[#162155]">{t('litreBalances.correctTitle')}</h3>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-500">{t('litreBalances.correctionAmount')}</label>
              <input
                type="number"
                value={litres}
                onChange={(e) => setLitres(e.target.value)}
                placeholder={t('litreBalances.correctionAmountHint')}
                className="border border-slate-200 rounded-xl p-2.5 text-sm font-bold"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-500">{t('litreBalances.correctionReason')}</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="border border-slate-200 rounded-xl p-2.5 text-sm font-bold resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => void handleSubmitCorrection()}
                disabled={correction.isPending}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-bold"
              >
                {correction.isPending ? t('common.loading') : t('common.confirm')}
              </button>
              <button
                onClick={() => {
                  setCorrectingId(null);
                  setLitres('');
                  setReason('');
                }}
                disabled={correction.isPending}
                className="bg-white border border-slate-200 text-slate-700 rounded-xl py-2.5 text-sm font-bold"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
