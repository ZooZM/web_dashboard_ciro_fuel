import { useTranslation } from 'react-i18next';
import { useReverseGeocode } from '@/lib/maps/useReverseGeocode';
import type { LatLng } from '@/lib/maps/maps-url';

export interface LocationAddressProps {
  value: LatLng | null;
  /** Rendered when nothing is chosen at all. */
  emptyLabel?: string;
  className?: string;
}

function formatCoordinates({ lat, lng }: LatLng): string {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

/**
 * The single place a stored coordinate is turned into something a person reads.
 *
 * Every screen that used to print `24.72171, 46.68990` uses this instead. Coordinates are
 * still the stored value and are still reachable — they are the element's `title`, so
 * hovering recovers the exact point — but they are no longer what an operator has to
 * interpret to know where a delivery is going.
 *
 * While the lookup is in flight, and whenever it fails (no Geocoding API on the key, over
 * quota, a point in open desert with no address at all), this falls back to the
 * coordinates rather than to a blank or a spinner. That keeps the field truthful in the
 * one state where a friendly label would be a lie, and means a deployment that never
 * enables Geocoding degrades to exactly the previous behaviour instead of breaking.
 */
export function LocationAddress({ value, emptyLabel, className = '' }: LocationAddressProps) {
  const { t } = useTranslation();
  const { address, isLoading } = useReverseGeocode(value);

  if (!value) {
    return (
      <span className={`text-slate-400 ${className}`}>{emptyLabel ?? t('map.noLocationChosen')}</span>
    );
  }

  const coordinates = formatCoordinates(value);

  if (address) {
    return (
      <span className={className} title={coordinates}>
        {address}
      </span>
    );
  }

  return (
    <span className={className} title={coordinates}>
      <span dir="ltr" className="font-mono">
        {coordinates}
      </span>
      {isLoading && <span className="ms-2 text-slate-400">{t('map.resolvingAddress')}</span>}
    </span>
  );
}
