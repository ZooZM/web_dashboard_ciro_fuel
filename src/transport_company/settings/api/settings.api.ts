import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { CompanyProfile, FuelPrice } from '@/transport_company/settings/types';

export async function getCompanyProfile(companyId: string): Promise<CompanyProfile> {
  const { data } = await apiClient.get<CompanyProfile>(apiRoutes.companies.detail(companyId));
  return data;
}

export async function updateCompanyProfile(companyId: string, name: string): Promise<CompanyProfile> {
  const { data } = await apiClient.patch<CompanyProfile>(apiRoutes.companies.detail(companyId), { name });
  return data;
}

export async function getFuelPrices(companyId: string): Promise<FuelPrice[]> {
  const { data } = await apiClient.get<FuelPrice[]>(apiRoutes.companies.fuelPrices(companyId));
  return data;
}

export async function setFuelPrices(companyId: string, prices: FuelPrice[]): Promise<FuelPrice[]> {
  const { data } = await apiClient.put<FuelPrice[]>(apiRoutes.companies.fuelPrices(companyId), prices);
  return data;
}
