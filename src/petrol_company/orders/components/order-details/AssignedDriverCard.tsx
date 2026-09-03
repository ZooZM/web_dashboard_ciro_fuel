import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useOrderDetailContext } from './OrderDetailContext';

// Feature 013 T054/FR-020: the fabricated driver name/rating/plate/tank/ETA are gone.
// Every field below is a real `Order` field, omitted (never invented) when the platform
// has not set it yet (FR-048) — no driver until ASSIGNED_TO_DRIVER, no rating until the
// delivery completes and the client rates it.
export function AssignedDriverCard() {
  const { t } = useTranslation();
  const { order } = useOrderDetailContext();

  if (!order?.driverSummary) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-black text-[#162155] mb-4">{t('orders.assignedDriver')}</h2>
        <p className="text-sm text-slate-400">{t('orders.noDriverYet')}</p>
      </div>
    );
  }

  const { driverSummary, etaMinutes, rating, tankSummary } = order;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      <h2 className="text-xl font-black text-[#162155]">{t('orders.assignedDriver')}</h2>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black shrink-0">
          {driverSummary.fullName.charAt(0)}
        </div>
        <div className="flex flex-col text-right gap-0.5">
          <span className="text-[#162155] font-black text-lg">{driverSummary.fullName}</span>
          <span className="text-slate-500 text-sm font-bold" dir="ltr">{driverSummary.phone}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-4">
        <div className="flex flex-col gap-1.5 text-right">
          <span className="text-slate-400 text-[11px] font-bold">{t('drivers.plateNumber')}</span>
          <span className="text-[#162155] font-black text-sm" dir="ltr">{driverSummary.plateNumber}</span>
        </div>
        {etaMinutes != null && (
          <div className="flex flex-col gap-1.5 text-right">
            <span className="text-slate-400 text-[11px] font-bold">{t('orders.eta')}</span>
            <span className="text-[#162155] font-black text-sm">{etaMinutes} min</span>
          </div>
        )}
        {tankSummary && (
          <div className="flex flex-col gap-1.5 text-right">
            <span className="text-slate-400 text-[11px] font-bold">{t('trucks.tankEntity')}</span>
            <span className="text-[#162155] font-black text-sm" dir="ltr">{tankSummary.code}</span>
          </div>
        )}
      </div>

      {rating && (
        <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-sm font-bold">{t('drivers.rating')}</span>
            <div className="flex items-center gap-1.5" dir="ltr">
              <span className="text-[#162155] font-black text-sm">{rating.score.toFixed(1)}</span>
              <Star className="w-4 h-4 text-orange-500" strokeWidth={2.5} />
            </div>
          </div>
          {rating.review && <p className="text-slate-500 text-sm font-medium">{rating.review}</p>}
        </div>
      )}
    </div>
  );
}
