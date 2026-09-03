import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CustomGoogleMap } from '@/components/ui/CustomGoogleMap';
import { useOrderDetailContext } from './OrderDetailContext';
import { isTrackableOrderStatus } from '@/constants/order-status';

const FALLBACK_CENTER = { lat: 24.7136, lng: 46.6753 };

// Feature 013 T055/FR-021: reports the platform's own reason a live position is
// unavailable (mirroring `isTrackableOrderStatus`, the same rule `order:watch` enforces
// server-side) rather than judging trackability locally — a status this dashboard
// doesn't recognise renders the "not trackable" state, never a stale map.
export function MapCard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { order } = useOrderDetailContext();

  const trackable = order ? isTrackableOrderStatus(order.status) : false;
  const center = order?.deliveryLocation
    ? { lat: order.deliveryLocation.coordinates[1], lng: order.deliveryLocation.coordinates[0] }
    : FALLBACK_CENTER;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <img src="/transportCompany/orderPage/orderDetails/pin.svg" alt="" className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-black text-[#162155]">{t('clients.stationLocation')}</h2>
      </div>
      <div className="w-full h-[180px] bg-slate-100 rounded-xl mb-4 relative overflow-hidden border border-slate-200">
        <CustomGoogleMap center={center} className="w-full h-full object-cover opacity-60" />
      </div>
      {trackable ? (
        <button
          onClick={() => navigate('/petrolCompany/tracking')}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <img src="/transportCompany/orderPage/orderDetails/buttonMap.svg" alt="" className="w-5 h-5" />
          {t('orders.trackTruck')}
        </button>
      ) : (
        <p className="text-center text-xs text-slate-400 font-semibold py-2">{t('orders.notTrackable')}</p>
      )}
    </div>
  );
}
