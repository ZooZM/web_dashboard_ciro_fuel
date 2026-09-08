import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGoogleMaps } from '@/components/ui/useGoogleMaps';
import type { LatLng } from './maps-url';

/**
 * Process-wide, deliberately unbounded for a session: the same handful of stations and
 * depots are looked at over and over, an address for a fixed point does not change while
 * the tab is open, and each miss costs a billed Geocoding request.
 */
const addressCache = new Map<string, string>();

/** ~1.1 m. Finer than any pin a person places by hand, so it dedupes without ever merging
 *  two points a user could tell apart. */
const CACHE_PRECISION = 5;

/** Long enough that a continuous drag issues ONE request at rest, not one per `onIdle`. */
const DEBOUNCE_MS = 400;

function cacheKey(value: LatLng, language: string): string {
  return `${language}:${value.lat.toFixed(CACHE_PRECISION)},${value.lng.toFixed(CACHE_PRECISION)}`;
}

export interface ReverseGeocodeState {
  /** The formatted address, or null while pending / when it could not be resolved. */
  address: string | null;
  isLoading: boolean;
}

/**
 * Turns a coordinate into a human-readable address.
 *
 * The coordinate remains the stored value everywhere — this is a DISPLAY concern only. An
 * address is what an operator recognises; the numbers underneath are what the platform
 * routes on, and every caller keeps them reachable (a `title`, or a field beside it) so a
 * geocoder that names the wrong building cannot quietly become the record.
 *
 * The effect keys on the ROUNDED COORDINATE STRING, never on the `value` object. Callers
 * routinely derive their value inline — `parseLatLngFromUrl(locationUrl)` builds a fresh
 * object on every render — so an object identity in the dependency list would re-fire the
 * effect forever and bill a Geocoding request each pass.
 *
 * Needs the **Geocoding API** enabled on the key, which is a third product alongside Maps
 * JavaScript and Places. Without it every lookup rejects and callers fall back to showing
 * coordinates, which is why that fallback is not decorative.
 */
export function useReverseGeocode(value: LatLng | null): ReverseGeocodeState {
  const { i18n } = useTranslation();
  const { isLoaded } = useGoogleMaps();
  const language = i18n.language.startsWith('ar') ? 'ar' : 'en';

  const key = value ? cacheKey(value, language) : null;
  const [address, setAddress] = useState<string | null>(() => (key ? addressCache.get(key) ?? null : null));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!value || !key) {
      setAddress(null);
      setIsLoading(false);
      return;
    }

    const cached = addressCache.get(key);
    if (cached) {
      setAddress(cached);
      setIsLoading(false);
      return;
    }

    if (!isLoaded) {
      setAddress(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    const timer = setTimeout(() => {
      new google.maps.Geocoder()
        .geocode({ location: value, language })
        .then((response) => {
          const formatted = response.results[0]?.formatted_address ?? null;
          if (formatted) addressCache.set(key, formatted);
          if (!cancelled) {
            setAddress(formatted);
            setIsLoading(false);
          }
        })
        .catch(() => {
          // No Geocoding API, over quota, or no result. The caller shows coordinates.
          if (!cancelled) {
            setAddress(null);
            setIsLoading(false);
          }
        });
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // `value` is intentionally absent — `key` is its stable string projection. See above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, isLoaded, language]);

  return { address, isLoading };
}
