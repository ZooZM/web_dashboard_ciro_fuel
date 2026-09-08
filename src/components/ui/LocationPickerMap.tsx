import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Autocomplete, GoogleMap } from '@react-google-maps/api';
import { Skeleton } from './skeleton';
import { useGoogleMaps } from './useGoogleMaps';
import { LocationAddress } from './LocationAddress';
import { DEFAULT_MAP_CENTER, isValidLatLng, type LatLng } from '@/lib/maps/maps-url';

export interface LocationPickerMapProps {
  /** The chosen point, or null for "nothing picked yet". Fully controlled. */
  value: LatLng | null;
  onChange: (next: LatLng | null) => void;
  /** Map height in CSS units. */
  height?: string;
  /** ISO 3166-1 alpha-2 code(s) the place search is confined to. */
  countryRestriction?: string | string[];
  className?: string;
}

const DEFAULT_ZOOM = 11;
const PICKED_ZOOM = 16;

/**
 * The core map picker: a full map with a fixed centre pin and a place-search field.
 *
 * It speaks COORDINATES, not any caller's storage format. The fuel-exchange offer stores a
 * Maps URL and the station forms store `latitude`/`longitude` numbers; both convert at
 * their own edge (`@/lib/maps/maps-url`) so neither inherits the other's shape.
 *
 * The pin is a CSS overlay at the map's centre, NOT a `<Marker>`. A marker has to be
 * dragged separately from the map, so "the marker" and "what you are looking at" can
 * disagree — and on a phone the finger doing the dragging covers it. A fixed pin makes the
 * map itself the control: whatever is under the pin is the answer, and the whole viewport
 * is the drag target.
 *
 * A value is emitted only AFTER a deliberate interaction (drag, search, or "my location").
 * Committing on the first `onIdle` would silently stamp every form that ever opened this
 * map with the default centre — indistinguishable, downstream, from a real choice.
 */
export function LocationPickerMap({
  value,
  onChange,
  height = '340px',
  countryRestriction = 'sa',
  className = '',
}: LocationPickerMapProps) {
  const { t } = useTranslation();
  const { isLoaded, loadError, isConfigured } = useGoogleMaps();

  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const hasInteractedRef = useRef(false);
  const [geolocationError, setGeolocationError] = useState(false);

  // Read once. The map is driven imperatively (`panTo`) from here on: a `center` prop that
  // changed as the operator drags would fight the drag, snapping the map back to the last
  // committed value mid-gesture.
  const initial = useMemo(
    () => ({
      center: value ?? DEFAULT_MAP_CENTER,
      zoom: value ? PICKED_ZOOM : DEFAULT_ZOOM,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const mapContainerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);

  const commitCentre = useCallback(() => {
    if (!hasInteractedRef.current) return;
    const centre = mapRef.current?.getCenter();
    if (!centre) return;
    onChange({ lat: centre.lat(), lng: centre.lng() });
  }, [onChange]);

  const moveTo = useCallback(
    (next: LatLng, zoom = PICKED_ZOOM) => {
      hasInteractedRef.current = true;
      mapRef.current?.panTo(next);
      mapRef.current?.setZoom(zoom);
      // Set eagerly rather than waiting for `onIdle`: `panTo` animates, and the readout
      // should not lag the pin by the length of that animation.
      onChange(next);
    },
    [onChange],
  );

  const handlePlaceChanged = useCallback(() => {
    const location = autocompleteRef.current?.getPlace()?.geometry?.location;
    if (!location) return;
    moveTo({ lat: location.lat(), lng: location.lng() });
  }, [moveTo]);

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeolocationError(true);
      return;
    }
    setGeolocationError(false);
    navigator.geolocation.getCurrentPosition(
      (position) => moveTo({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => setGeolocationError(true),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }, [moveTo]);

  const handleManualCoordinate = useCallback(
    (axis: 'lat' | 'lng', raw: string) => {
      const parsed = Number(raw);
      const next = { lat: value?.lat ?? 0, lng: value?.lng ?? 0, [axis]: parsed } as LatLng;
      onChange(isValidLatLng(next) ? next : null);
    },
    [onChange, value],
  );

  // No key configured, or the API failed to load. The field must still be usable, and the
  // honest fallback for a coordinate picker is coordinate entry — NOT a dead map frame and
  // not a silently unfillable field.
  if (!isConfigured || loadError) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            inputMode="decimal"
            value={value?.lat ?? ''}
            onChange={(e) => handleManualCoordinate('lat', e.target.value)}
            placeholder={t('map.latitude')}
            dir="ltr"
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 text-left"
          />
          <input
            type="text"
            inputMode="decimal"
            value={value?.lng ?? ''}
            onChange={(e) => handleManualCoordinate('lng', e.target.value)}
            placeholder={t('map.longitude')}
            dir="ltr"
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 text-left"
          />
        </div>
        <span className="text-xs font-bold text-amber-600">{t('map.unavailable')}</span>
      </div>
    );
  }

  if (!isLoaded) {
    return <Skeleton className={`w-full rounded-xl ${className}`} style={{ height }} />;
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Autocomplete
        onLoad={(instance) => {
          autocompleteRef.current = instance;
          instance.setFields(['geometry.location', 'name', 'formatted_address']);
        }}
        onPlaceChanged={handlePlaceChanged}
        options={{ componentRestrictions: { country: countryRestriction } }}
      >
        <input
          type="text"
          placeholder={t('map.searchPlace')}
          // Enter inside a Places field means "accept the highlighted suggestion", never
          // "submit whatever encloses me".
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900"
        />
      </Autocomplete>

      <div className="relative rounded-xl overflow-hidden border border-slate-200" style={{ height }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={initial.center}
          zoom={initial.zoom}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onUnmount={() => {
            mapRef.current = null;
          }}
          onDragStart={() => {
            hasInteractedRef.current = true;
          }}
          onIdle={commitCentre}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            gestureHandling: 'greedy',
            clickableIcons: false,
          }}
        />

        {/* `-100%` on Y puts the pin's TIP — not its centre — on the map's centre point,
            which is the pixel Google reports from `getCenter()`. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-10"
          style={{ transform: 'translate(-50%, -100%)' }}
        >
          <svg width="34" height="46" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17 0C7.6 0 0 7.6 0 17c0 12.2 15.3 27.6 16 28.3.6.6 1.5.6 2 0 .7-.7 16-16.1 16-28.3C34 7.6 26.4 0 17 0z"
              fill="#2563EB"
            />
            <circle cx="17" cy="17" r="6.5" fill="#fff" />
          </svg>
        </div>

        {/* A dot on the exact centre pixel, under the pin's tip: the pin body is 34px wide
            and it should be unambiguous which point is being reported. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/40"
        />

        <button
          type="button"
          onClick={handleUseMyLocation}
          className="absolute bottom-3 left-3 z-10 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white"
        >
          {t('map.useMyLocation')}
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-400">{t('map.centerHint')}</span>
        {value && <LocationAddress value={value} className="text-xs font-bold text-slate-700" />}
      </div>

      {geolocationError && (
        <span className="text-xs font-bold text-amber-600">{t('map.geolocationDenied')}</span>
      )}
    </div>
  );
}
