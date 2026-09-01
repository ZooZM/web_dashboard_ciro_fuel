import { Check, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAssignment } from './AssignmentContext';

/**
 * Feature 009 T034-T037/FR-002/FR-004/FR-005: shows the operator's actual, live selection
 * — no hardcoded driver/truck/tank — and surfaces the specific refusal reason when the
 * platform rejects an attempt (FR-005), rather than a generic failure.
 */
export function AssignSelectionCard() {
  const { t } = useTranslation();
  const {
    candidates,
    trucks,
    tanks,
    selectedDriverId,
    selectedTruckId,
    selectedTankId,
    reason,
    setReason,
    reasonRequired,
    refusal,
    isConfirming,
    confirm,
  } = useAssignment();

  const driver = candidates.find((c) => c._id === selectedDriverId);
  const truck = trucks.find((t2) => t2.id === selectedTruckId);
  const tank = tanks.find((t2) => t2.id === selectedTankId);

  const canConfirm =
    Boolean(selectedDriverId && selectedTruckId && selectedTankId) &&
    (!reasonRequired || reason.trim().length > 0) &&
    !isConfirming;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col flex-1 items-start gap-3 w-full">
          <div className="flex items-center flex-wrap justify-start gap-3 w-full">
            <div
              className={
                driver
                  ? 'flex items-center justify-between gap-4 bg-[#EEF2FF] border border-blue-400 rounded-xl px-4 py-3 min-w-[160px]'
                  : 'flex items-center justify-between gap-4 bg-white border border-slate-300 border-dashed rounded-xl px-4 py-3 min-w-[160px]'
              }
            >
              <span className="text-[#162155] font-black text-sm">{driver?.fullName ?? t('assign.notSelected')}</span>
            </div>

            <div
              className={
                truck
                  ? 'flex items-center justify-between gap-4 bg-[#EEF2FF] border border-blue-400 rounded-xl px-4 py-3 min-w-[140px]'
                  : 'flex items-center justify-between gap-4 bg-white border border-slate-300 border-dashed rounded-xl px-4 py-3 min-w-[140px]'
              }
            >
              <span className="text-[#162155] font-black text-sm" dir="ltr">
                {truck?.plateNumber ?? t('assign.notSelected')}
              </span>
            </div>

            <div
              className={
                tank
                  ? 'flex items-center justify-between gap-4 bg-[#EEF2FF] border border-blue-400 rounded-xl px-4 py-3 min-w-[140px]'
                  : 'flex items-center justify-between gap-4 bg-white border border-slate-300 border-dashed rounded-xl px-4 py-3 min-w-[140px]'
              }
            >
              <span className="text-[#162155] font-black text-sm" dir="ltr">
                {tank?.code ?? t('assign.notSelected')}
              </span>
            </div>
          </div>

          <span className="text-slate-400 text-xs font-semibold text-right w-full mt-1">{t('assign.selectionHint')}</span>

          {reasonRequired && (
            <div className="w-full flex flex-col gap-1 mt-2">
              <label className="text-xs font-bold text-amber-700">{t('assign.offlineReasonLabel')}</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t('assign.offlineReasonPlaceholder')}
                rows={2}
                className="w-full border border-amber-300 bg-amber-50/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          )}
        </div>

        <div className="shrink-0">
          <button
            onClick={confirm}
            disabled={!canConfirm}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>{isConfirming ? t('common.loading') : t('assign.confirm')}</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>

      {refusal && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <span className="text-red-700 text-sm font-semibold">{refusal}</span>
        </div>
      )}
    </div>
  );
}
