import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { DriverEligibility } from '@/constants/order-status';

/**
 * Feature 009 T025/US1: the transporter's own two actions — absent from the dashboard
 * before this feature despite existing on the platform since spec 004/008
 * (`DispatchController`). `getCandidates`/`assignDriver` are the whole reason this feature
 * exists: without them no order placed by a customer could ever reach a driver.
 *
 * Feature 010 T017: `eligibility`/`lastSeenAt` added — the candidate list now includes
 * every driver, not an eligible-only subset (FR-001), so the caller needs to know which
 * ones are actually pickable and why the rest are not.
 */
export interface Candidate {
  _id: string;
  fullName: string;
  phone: string;
  distanceMeters?: number;
  suggestedTruck: { _id: string; plateNumber: string } | null;
  eligibility: DriverEligibility;
  lastSeenAt: string | null;
}

export interface AssignDriverInput {
  driverId: string;
  truckId: string;
  tankId: string;
  // Feature 010 FR-008: required only when the chosen driver's eligibility is OFFLINE.
  // BUSY/INACTIVE are never assignable regardless — the platform refuses them
  // unconditionally, so this field is never sent for those (contracts/rest-api-delta.md #2).
  reason?: string;
}

export async function getCandidates(orderId: string): Promise<Candidate[]> {
  const { data } = await apiClient.get<Candidate[]>(apiRoutes.dispatch.candidates(orderId));
  return data;
}

export interface DispatchResult {
  assigned: boolean;
  driverId?: string;
}

/**
 * Returns the platform's own `{ assigned, driverId }` response, not the order itself
 * (`DispatchService.assignDriver`'s real return shape) — the mutation's `onSuccess`
 * invalidates the order query separately so the caller reads the current, full order
 * from there rather than this call inventing a shape the platform doesn't return.
 */
export async function assignDriver(orderId: string, input: AssignDriverInput): Promise<DispatchResult> {
  const { data } = await apiClient.post<DispatchResult>(apiRoutes.dispatch.assign(orderId), input);
  return data;
}
