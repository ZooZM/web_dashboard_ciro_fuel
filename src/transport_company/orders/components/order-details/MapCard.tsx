import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CustomGoogleMap } from '@/components/ui/CustomGoogleMap';
import { LocationAddress } from '@/components/ui/LocationAddress';
import { useOrderDetailContext } from './OrderDetailContext';
import { isTrackableOrderStatus } from '@/constants/order-status';

const FALLBACK_CENTER = { lat: 24.7136, lng: 46.6753 };

/**
 * Feature 009 T050: "Track the truck" is offered only while the platform considers this
 * delivery trackable (IN_TRANSIT/UNLOADING) — the same rule `order:watch` enforces
 * server-side (FR-017). This card never judges trackability itself.
 */
export function MapCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { orderId, order } = useOrderDetailContext();
  if (!order) return null;

  const center = order.deliveryLocation
    ? { lat: order.deliveryLocation.coordinates[1], lng: order.deliveryLocation.coordinates[0] }
    : FALLBACK_CENTER;
  const trackable = isTrackableOrderStatus(order.status);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-black text-[#162155]">{t('assign.destinationMap')}</h2>
      </div>
      <div className="w-full h-[180px] bg-slate-100 rounded-xl mb-4 relative overflow-hidden border border-slate-200">
        <CustomGoogleMap center={center} className="w-full h-full object-cover" />
      </div>
      {/* Real location only — never the fallback centre (see the petrol_company twin). */}
      {order.deliveryLocation && (
        <LocationAddress value={center} className="mb-4 text-sm font-bold text-slate-600" />
      )}
      <button
        onClick={() => navigate(`/transport/tracking?orderId=${orderId}`)}
        disabled={!trackable}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {trackable ? t('assign.trackTruck') : t('assign.notTrackable')}
      </button>
    </div>
  );
}
