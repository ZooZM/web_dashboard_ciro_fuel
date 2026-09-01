import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomGoogleMap } from '@/components/ui/CustomGoogleMap';
import { useTracking } from './TrackingContext';

const STALE_THRESHOLD_MS = 60_000; // matches SC-004's 60s bound

/**
 * Feature 009 T052/FR-017/FR-018/SC-004: the platform decides trackability — this card
 * only renders what `useOrderPosition` reports, never a local judgement. Seeds from the
 * order's own `driverLocation` so the map draws before the first live update arrives; once
 * live, position updates without a reload; if updates stop, states staleness with age
 * rather than silently freezing on the last point.
 */
export function TrackingMapCard() {
  const { t } = useTranslation();
  const { selectedOrder, position } = useTracking();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [, forceTick] = useState(0);

  // Re-render every few seconds so the "stale, Ns ago" label keeps counting up.
  useEffect(() => {
    const interval = setInterval(() => forceTick((n) => n + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  if (!selectedOrder) {
    return (
      <div className="w-full h-[400px] md:h-[500px] rounded-2xl border border-slate-200 bg-white flex items-center justify-center">
        <p className="text-sm text-slate-400">{t('tracking.selectDelivery')}</p>
      </div>
    );
  }

  if (position.status === 'not-trackable') {
    return (
      <div className="w-full h-[400px] md:h-[500px] rounded-2xl border border-slate-200 bg-white flex items-center justify-center">
        <p className="text-sm text-amber-600 font-bold">{t('assign.notTrackable')}</p>
      </div>
    );
  }

  const seeded = selectedOrder.driverLocation;
  const center =
    position.status === 'live'
      ? { lat: position.lat, lng: position.lng }
      : seeded
        ? { lat: seeded.lat, lng: seeded.lng }
        : { lat: 24.7136, lng: 46.6753 };

  // spec 011 FR-017a. The original check covered only the LIVE case — a
  // socket that had been delivering and then went quiet. It missed the case
  // that matters most: a socket that never delivered anything at all. There,
  // the map falls back to `seeded` (the order's own last recorded fix) and
  // used to draw it with no marking whatsoever — a position frozen in place,
  // presented exactly as though it were current. A truck whose driver's phone
  // died and a truck parked at that spot rendered identically.
  //
  // Both paths now feed one age, so both are marked. `driverLocationAt` is
  // what the platform recorded for the seeded fix; the live path keeps using
  // its own arrival time, which is more accurate when it applies.
  const seededAgeMs =
    selectedOrder.driverLocationAt !== null && selectedOrder.driverLocationAt !== undefined
      ? Date.now() - new Date(selectedOrder.driverLocationAt).getTime()
      : null;
  const ageMs =
    position.status === 'live' ? Date.now() - position.lastReceivedAt : seededAgeMs;
  const isStale = ageMs !== null && ageMs > STALE_THRESHOLD_MS;
  const staleSeconds = ageMs !== null ? Math.floor(ageMs / 1000) : 0;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
      <CustomGoogleMap
        center={center}
        className="absolute inset-0 w-full h-full object-cover"
        onLoad={(map) => {
          mapRef.current = map;
        }}
        options={{ zoomControl: false }}
      />

      {isStale && (
        <div className="absolute top-4 right-4 bg-amber-50 border border-amber-300 rounded-xl px-4 py-2 shadow-lg">
          <span className="text-amber-700 text-xs font-bold">
            {t('tracking.stalePosition', { seconds: staleSeconds })}
          </span>
        </div>
      )}

      {position.status === 'connecting' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60">
          <span className="text-sm text-slate-500 font-bold">{t('common.loading')}</span>
        </div>
      )}
    </div>
  );
}
