import type { FuelType } from '@/constants/order-status';

export interface Truck {
  plateNumber: string;
  maxCapacityLiters: number;
  fuelTypes: FuelType[];
}

export interface Driver {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  truck: Truck;
}

export interface CreateDriverInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  truck: Truck;
}

export interface UpdateTruckInput {
  plateNumber: string;
  maxCapacityLiters: number;
  fuelTypes: FuelType[];
}
