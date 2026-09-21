import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import { ApiError } from '@/lib/api/api-error';
import type { FuelType } from '@/constants/order-status';

// Feature 013 T091/FR-037/FR-038: two distinct fields on `Company` — per-litre grade
// prices (`fuelPrices`) and delivery pricing components (`pricingConfig`) — over two
// distinct route pairs. Never conflated into one call.
export interface FuelPriceEntry {
  fuelType: FuelType;
  basePricePerLiter: number;
}

export async function getFuelPrices(companyId: string): Promise<FuelPriceEntry[]> {
  const { data } = await apiClient.get<FuelPriceEntry[]>(apiRoutes.companies.fuelPrices(companyId));
  return data;
}

export async function setFuelPrices(companyId: string, prices: FuelPriceEntry[]): Promise<FuelPriceEntry[]> {
  const { data } = await apiClient.put<FuelPriceEntry[]>(apiRoutes.companies.fuelPrices(companyId), {
    prices,
  });
  return data;
}

export interface PricingConfig {
  deliveryFee: number;
  serviceFeePercent: number;
  taxRatePercent: number;
  tankerCapacitiesLiters: number[];
}

// FR-011j (spec 005): a company with no pricing configured yet 409s
// (`PRICING_NOT_CONFIGURED`) rather than returning an empty body — the caller renders
// that as "not configured yet", never as a zeroed-out form.
export async function getPricingConfig(companyId: string): Promise<PricingConfig | null> {
  try {
    const { data } = await apiClient.get<PricingConfig>(apiRoutes.companies.pricingConfig(companyId));
    return data;
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 409) return null;
    throw err;
  }
}

/**
 * The four fields the platform's update DTO accepts, and nothing else.
 *
 * GET returns MORE than [PricingConfig] declares — the stored config carries
 * an `updatedAt` the interface never mentioned — and the card seeds its form
 * straight from that response, so saving echoed the extra field back. The DTO
 * is `forbidNonWhitelisted`, so the platform refused the whole request with
 * `property updatedAt should not exist` and the delivery-pricing card could
 * not be saved AT ALL: not the tanker sizes, not the delivery fee, not the
 * service fee, not the tax rate.
 *
 * Picking the fields explicitly — rather than deleting the one known extra —
 * means a future server-side addition cannot reintroduce this.
 */
function toPricingConfigPayload(config: PricingConfig): PricingConfig {
  return {
    deliveryFee: config.deliveryFee,
    serviceFeePercent: config.serviceFeePercent,
    taxRatePercent: config.taxRatePercent,
    tankerCapacitiesLiters: config.tankerCapacitiesLiters,
  };
}

export async function setPricingConfig(companyId: string, config: PricingConfig): Promise<PricingConfig> {
  const { data } = await apiClient.put<PricingConfig>(
    apiRoutes.companies.pricingConfig(companyId),
    toPricingConfigPayload(config),
  );
  return data;
}
