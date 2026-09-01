import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { Tank, CreateTankInput, UpdateTankInput } from '@/transport_company/trucks/types';

export interface TankList {
  items: Tank[];
  fleetRegistered: boolean;
}

export async function listTanks(): Promise<TankList> {
  const { data } = await apiClient.get<TankList>(apiRoutes.tanks.list);
  return data;
}

export async function getTank(id: string): Promise<Tank> {
  const { data } = await apiClient.get<Tank>(apiRoutes.tanks.detail(id));
  return data;
}

export async function createTank(input: CreateTankInput): Promise<Tank> {
  const { data } = await apiClient.post<Tank>(apiRoutes.tanks.create, input);
  return data;
}

export async function updateTank(id: string, input: UpdateTankInput): Promise<Tank> {
  const { data } = await apiClient.patch<Tank>(apiRoutes.tanks.update(id), input);
  return data;
}

export async function withdrawTank(id: string): Promise<Tank> {
  const { data } = await apiClient.patch<Tank>(apiRoutes.tanks.withdraw(id));
  return data;
}

export async function restoreTank(id: string): Promise<Tank> {
  const { data } = await apiClient.patch<Tank>(apiRoutes.tanks.restore(id));
  return data;
}
