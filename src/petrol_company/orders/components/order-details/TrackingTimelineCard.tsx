import { useTranslation } from 'react-i18next';
import { useOrderDetailContext } from './OrderDetailContext';
import { orderStatusLabelKey } from '@/constants/order-status';

// Feature 013 T054/FR-020: the fabricated 9-step horizontal tracker and fake dated
// vertical timeline are gone — neither corresponds to any real platform data. Wired to
// `order.statusHistory`, the real transition log every order carries, oldest first.
export function TrackingTimelineCard() {
  const { t } = useTranslation();
  const { order } = useOrderDetailContext();

  if (!order) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <img src="/transportCompany/orderPage/orderDetails/rightCheck.svg" alt="" className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-black text-[#162155]">
          {t('orders.timeline')}
        </h2>
      </div>

      {order.statusHistory.length === 0 ? (
        <p className="text-sm text-slate-400">{t('orders.empty')}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {[...order.statusHistory].reverse().map((event, idx) => (
            <div key={`${event.at}-${idx}`} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div className="flex flex-col text-right flex-1">
                <span className="text-[#162155] font-black text-sm">
                  {t(orderStatusLabelKey(event.from))} → {t(orderStatusLabelKey(event.to))}
                </span>
                <span className="text-slate-400 text-xs font-semibold">
                  {new Date(event.at).toLocaleString()}
                </span>
                {event.manualOverride && (
                  <span className="text-amber-600 text-xs font-bold mt-1">
                    {t('orders.overridden')}
                    {event.overrideReason ? `: ${event.overrideReason}` : ''}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
