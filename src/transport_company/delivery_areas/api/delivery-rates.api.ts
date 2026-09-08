import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { GovernorateCode, RegionCode } from '@/constants/regions';

/**
 * One priced area. Mirrors the platform's `DeliveryRate` sub-schema exactly.
 *
 * `governorateCode` absent means the rate covers the WHOLE region; a governorate-specific
 * rate wins over its region's, because resolution is most-specific-first. Without that a
 * transporter could not charge more for one hard-to-reach governorate without re-pricing
 * everywhere else it serves.
 */
export interface DeliveryRate {
  regionCode: RegionCode;
  governorateCode?: GovernorateCode;
  pricePerKm: number;
  minPrice: number;
  updatedAt?: string;
}

export async function getDeliveryRates(companyId: string): Promise<DeliveryRate[]> {
  const { data } = await apiClient.get<DeliveryRate[]>(apiRoutes.companies.deliveryRates(companyId));
  return data;
}

/**
 * The WHOLE set, every time — the shape `SetDeliveryRatesDto` requires, and for the reason
 * it documents: an area disappearing from the list is how a transporter stops serving it,
 * which a per-entry PATCH could not express without a second delete endpoint and a way to
 * name an entry that has no id.
 *
 * An empty array is therefore meaningful, not a no-op guard: it is a transporter
 * withdrawing from every area at once, and the platform deliberately accepts it.
 */
export async function setDeliveryRates(
  companyId: string,
  rates: Omit<DeliveryRate, 'updatedAt'>[],
): Promise<DeliveryRate[]> {
  const { data } = await apiClient.put<DeliveryRate[]>(
    apiRoutes.companies.deliveryRates(companyId),
    { rates },
  );
  return data;
}
