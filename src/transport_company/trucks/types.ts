import type { FuelType } from '@/constants/order-status';

// Feature 009 Phase 6 (data-model.md §2 Truck/Tank): the platform never exposes
// `nfcCardUid`/`qrToken` as readable fields (`TrucksController.toSafeShape`) — only these two
// derived booleans, so an unverifiable vehicle is visible before assignment (FR-053) without
// the card identifier or credential ever reaching this dashboard as data.
export interface Truck {
  id: string;
  companyId: string;
  plateNumber: string;
  model: string | null;
  hasCard: boolean;
  hasCode: boolean;
  isActive: boolean;
  activeOrderId: string | null;
}

export type TankMaterial = 'IRON' | 'ALUMINIUM';

export interface Tank {
  id: string;
  code: string;
  material: TankMaterial;
  maxCapacityLiters: number;
  fuelTypes: FuelType[];
  isActive: boolean;
  activeOrderId: string | null;
}

export interface CreateTruckInput {
  plateNumber: string;
  model?: string;
}

export interface UpdateTruckInput {
  plateNumber?: string;
  model?: string;
}

export interface CreateTankInput {
  code: string;
  material: TankMaterial;
  maxCapacityLiters: number;
  fuelTypes: FuelType[];
}

export interface UpdateTankInput {
  code?: string;
  material?: TankMaterial;
  maxCapacityLiters?: number;
  fuelTypes?: FuelType[];
}

// The one endpoint permitted to return the raw token, at mint/rotate time only
// (`TrucksController`'s FR-042 exception) — never persisted as a readable field afterward.
export interface TruckWithQrToken extends Truck {
  qrToken: string;
}
