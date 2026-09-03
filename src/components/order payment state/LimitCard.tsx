// Feature 013: this card shows the station owner's credit-limit usage against a
// DEFERRED order — Phase 6 (US3)'s scope (credit limits), not Phase 5's. The previous
// mock hardcoded "84,000 remaining of 150,000" as if it were live data; removed
// outright (FR-047/FR-048). `GET /users/me/credit` (CLIENT-only) computes exactly this
// shape today but has no FUEL_COMPANY_ADMIN-facing counterpart yet — Phase 6 needs to
// add one before this card can be wired for real.
export function LimitCard() {
  return null;
}
