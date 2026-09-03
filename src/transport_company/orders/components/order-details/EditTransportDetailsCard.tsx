// Found while working on feature 013 (fuel company admin dashboard): `OrderEditPage.tsx`
// imported this component and it did not exist anywhere in the repo — a missing-module
// error (`TS2307`) that broke `tsc -b --force` and prevented `router.tsx` (which this
// feature's own route-guard work touches) from even loading in a test or dev build. The
// whole of `OrderEditPage.tsx` is unwired mock UI (hardcoded "ORD-2024-256", no route
// params, no `OrderDetailContext`) belonging to the transport company surface — feature
// 009's territory, not this feature's. This is a minimal stub restoring compilability
// only; wiring this screen for real is out of scope here and left disclosed.
export function EditTransportDetailsCard() {
  return null;
}
