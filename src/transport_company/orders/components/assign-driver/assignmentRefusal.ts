import type { ApiError } from '@/lib/api/api-error';
import type { TFunction } from 'i18next';

/**
 * Feature 009 FR-005/FR-006: names the specific rule an assignment attempt failed —
 * capacity, grade, committed vehicle, already-assigned — rather than a generic failure.
 * The platform's own ConflictException bodies distinguish these by `error` code for the
 * structured cases; the two "no longer eligible" paths (`assignDriver`'s driver-eligibility
 * catch-all and its ROUTED_TO_TRANSPORT precondition) are thrown as plain strings, which
 * `HttpExceptionFilter` already turns into a clear `message` — used as-is rather than
 * re-translated, since it is already specific.
 */
export function assignmentRefusalMessage(error: ApiError, t: TFunction): string {
  switch (error.error) {
    case 'TANK_CAPACITY_EXCEEDED':
      return t('assign.refusal.tankCapacity');
    case 'TANK_GRADE_UNSUPPORTED':
      return t('assign.refusal.tankGrade');
    case 'TRUCK_UNAVAILABLE':
      return t('assign.refusal.truckUnavailable');
    case 'TANK_UNAVAILABLE':
      return t('assign.refusal.tankUnavailable');
    case 'NO_WAREHOUSE_FOR_GRADE':
      return t('assign.refusal.noWarehouse');
    // Feature 010 FR-008: the offline-driver override path's own required field —
    // shown here too (not just inline on the field) so a toast never falls back to a
    // generic message for something this specific.
    case 'ASSIGNMENT_REASON_REQUIRED':
      return t('assign.refusal.reasonRequired');
    default:
      return error.message || t('assign.refusal.generic');
  }
}
