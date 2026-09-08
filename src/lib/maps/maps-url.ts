export interface LatLng {
  lat: number;
  lng: number;
}

/** Riyadh — the platform's centre of gravity, used only until something is picked. */
export const DEFAULT_MAP_CENTER: LatLng = { lat: 24.7136, lng: 46.6753 };

export function isValidLatLng(value: unknown): value is LatLng {
  if (!value || typeof value !== 'object') return false;
  const { lat, lng } = value as Partial<LatLng>;
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * These two live OUTSIDE the map component on purpose.
 *
 * A location is a coordinate pair; a URL is one particular way to carry one, and only the
 * fuel-exchange offer needs that carrier — its `locationUrl` is
 * `@IsUrl({ protocols: ['http', 'https'] })` on the platform (FR-028), so widening it to a
 * coordinate field would be a wire-contract change across two repositories. The station
 * forms, by contrast, store real `latitude`/`longitude` numbers and want nothing to do
 * with a URL. Keeping the conversion here lets one map component serve both without
 * either caller inheriting the other's storage format.
 */
export function buildMapsUrl({ lat, lng }: LatLng): string {
  return `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
}

/**
 * Recovers coordinates from a Maps URL so a picker round-trips its own output AND accepts
 * a link pasted from Google Maps by hand. Both shapes appear in the wild: `?q=lat,lng`
 * (what we emit, and what a "share" link uses) and `@lat,lng,17z` (what the address bar
 * shows while panning).
 *
 * Returns null for anything else — a Maps URL that names a place by id rather than by
 * coordinate carries no position we can honestly pin, and guessing one would put a marker
 * somewhere the operator never chose.
 */
export function parseLatLngFromUrl(url: string | undefined | null): LatLng | null {
  if (!url) return null;

  const match =
    /[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/.exec(url) ??
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/.exec(url);
  if (!match) return null;

  const candidate = { lat: Number(match[1]), lng: Number(match[2]) };
  return isValidLatLng(candidate) ? candidate : null;
}
