import { Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useOrderDetailContext } from './OrderDetailContext';
import { TankTileIcon, TruckTileIcon } from './VehicleTileIcons';

/**
 * Feature 009 T033/SC-005: real `driverSummary`/`tankSummary` — the fixed rating, fixed
 * driver code and fixed customer review this card showed for every order are gone; there
 * is no per-order customer review on the platform, and rating lives on the driver, not
 * frozen per delivery.
 *
 * Feature 010 T039/FR-016: the acknowledgment/escalation state — three distinct
 * presentations, never collapsed into one another (spec Acceptance Scenario US3.3: once
 * acknowledged, this never reverts to a stale "waiting" state — it reads directly off
 * `assignmentAcknowledgedAt`, which the platform itself only ever sets, never unsets).
 */
function AcknowledgmentStatus() {
  const { t } = useTranslation();
  const { order } = useOrderDetailContext();
  if (!order?.driverSummary) return null;

  if (order.assignmentAcknowledgedAt) {
    return (
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <span className="text-green-700 text-sm font-bold">
          {t('assign.acknowledgment.acknowledgedAt', {
            time: new Date(order.assignmentAcknowledgedAt).toLocaleString(),
          })}
        </span>
      </div>
    );
  }

  if (order.assignmentEscalationSmsAt) {
    return (
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <span className="text-amber-700 text-sm font-bold">
          {t('assign.acknowledgment.smsSentAt', {
            time: new Date(order.assignmentEscalationSmsAt).toLocaleString(),
          })}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
      <span className="text-slate-500 text-sm font-bold">{t('assign.acknowledgment.waiting')}</span>
    </div>
  );
}

export function AssignedDriverCard() {
  const { t } = useTranslation();
  const { order } = useOrderDetailContext();

  if (!order?.driverSummary) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <h2 className="text-xl font-black text-[#162155]">{t('assign.assignedDriver')}</h2>
        <p className="text-sm text-slate-400">{t('assign.noDriverYet')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      <h2 className="text-xl font-black text-[#162155]">{t('assign.assignedDriver')}</h2>

      <div className="flex flex-col text-right gap-0.5">
        <span className="text-[#162155] font-black text-lg">{order.driverSummary.fullName}</span>
        <span className="text-slate-500 text-sm font-bold" dir="ltr">{order.driverSummary.phone}</span>
      </div>

      <AcknowledgmentStatus />

      {order.assignedWhileIneligible && (
        <div className="flex flex-col gap-1 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <span className="text-amber-700 text-xs font-bold">{t('assign.acknowledgment.assignedWhileOffline')}</span>
          {order.assignedWhileIneligibleReason && (
            <span className="text-amber-600 text-sm">{order.assignedWhileIneligibleReason}</span>
          )}
        </div>
      )}

      {order.etaMinutes != null && (
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="flex flex-col gap-1.5 text-right">
            <span className="text-slate-400 text-[11px] font-bold">{t('assign.eta')}</span>
            <span className="text-[#162155] font-black text-sm">{order.etaMinutes} {t('assign.minutes')}</span>
          </div>
        </div>
      )}

      {/* Plate and tank tiles. The design's tank tile read "capacity 20,000 L"; the order's
          tank snapshot carries code and material only (capacity is not snapshotted), so the
          tile shows what the order actually froze at assignment. */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-slate-200 rounded-xl p-3 flex items-center justify-start gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <TruckTileIcon />
          </div>
          <div className="flex flex-col gap-0.5 text-right">
            <span className="text-slate-400 text-[11px] font-bold">{t('trucks.plateNumber')}</span>
            <span className="text-[#162155] font-black text-xs" dir="ltr">{order.driverSummary.plateNumber}</span>
          </div>
        </div>
        {order.tankSummary && (
          <div className="border border-slate-200 rounded-xl p-3 flex items-center justify-start gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <TankTileIcon />
            </div>
            <div className="flex flex-col gap-0.5 text-right">
              <span className="text-slate-400 text-[11px] font-bold">{t('trucks.tankCode')}</span>
              <span className="text-[#162155] font-black text-xs" dir="ltr">{order.tankSummary.code}</span>
              <span className="text-slate-400 text-[10px] font-bold">
                {t(order.tankSummary.material === 'IRON' ? 'trucks.materialIron' : 'trucks.materialAluminium')}
              </span>
            </div>
          </div>
        )}
      </div>

      <a
        href={`tel:${order.driverSummary.phone}`}
        className="w-full border border-slate-200 rounded-xl py-3.5 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
      >
        <Phone className="w-4 h-4 text-blue-600" />
        <span className="text-blue-600 font-bold text-sm">{t('assign.contactDriver')}</span>
      </a>
    </div>
  );
}
