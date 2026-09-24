import { useTranslation } from 'react-i18next';
import { useOrderDetailContext } from './OrderDetailContext';
import { useResolveStop } from '@/transport_company/orders/hooks/useStopAlert';
import { StopOrigin, stopReasonKey } from '@/constants/stop-events';
import type { StopEvent, Order } from '@/transport_company/orders/types';
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
  const { order, orderId } = useOrderDetailContext();
  const resolve = useResolveStop(orderId);

  if (!order) return null;

  const stops = order.stopEvents ?? [];
  const sorted = [...stops].sort(
    (a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime(),
  );
  if (sorted.length === 0) return null;

  function onResolve(stopId: string): void {
    resolve.mutate(stopId, {
      onError: (error) => toast.error((error as ApiError).message),
    });
  }

  const activeStops = sorted.filter((s) => !s.resolvedAt);
  const resolvedStops = sorted.filter((s) => !!s.resolvedAt);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Active Alerts */}
      {activeStops.map((stop) => (
        <StopRow
          key={stop._id}
          stop={stop}
          order={order}
          onResolve={() => onResolve(stop._id)}
          resolving={resolve.isPending}
        />
      ))}

      {/* Handled Alerts (Small List) */}
      {resolvedStops.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          <h4 className="text-xs font-bold text-slate-500 px-1">تم التعامل معها ({resolvedStops.length})</h4>
          {resolvedStops.map((stop) => (
            <ResolvedStopRow key={stop._id} stop={stop} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(dateString: string): string {
  const diffMs = new Date().getTime() - new Date(dateString).getTime();
  const totalMinutes = Math.max(0, Math.floor(diffMs / 60000));
  
  if (totalMinutes === 0) return 'الآن';
  if (totalMinutes < 60) return `منذ ${totalMinutes} دقيقة`;
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours < 24) {
    return minutes > 0 ? `منذ ${hours} ساعة و ${minutes} دقيقة` : `منذ ${hours} ساعة`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return remainingHours > 0 ? `منذ ${days} يوم و ${remainingHours} ساعة` : `منذ ${days} يوم`;
}

function ResolvedStopRow({ stop, order }: { stop: StopEvent; order: Order }) {
  const timeAgoText = formatTimeAgo(stop.detectedAt);
  const driverName = order.driverSummary?.fullName || 'السائق';

  return (
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200/80 flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-slate-700">توقف تمت معالجته</span>
          <span className="text-[10px] font-semibold text-slate-500">
            السائق {driverName} • {timeAgoText}
          </span>
        </div>
      </div>
      <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500 shadow-sm">
        تم التعامل
      </div>
    </div>
  );
}

function StopRow({
  stop,
  order,
  onResolve,
  resolving,
}: {
  stop: StopEvent;
  order: Order;
  onResolve: () => void;
  resolving: boolean;
}) {
  const { t, i18n } = useTranslation();
  const state = stopState(stop);
  const isResolved = state === 'resolved';

  const timeAgoText = formatTimeAgo(stop.detectedAt);

  const driverName = order.driverSummary?.fullName || 'السائق';
  const plateNumber = order.driverSummary?.plateNumber || 'غير متوفر';
  const driverPhone = order.driverSummary?.phone || 'غير متوفر';

  // Note: Location name and remaining distance are deliberately omitted per PR requirements
  // because the backend only provides coordinates `stop.location`.

  return (
    <div className={`border-2 border-dashed rounded-2xl p-5 flex flex-col gap-4 relative w-full ${isResolved ? 'border-slate-300 bg-slate-50' : 'border-red-400 bg-red-50/50'}`}>
      
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isResolved ? 'bg-slate-400' : 'bg-red-500'}`}>
          <span className="text-white font-bold text-xl leading-none">!</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className={`text-base font-black ${isResolved ? 'text-slate-700' : 'text-[#162155]'}`}>
            أخطار عاجل
          </h3>
          <span className="text-[11px] font-semibold text-slate-500">{timeAgoText}</span>
        </div>
      </div>

      {/* Main Text */}
      <div className="flex flex-col gap-2 mt-1">
        <p className="text-sm font-bold text-[#162155] leading-relaxed">
          توقف السائق <span className="text-red-500 mx-1">{driverName}</span> عن الحركة لأكثر من 10 دقائق أثناء تنفيذ طلب نقل الوقود.
        </p>
        
        {stop.reasonText && (
          <p className="text-xs font-semibold text-slate-600 bg-white/60 p-2 rounded-lg border border-slate-100">
            "{stop.reasonText}"
          </p>
        )}

        <p className="text-[11px] font-bold text-red-400/90">
          قد يحتاج دعماً أو تكون هناك مشكلة في الطريق.
        </p>
      </div>

      {/* Share Location Button (Visual only, as requested) */}
      <button className="flex items-center gap-1.5 text-red-500 font-bold text-[11px] bg-red-50/80 w-fit px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-100 transition-colors mt-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        مشاركة الموقع
      </button>

      {/* Info Details */}
      <div className="flex flex-wrap items-center gap-6 mt-2 pt-4 border-t border-red-200/50 border-dashed">
         <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
           <span>الشاحنة:</span>
           <span className="text-[#162155]">{plateNumber}</span>
         </div>
         <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
           <span>رقم السائق:</span>
           <span className="text-[#162155]" dir="ltr">{driverPhone}</span>
         </div>
      </div>

      {/* Mark Handled Button */}
      {!stop.resolvedAt && (
        <button
          onClick={onResolve}
          disabled={resolving}
          className="mt-3 w-full py-2.5 rounded-xl flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
        >
          <span className="text-xs font-bold text-red-500">تم التعامل مع الأمر</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
      )}
    </div>
  );
}

/**
 * The four states FR-011 requires an administrator to be able to tell apart,
 * plus `resolved`. Derived rather than stored: the platform has no stop
 * status field, and adding one here would be a second source of truth that
 * could disagree with the timestamps it was derived from.
 */
export function stopState(
  stop: StopEvent,
): 'resolved' | 'declared' | 'answered' | 'escalated' | 'waiting' | 'blocked' {
  if (stop.resolvedAt && stop.origin !== StopOrigin.DECLARED) return 'resolved';
  if (stop.origin === StopOrigin.DECLARED) return 'declared';
  if (stop.origin === StopOrigin.BLOCKED) return 'blocked';
  if (stop.reasonGivenAt) return 'answered';
  if (stop.escalatedAt) return 'escalated';
  return 'waiting';
}
