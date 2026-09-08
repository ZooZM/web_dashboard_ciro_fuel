import { ApiError } from './api-error';

/** `t` from `useTranslation()`, narrowed to the one call shape this module needs. */
export type TranslateFn = (key: string) => string;

/**
 * Platform `ErrorCode` → i18n key.
 *
 * Every screen before this resolved errors the same way — `err instanceof ApiError ?
 * err.message : t('errors.generic')` — which has two failure modes and hit both. A code
 * the dashboard HAS a translation for (`fuelExchange.noEligibleCompany` has existed in
 * ar.json since T041) was still shown as the platform's raw English sentence, and
 * anything that was not an `ApiError` collapsed into one generic wall that tells an
 * operator nothing about what to change.
 *
 * `ProposeDialog.tsx` had already worked this out and mapped three codes inline; this is
 * that same table, lifted so every screen shares one copy. Add a row here — never a
 * second inline `if` chain in a component — when the platform grows a code.
 *
 * Keys are the platform's `src/common/enums/error-code.enum.ts` values verbatim.
 */
export const API_ERROR_MESSAGE_KEY: Readonly<Record<string, string>> = {
  // spec 016 — broadcast fuel exchange offers
  EXCHANGE_NO_ELIGIBLE_COMPANY: 'fuelExchange.noEligibleCompany',
  EXCHANGE_DELIVERY_IN_PAST: 'fuelExchange.deliveryInPast',
  EXCHANGE_ALREADY_ANSWERED: 'fuelExchange.alreadyAnswered',
  EXCHANGE_GRADE_NOT_SOLD: 'fuelExchange.gradeNotSold',
  EXCHANGE_OFFER_NOT_OPEN: 'fuelExchange.offerClosed',
  EXCHANGE_ALREADY_RESOLVED: 'fuelExchange.alreadyResolved',
  EXCHANGE_PARTY_INVALID: 'fuelExchange.partyInvalid',
};

/**
 * The one message an operator should read for a failed request.
 *
 * Resolution order, most specific first:
 *   1. a translated message for this platform error code;
 *   2. the access-boundary statuses, which carry no code worth showing;
 *   3. the platform's OWN message — English, but specific, and strictly better than a
 *      generic wall for a code this dashboard has not been taught yet (this is what
 *      surfaces DTO validation detail such as "city must be one of the following
 *      values");
 *   4. the generic fallback, for a thrown value that is not an `ApiError` at all
 *      (a network failure, a bug in our own handler).
 */
export function apiErrorMessage(err: unknown, t: TranslateFn): string {
  if (!(err instanceof ApiError)) {
    return t('errors.generic');
  }

  const key = API_ERROR_MESSAGE_KEY[err.error];
  if (key) {
    return t(key);
  }

  if (err.statusCode === 403) {
    return t('errors.forbidden');
  }
  if (err.statusCode === 404) {
    return t('errors.notFound');
  }

  return err.message || t('errors.generic');
}
