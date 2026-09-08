import { useJsApiLoader, type Libraries } from '@react-google-maps/api';

/**
 * MUST be a module-level constant, not an inline literal.
 *
 * `useJsApiLoader` compares its options by reference on every render; a fresh `['places']`
 * array each time reads as "the options changed", which produces the library's
 * "LoadScript has been reloaded unintentionally" warning and, in the worst case, a second
 * script injection.
 */
const LIBRARIES: Libraries = ['places'];

/** Empty when the deployment never configured one — see `isConfigured` below. */
export const GOOGLE_MAPS_API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

export interface GoogleMapsState {
  isLoaded: boolean;
  loadError?: Error;
  /** False when no `VITE_GOOGLE_MAPS_API_KEY` is set: every map must degrade, never hang. */
  isConfigured: boolean;
}

/**
 * The single entry point to the Google Maps JS API for this dashboard.
 *
 * It exists because `useJsApiLoader` is keyed on `id` and will throw
 * ("Loader must not be called again with different options") the moment two callers share
 * an id but disagree on anything else. `CustomGoogleMap` loaded no libraries at all;
 * `LocationPickerMap` needs `places` for its search field. Left as two independent
 * `useJsApiLoader` calls, whichever mounted second would fail — and on a page holding both
 * a tracking map and a picker, WHICH one failed would depend on render order.
 *
 * So the options live here, once. Anything that needs a map calls this hook.
 *
 * `language` is deliberately NOT passed even though the dashboard is bilingual: the loader
 * options are fixed for the lifetime of the page, so a language toggle could not re-issue
 * them anyway, and threading a changing value through here is precisely the reload trap
 * above. Google falls back to the browser locale for map labels.
 */
export function useGoogleMaps(): GoogleMapsState {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  return {
    isLoaded: isLoaded && GOOGLE_MAPS_API_KEY.length > 0,
    loadError,
    isConfigured: GOOGLE_MAPS_API_KEY.length > 0,
  };
}
