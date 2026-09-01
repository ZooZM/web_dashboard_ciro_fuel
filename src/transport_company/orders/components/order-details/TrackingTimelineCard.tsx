import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useOrderDetailContext } from './OrderDetailContext';
import { orderStatusLabelKey } from '@/constants/order-status';

/**
 * Feature 009 T033/FR-012/FR-013/SC-005: every entry comes from the order's real
 * `statusHistory` — the nine-step horizontal tracker and its fabricated "توقف في الطريق"
 * (driver stopped) entry are gone; nothing here is invented. An overridden departure
 * is labelled as overridden, never as a genuine verification (FR-013) — read directly
 * from `manualOverride`/`overrideReason`, never inferred.
 */
export function TrackingTimelineCard() {
  const { t } = useTranslation();
  const { order } = useOrderDetailContext();
  if (!order) return null;

  const history = [...order.statusHistory].reverse();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-xl font-black text-[#162155]">{t('assign.timeline')}</h2>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">{t('assign.noHistory')}</p>
      ) : (
        <div className="flex flex-col relative w-full pb-4">
          <div className="absolute right-[11px] top-6 bottom-6 w-px border-r border-dashed border-slate-300 z-0" />

          {history.map((entry, idx) => {
            const date = new Date(entry.at);
            return (
              <div key={idx} className="flex justify-between items-center w-full py-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white shrink-0 shadow-sm relative z-10',
                      entry.manualOverride ? 'border-amber-400' : 'border-[#22C55E]',
                    )}
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1.5 4L4 6.5L8.5 1.5"
                        stroke={entry.manualOverride ? '#F59E0B' : '#22C55E'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className={cn('text-xs font-bold', entry.manualOverride ? 'text-amber-600' : 'text-[#22C55E]')}>
                      {t(orderStatusLabelKey(entry.to))}
                    </span>
                    {entry.manualOverride && (
                      <span className="text-[10px] font-bold text-amber-500">
                        {t('assign.overridden')}{entry.overrideReason ? ` — ${entry.overrideReason}` : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-500">
                  <span className="text-[11px] font-bold tracking-wider" dir="ltr">
                    {date.toLocaleDateString()}
                  </span>
                  <span className="text-[11px] font-bold tracking-wider" dir="ltr">
                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
