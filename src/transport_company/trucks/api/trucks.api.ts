import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { Truck, CreateTruckInput, UpdateTruckInput, TruckWithQrToken } from '@/transport_company/trucks/types';

// Feature 009 Phase 6: `TrucksController.findAll` returns `{ items, fleetRegistered }` — a
// plain array plus a flag distinguishing "no trucks registered" from "none currently
// available" (FR-044) — never a cursor page. Do not reuse CursorPage<T> here.
export interface TruckList {
  items: Truck[];
  fleetRegistered: boolean;
}

export async function listTrucks(availableOnly = false): Promise<TruckList> {
  const { data } = await apiClient.get<TruckList>(apiRoutes.trucks.list, {
    params: availableOnly ? { available: 'true' } : undefined,
  });
  return data;
}

export async function getTruck(id: string): Promise<Truck> {
  const { data } = await apiClient.get<Truck>(apiRoutes.trucks.detail(id));
  return data;
}

export async function createTruck(input: CreateTruckInput): Promise<Truck> {
  const { data } = await apiClient.post<Truck>(apiRoutes.trucks.create, input);
  return data;
}

export async function updateTruck(id: string, input: UpdateTruckInput): Promise<Truck> {
  const { data } = await apiClient.patch<Truck>(apiRoutes.trucks.update(id), input);
  return data;
}

export async function withdrawTruck(id: string): Promise<Truck> {
  const { data } = await apiClient.patch<Truck>(apiRoutes.trucks.withdraw(id));
  return data;
}

export async function restoreTruck(id: string): Promise<Truck> {
  const { data } = await apiClient.patch<Truck>(apiRoutes.trucks.restore(id));
  return data;
}

export async function pairCard(id: string, nfcCardUid: string): Promise<Truck> {
  const { data } = await apiClient.post<Truck>(apiRoutes.trucks.pairCard(id), { nfcCardUid });
  return data;
}

export async function mintQrToken(id: string): Promise<TruckWithQrToken> {
  const { data } = await apiClient.post<TruckWithQrToken>(apiRoutes.trucks.mintQrToken(id));
  return data;
}

export async function rotateQrToken(id: string): Promise<TruckWithQrToken> {
  const { data } = await apiClient.post<TruckWithQrToken>(apiRoutes.trucks.rotateQrToken(id));
  return data;
}

export async function revokeQrToken(id: string): Promise<Truck> {
  const { data } = await apiClient.patch<Truck>(apiRoutes.trucks.revokeQrToken(id));
  return data;
}
