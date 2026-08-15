import type { FuelType } from '@/constants/order-status';

export interface CompanyProfile {
  id: string;
  name: string;
}

export interface FuelPrice {
  fuelType: FuelType;
  basePricePerLiter: number;
}
