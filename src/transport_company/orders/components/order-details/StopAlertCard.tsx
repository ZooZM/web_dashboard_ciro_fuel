import { useTranslation } from 'react-i18next';
import { useOrderDetailContext } from './OrderDetailContext';
import { useResolveStop } from '@/transport_company/orders/hooks/useStopAlert';
import { StopOrigin, stopReasonKey } from '@/constants/stop-events';
import type { StopEvent } from '@/transport_company/orders/types';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast/toast';
import type { ApiError } from '@/lib/api/api-error';

/**
 * spec 011 US4 (FR-011, FR-012, FR-013): what the transport administrator
 * sees when a delivery stopped moving.
 *
 * **Two things the deleted mock showed are deliberately absent**: "remaining
 * distance" and a street-name location. Neither has a data source — the
 * platform records the stop's coordinates and nothing else, and inventing a
 * plausible-looking distance next to a real alert is worse than omitting it,
 * because an administrator would act on it. The point is rendered on the
 * existing map instead (contracts/dashboard-integration.md §1), which is the
 * one honest way to answer "where".
 *
 * **FR-013: no alert, no card.** Not an empty state, not a "no alerts"
 * placeholder — nothing at all. A permanent reassuring panel is exactly what
 * makes a real alert easy to miss.
 */
export function StopAlertCard() {
  const { t } = useTranslation();
  const { order, orderId } = useOrderDetailContext();
  const resolve = useResolveStop(orderId);

  if (!order) return null;

  const stops = order.stopEvents ?? [];
  // Newest first: an administrator opening this wants the current situation,
  // not the first thing that happened on the journey.
  const sorted = [...stops].sort(
    (a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime(),
  );
  if (sorted.length === 0) return null;

  function onResolve(stopId: string): void {
    resolve.mutate(stopId, {
      onError: (error) => toast.error((error as ApiError).message),
    });
  }

  const hasOpen = sorted.some((s) => !s.resolvedAt);

  return (
    <div
      className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col gap-4 ${
        hasOpen ? 'border-amber-300' : 'border-slate-200'
      }`}
    >
      <h2 className="text-xl font-black text-[#162155]">{t('stopAlert.title')}</h2>
      {sorted.map((stop) => (
        <StopRow
          key={stop._id}
          stop={stop}
          onResolve={() => onResolve(stop._id)}
          resolving={resolve.isPending}
        />
      ))}
    </div>
  );
}

function StopRow({
  stop,
  onResolve,
  resolving,
}: {
  stop: StopEvent;
  onResolve: () => void;
  resolving: boolean;
}) {
  const { t, i18n } = useTranslation();
  const state = stopState(stop);

  const tone = {
    resolved: 'border-slate-200 bg-slate-50',
    declared: 'border-slate-200 bg-white',
    answered: 'border-slate-200 bg-white',
    escalated: 'border-red-300 bg-red-50',
    waiting: 'border-amber-300 bg-amber-50',
    // feature 013 US5a: a call for help, already escalated — read as
    // urgently as a stop that went unanswered, never as merely pending.
    blocked: 'border-red-300 bg-red-50',
  }[state];

  return (
    <div className={`border rounded-xl p-4 flex flex-col gap-2 ${tone}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-slate-800">{t(`stopAlert.state.${state}`)}</span>
        <span className="text-xs text-slate-500">
          {new Date(stop.detectedAt).toLocaleString(i18n.language)}
        </span>
      </div>

      {stop.origin === StopOrigin.DECLARED && stop.expectedDurationMinutes !== null && (
        <span className="text-xs text-slate-600">
          {t('stopAlert.expectedDuration', { minutes: stop.expectedDurationMinutes })}
        </span>
      )}

      {stop.reason && (
        <div className="flex flex-col gap-1">
          <span className="text-sm text-slate-800">{t(stopReasonKey(stop.reason))}</span>
          {/* US4.2: the driver's OWN words, verbatim. A generic "the driver
              gave a reason" would discard the only part an administrator
              can actually act on. */}
          {stop.reasonText && (
            <p className="text-sm text-slate-600 italic break-words">“{stop.reasonText}”</p>
          )}
        </div>
      )}

      {state === 'escalated' && (
        <span className="text-sm text-red-700">{t('stopAlert.noResponse')}</span>
      )}

      {/* feature 013 US5a: the driver asked for help — distinct from
          "asked and said nothing" (escalated) and from "said in advance"
          (declared). The driver's reason is rendered by the block above. */}
      {state === 'blocked' && (
        <span className="text-sm text-red-700">{t('stopAlert.driverBlocked')}</span>
      )}

      {!stop.resolvedAt && (
        <Button onClick={onResolve} disabled={resolving} className="self-start mt-1">
          {t('stopAlert.markHandled')}
        </Button>
      )}
    </div>
  );
}

/**
 * The four states FR-011 requires an administrator to be able to tell apart,
 * plus `resolved`. Derived rather than stored: the platform has no stop
 * status field, and adding one here would be a second source of truth that
 * could disagree with the timestamps it was derived from.
 *
 * Order matters. `resolved` is checked first because a handled stop is
 * handled whatever else happened to it; `declared` before `answered` because
 * a declaration is answered by construction and the distinction the
 * administrator cares about is that the driver volunteered it (FR-008c);
 * `escalated` before `waiting` because an escalated stop is still unanswered
 * and would otherwise read as merely pending.
 */
export function stopState(
  stop: StopEvent,
): 'resolved' | 'declared' | 'answered' | 'escalated' | 'waiting' | 'blocked' {
  if (stop.resolvedAt && stop.origin !== StopOrigin.DECLARED) return 'resolved';
  if (stop.origin === StopOrigin.DECLARED) return 'declared';
  // feature 013 US5a: checked before `answered`/`escalated` — a blocked
  // report arrives with `reasonGivenAt` AND `escalatedAt` both set, so it
  // would otherwise read as an ordinary answered stop and lose the
  // distinguishability FR-039a requires.
  if (stop.origin === StopOrigin.BLOCKED) return 'blocked';
  if (stop.reasonGivenAt) return 'answered';
  if (stop.escalatedAt) return 'escalated';
  return 'waiting';
}
