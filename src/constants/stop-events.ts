/**
 * spec 011: the stop-event vocabulary, mirroring the platform's
 * `src/common/enums/stop-origin.enum.ts` and `stop-reason.enum.ts`.
 *
 * Const maps rather than bare string literals (Constitution Principle I).
 * These matter more than most: the transport administrator is reading back
 * exactly what the driver picked from the *same* list in the mobile app, so
 * a value invented on either side does not fail loudly — it renders as a
 * missing translation key next to a real stop on a real delivery.
 */
export const StopOrigin = {
  /** The platform noticed the truck had not moved and asked the driver. */
  DETECTED: 'DETECTED',
  /** The driver said so before anyone asked. */
  DECLARED: 'DECLARED',
} as const;
export type StopOrigin = (typeof StopOrigin)[keyof typeof StopOrigin];

export const StopReason = {
  TRAFFIC: 'TRAFFIC',
  VEHICLE_PROBLEM: 'VEHICLE_PROBLEM',
  REST_OR_PRAYER: 'REST_OR_PRAYER',
  REFUELLING: 'REFUELLING',
  ROAD_CLOSURE: 'ROAD_CLOSURE',
  ACCIDENT: 'ACCIDENT',
  OTHER: 'OTHER',
} as const;
export type StopReason = (typeof StopReason)[keyof typeof StopReason];

/** Translation key for a reason label — kept next to the map so the two
 *  cannot drift into disagreement about casing or prefix. */
export function stopReasonKey(reason: StopReason): string {
  return `stopAlert.reason.${reason}`;
}
