import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { GovernorateCode, RegionCode } from '@/constants/regions';

// Mirrors `src/modules/stations/schemas/station.schema.ts` — a CLIENT's delivery site,
// registered by their fuel company. No `isActive` field exists on the platform; removal
// is a soft delete (`DELETE /stations/:id`), not a status toggle, unlike this screen's
// original mock.
export interface Station {
  _id: string;
  companyId: string;
  clientId: string;
  name?: string;
  regionCode: RegionCode;
  governorateCode: GovernorateCode;
  location: { type: 'Point'; coordinates: [number, number] };
  addressText: string;
  isDefault: boolean;
  isFavourite: boolean;
}

// FR-025: every station across every owner of the acting fuel company — `Station` is
// tenant-scoped, so no explicit filter is sent (T058).
export async function listAllStations(): Promise<Station[]> {
  const { data } = await apiClient.get<{ items: Station[] }>(apiRoutes.stations.allForCompany);
  return data.items;
}

// FR-036: one owner's own stations, for the owner-detail screen's stations block.
export async function listStationsForOwner(ownerId: string): Promise<Station[]> {
  const { data } = await apiClient.get<{ items: Station[] }>(apiRoutes.users.stations(ownerId));
  return data.items;
}

export interface CreateStationInput {
  name?: string;
  regionCode: RegionCode;
  governorateCode: GovernorateCode;
  latitude: number;
  longitude: number;
  addressText?: string;
}

export async function createStation(ownerId: string, input: CreateStationInput): Promise<Station> {
  const { name, regionCode, governorateCode, latitude, longitude, addressText } = input;
  const { data } = await apiClient.post<Station>(apiRoutes.users.stations(ownerId), {
    name,
    regionCode,
    governorateCode,
    addressText,
    location: { latitude, longitude },
  });
  return data;
}

export interface UpdateStationInput {
  name?: string;
  regionCode?: RegionCode;
  governorateCode?: GovernorateCode;
  latitude?: number;
  longitude?: number;
  addressText?: string;
}

export async function updateStation(id: string, input: UpdateStationInput): Promise<Station> {
  const { latitude, longitude, ...rest } = input;
  const { data } = await apiClient.patch<Station>(apiRoutes.stations.update(id), {
    ...rest,
    ...(latitude != null && longitude != null ? { location: { latitude, longitude } } : {}),
  });
  return data;
}

// FR-036c: soft delete — the station drops out of every list but stays readable through
// any order that referenced it (backend-side, not this dashboard's concern).
export async function removeStation(id: string): Promise<void> {
  await apiClient.delete(apiRoutes.stations.detail(id));
}
