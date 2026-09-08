import type { FuelType } from '@/constants/order-status';
import type { RegionCode } from '@/constants/regions';

export interface CompanyProfile {
  id: string;
  name: string;
  /**
   * TRANSPORT-only, and assigned BY the parent fuel company (spec 004 FR-014) — never by
   * the transporter itself. `GET /companies/:id` returns the whole document, so this has
   * always been on the wire; it is declared here because the delivery-areas screen must
   * confine pricing to the regions the transporter is actually routed orders in.
   */
  servedRegions?: RegionCode[];
}

export interface FuelPrice {
  fuelType: FuelType;
  basePricePerLiter: number;
}
