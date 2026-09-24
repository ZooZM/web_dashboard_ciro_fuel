import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTracking } from './TrackingContext';

/**
 * Feature 009 T050/SC-005: the customer/route sample data and fake fare/tank-type figures
 * are gone — real order identity and destination only.
 */
export function TrackingOrderDetails() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { selectedOrder } = useTracking();
  // This page is mounted under /admin, /petrolCompany and /transport; each has its own
  // order-detail route, so the button stays inside the surface it was opened from.
  const basePath = pathname.startsWith('/admin')
    ? '/admin'
    : pathname.startsWith('/petrolCompany')
      ? '/petrolCompany'
      : '/transport';

  if (!selectedOrder) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-slate-400 text-center py-6">{t('tracking.selectDelivery')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4 w-full">
      <div className="flex flex-row-reverse items-start justify-between">
        <button
          onClick={() => navigate(`${basePath}/orders/${selectedOrder._id}`)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shrink-0"
        >
          {t('tracking.viewOrder')}
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[#162155] font-black text-lg" dir="ltr">{selectedOrder._id}</span>
          <span className="text-slate-400 text-xs font-bold">{selectedOrder.deliveryAddressText}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-400 text-[10px] font-bold">{t('orders.fuelType')}</span>
          <span className="text-[#162155] font-black text-sm">{selectedOrder.fuelType}</span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-slate-400 text-[10px] font-bold">{t('trucks.capacity')}</span>
          <span className="text-[#162155] font-black text-sm" dir="ltr">
            {selectedOrder.quantityLiters.toLocaleString()} {t('trucks.liters')}
          </span>
        </div>
        {selectedOrder.etaMinutes != null && (
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-400 text-[10px] font-bold">{t('assign.eta')}</span>
            <span className="text-[#162155] font-black text-sm">{selectedOrder.etaMinutes} {t('assign.minutes')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
