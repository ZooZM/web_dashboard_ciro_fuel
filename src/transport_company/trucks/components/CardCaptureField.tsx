import { useTranslation } from 'react-i18next';
import { useCardCapture } from '@/transport_company/trucks/hooks/use-card-capture';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CardCaptureFieldProps {
  /** Tie this to the consuming screen's own mount lifecycle (FR-048) — never leave it
   *  permanently true, or a stray read elsewhere can be absorbed here. */
  armed: boolean;
  targetLabel: string;
  onConfirm: (uid: string) => void;
  disabled?: boolean;
}

/**
 * Feature 009 FR-045–051: the shared capture surface used both by `AddTruckForm` (pairing at
 * creation) and `PairCardDialog` (re-pairing an existing truck) — one implementation of the
 * discrimination and confirmation logic, not two.
 */
export function CardCaptureField({ armed, targetLabel, onConfirm, disabled }: CardCaptureFieldProps) {
  const { t } = useTranslation();
  const {
    pendingCapture,
    clearCapture,
    manualDraft,
    setManualDraft,
    submitManual,
    deviceReadAvailable,
    deviceReading,
    deviceError,
    startDeviceRead,
  } = useCardCapture(armed);

  if (pendingCapture) {
    return (
      <div className="bg-blue-50/50 border border-blue-200/60 rounded-xl p-4 flex flex-col gap-3">
        <p className="text-xs font-bold text-blue-700">
          {t('trucks.pairing.captured', { target: targetLabel })}
        </p>
        <p className="text-xs font-mono text-slate-500" dir="ltr">
          {'•'.repeat(Math.max(4, pendingCapture.uid.length - 4))}
          {pendingCapture.uid.slice(-4)}
        </p>
        {pendingCapture.source === 'manual' && (
          <p className="text-[10px] font-bold text-amber-600">{t('trucks.pairing.manualEntry')}</p>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={clearCapture} disabled={disabled}>
            {t('common.cancel')}
          </Button>
          <Button type="button" onClick={() => onConfirm(pendingCapture.uid)} disabled={disabled}>
            {t('trucks.pairing.confirm')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Deliberately NOT an <input>: capture listens at the window level and
          ignores keystrokes landing in an INPUT/TEXTAREA (so the manual field
          below stays typeable). As a focusable input this box swallowed the
          whole scan the moment an operator clicked the one element that looks
          like the thing to click. */}
      <div className="relative">
        <div
          aria-live="polite"
          className="w-full text-center text-xs font-bold text-slate-300 border border-slate-200 rounded-xl py-3.5 px-4 bg-white select-none"
        >
          {t('trucks.pairing.waitingForReader')}
        </div>
        {armed && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
        )}
      </div>

      {deviceReadAvailable && (
        <Button type="button" variant="outline" onClick={() => void startDeviceRead()} disabled={disabled || deviceReading}>
          {deviceReading ? t('trucks.pairing.deviceReading') : t('trucks.pairing.readWithDevice')}
        </Button>
      )}
      {deviceError && <p className="text-xs text-red-600">{t('trucks.pairing.deviceError')}</p>}

      <div className="flex gap-2">
        <Input
          value={manualDraft}
          onChange={(e) => setManualDraft(e.target.value)}
          placeholder={t('trucks.pairing.manualPlaceholder')}
          aria-label={t('trucks.pairing.manualPlaceholder')}
        />
        <Button type="button" variant="outline" onClick={submitManual} disabled={disabled || !manualDraft.trim()}>
          {t('trucks.pairing.useManual')}
        </Button>
      </div>
    </div>
  );
}
