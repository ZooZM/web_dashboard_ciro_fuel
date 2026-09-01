import { useTranslation } from 'react-i18next';
import { useTracking } from './TrackingContext';

/**
 * Feature 009 T051/SC-005: real `driverSummary`/`tankSummary` from the selected delivery —
 * a fixed name, rating and vehicle no longer render for every order.
 */
export function TrackingDriverCard() {
  const { t } = useTranslation();
  const { selectedOrder } = useTracking();
  if (!selectedOrder?.driverSummary) return null;

  return (
    <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between w-full lg:col-span-2">
        <span className="text-[#162155] font-bold text-lg">{selectedOrder.driverSummary.fullName}</span>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-400 text-sm font-medium">{t('companies.adminPhone')}</span>
          <span className="text-[#162155] font-bold text-base" dir="ltr">{selectedOrder.driverSummary.phone}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-center w-full lg:col-span-1">
        <div className="flex flex-col items-center gap-1">
          <span className="text-slate-400 text-sm font-medium">{t('trucks.plateNumber')}</span>
          <span className="text-[#162155] font-bold text-base" dir="ltr">{selectedOrder.driverSummary.plateNumber}</span>
        </div>
      </div>

      {selectedOrder.tankSummary && (
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-center w-full lg:col-span-1">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[#162155] text-sm font-normal" dir="ltr">{selectedOrder.tankSummary.code}</span>
          </div>
        </div>
      )}
    </div>
  );
}
