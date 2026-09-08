import { useTranslation } from 'react-i18next';
import { CustomGoogleMap } from '@/components/ui/CustomGoogleMap';
import { LocationAddress } from '@/components/ui/LocationAddress';
import { useAssignment } from './AssignmentContext';

const FALLBACK_CENTER = { lat: 24.7136, lng: 46.6753 };

export function AssignMapCard() {
  const { t } = useTranslation();
  const { order } = useAssignment();
  const center = order?.deliveryLocation
    ? { lat: order.deliveryLocation.coordinates[1], lng: order.deliveryLocation.coordinates[0] }
    : FALLBACK_CENTER;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-[#162155]">{t('assign.destinationMap')}</h2>
      </div>
      <div className="flex-1 w-full rounded-xl overflow-hidden border border-slate-200 relative min-h-[250px]">
        <CustomGoogleMap center={center} className="w-full h-full object-cover" />
      </div>
      {/* Real location only — never the fallback centre. */}
      {order?.deliveryLocation && (
        <LocationAddress value={center} className="text-sm font-bold text-slate-600" />
      )}
    </div>
  );
}
