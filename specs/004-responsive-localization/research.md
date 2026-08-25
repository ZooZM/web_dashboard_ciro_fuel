# Research: Global Responsive Design & Localization

**Feature**: `004-responsive-localization`
**Date**: 2026-08-25
**Status**: Complete — all items resolved

---

## R1: Tailwind CSS Logical Property Utilities for RTL/LTR

**Decision**: Use Tailwind v3.3+ native logical-property utilities (`ms-*`, `me-*`, `ps-*`,
`pe-*`, `text-start`, `text-end`, `start-*`, `end-*`, `rounded-s-*`, `rounded-e-*`) instead of
physical `ml-*`/`mr-*`/`pl-*`/`pr-*` classes.

**Rationale**: The project runs Tailwind 3.4.19 which includes full logical-property support.
Using logical utilities means a single class set works correctly under both `dir="rtl"` and
`dir="ltr"` without any `rtl:` / `ltr:` variant overrides. The existing `tailwind.config.ts`
already notes this in a comment (line 54–56).

**Alternatives considered**:
- Manual `rtl:` / `ltr:` variant classes — rejected because they double the class count and are
  error-prone; logical properties are semantically correct.
- CSS custom properties for direction-aware spacing — rejected as unnecessary overhead when
  Tailwind already provides the utilities.

**Migration pattern**: Replace physical utilities in existing components:
- `ml-3` → `ms-3` (margin-inline-start)
- `mr-3` → `me-3` (margin-inline-end)
- `pl-3` → `ps-3` (padding-inline-start)
- `pr-3` → `pe-3` (padding-inline-end)
- `text-left` → `text-start`
- `text-right` → `text-end`
- `left-0` → `start-0`
- `right-0` → `end-0`
- `rounded-l-*` → `rounded-s-*`
- `rounded-r-*` → `rounded-e-*`

---

## R2: Breakpoint Strategy — CSS vs JS

**Decision**: Use **CSS-first** breakpoints via Tailwind responsive prefixes (`sm:`, `md:`,
`lg:`, `xl:`) for all layout adaptations. Add a single **JS hook** (`useBreakpoint`) only for
the sidebar mode toggling and cases where render branches differ (table vs card list).

**Rationale**: CSS media queries are zero-cost at runtime and don't cause React re-renders.
The JS hook is needed only where the component tree itself differs (conditional rendering), not
for styling differences.

**Alternatives considered**:
- Pure CSS `display: none` / `display: block` for table/card switching — rejected because both
  DOM trees would mount simultaneously, doubling data-binding overhead.
- `react-responsive` library — rejected to honour the zero-new-deps constraint.
- Window `resize` listener in every component — rejected as wasteful; a single store-based hook
  centralises the listener.

**Implementation**:
```typescript
// src/hooks/useBreakpoint.ts
import { useSyncExternalStore } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

const MOBILE_MAX = 599;
const TABLET_MAX = 1024;

function getBreakpoint(): Breakpoint {
  const w = window.innerWidth;
  if (w <= MOBILE_MAX) return 'mobile';
  if (w <= TABLET_MAX) return 'tablet';
  return 'desktop';
}

let current = getBreakpoint();
const listeners = new Set<() => void>();

window.addEventListener('resize', () => {
  const next = getBreakpoint();
  if (next !== current) {
    current = next;
    listeners.forEach((l) => l());
  }
});

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): Breakpoint {
  return current;
}

export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore(subscribe, getSnapshot);
}
```

**Breakpoint alignment with Tailwind**:
- Mobile: `< 600px` — default (no prefix) in Tailwind
- Tablet: `600–1024px` — `sm:` (640px) is close; we add a custom `tablet:` screen at 600px
- Desktop: `> 1024px` — `lg:` (1024px)

Custom screen added to `tailwind.config.ts`:
```typescript
screens: {
  tablet: '600px',   // custom breakpoint matching spec
  // sm: 640px, md: 768px, lg: 1024px, xl: 1280px remain default
}
```

---

## R3: i18n Key Organisation Strategy

**Decision**: Organise translation keys in a **flat module-namespaced** structure within a single
JSON file per language. Group by feature module using dot-separated keys.

**Rationale**: The project already uses this pattern (`common.*`, `nav.*`, `auth.*`, `orders.*`,
etc.) in the existing `ar.json` / `en.json` files. Extending it is non-breaking.

**Alternatives considered**:
- Separate JSON file per namespace (loaded lazily) — rejected because the total key count (~600)
  is well within the threshold where a single bundled JSON is more performant than dynamic
  imports. Lazy loading adds complexity for negligible size savings (~15 KB per language).
- YAML translation files — rejected because i18next natively consumes JSON; no conversion step.

**Key structure (extended)**:
```jsonc
{
  "common": { /* save, cancel, submit, loading, language, search, actions, ... */ },
  "nav": { /* home, orders, tracking, fuelExchange, companies, invoices, ... */ },
  "auth": { /* login.*, verify.*, roleSelection.* */ },
  "admin": {
    "dashboard": { /* greeting, statCards.*, actionCards.*, doughnutCharts.* */ },
    "orders": { /* title, headers.*, filters.*, detail.* */ },
    "drivers": { /* title, headers.*, detail.* */ },
    "petrolCompanies": { /* title, stats.*, headers.*, detail.* */ },
    "transportCompanies": { /* title, stats.*, headers.*, detail.* */ },
    "fuelExchange": { /* title, headers.*, detail.* */ },
    "notifications": { /* title, empty, ... */ },
    "profile": { /* title, sections.* */ },
    "tracking": { /* title, legends.* */ }
  },
  "petrol": {
    "dashboard": { /* ... */ },
    "orders": { /* ... */ },
    "companies": { /* ... */ },
    "stations": { /* ... */ },
    "fuelExchange": { /* ... */ },
    "fuelPrices": { /* ... */ },
    "invoices": { /* ... */ },
    "profile": { /* ... */ }
  },
  "transport": {
    "dashboard": { /* ... */ },
    "orders": { /* ... */ },
    "drivers": { /* ... */ },
    "trucks": { /* ... */ },
    "clients": { /* ... */ },
    "invoices": { /* ... */ },
    "deliveryAreas": { /* ... */ },
    "tracking": { /* ... */ },
    "settings": { /* ... */ },
    "profile": { /* ... */ },
    "help": { /* ... */ },
    "terms": { /* ... */ }
  },
  "orders": { /* shared order keys: status badges, common fields */ },
  "drivers": { /* shared driver keys */ },
  "companies": { /* shared company keys */ },
  "invoices": { /* shared invoice keys */ },
  "errors": { /* generic, notFound, forbidden, network, timeout */ },
  "validation": { /* required, minLength, maxLength, invalidEmail, ... */ }
}
```

---

## R4: Sidebar Responsive Architecture

**Decision**: Evolve the existing `Sidebar.tsx` + `layout.store.ts` into a 3-tier model using
the `useBreakpoint` hook and Framer Motion for drawer animation.

**Rationale**: The sidebar already has partial mobile detection (line 81–93 in `Sidebar.tsx`)
with `window.innerWidth < 768`. Refactoring to the centralised `useBreakpoint` hook aligns the
threshold with the spec (< 600 = mobile, 600–1024 = tablet) and removes duplicated resize listeners.

**Alternatives considered**:
- CSS-only sidebar with `@media` queries — rejected because the sidebar has conditional render
  logic (overlay backdrop, body scroll lock) that requires JS.
- Radix Sheet/Drawer primitive — rejected to avoid new dependency and because the existing Framer
  Motion animation is already smooth.

**Behaviour matrix**:

| Breakpoint | Sidebar State | Toggle Behaviour | Backdrop |
|---|---|---|---|
| Desktop (> 1024) | Visible, pinned | Collapse ↔ icon rail (existing) | None |
| Tablet (600–1024) | Hidden by default | Hamburger → overlay drawer (260px) | Semi-transparent |
| Mobile (< 600) | Hidden by default | Hamburger → full-width drawer | Semi-transparent |

**Layout store changes**:
```typescript
interface LayoutState {
  isSidebarCollapsed: boolean;
  isSidebarOpen: boolean;       // NEW: for drawer mode (tablet/mobile)
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}
```

---

## R5: Hardcoded `dir="rtl"` Removal Strategy

**Decision**: Remove all hardcoded `dir="rtl"` and `dir="ltr"` attributes from JSX. Let the
`<html dir="..." lang="...">` set by `syncDocumentDirection()` cascade through the entire DOM.
Only override `dir` on specific elements that must remain direction-fixed (e.g., numeric codes
displayed LTR regardless of language).

**Rationale**: The `syncDocumentDirection` utility already sets `<html dir>`. Hardcoded `dir="rtl"`
on `AppShell`, `Sidebar`, and various cards prevents the LTR switch from taking effect.

**Alternatives considered**:
- Keep `dir` on AppShell and derive from language store — rejected because it duplicates what
  `<html dir>` already provides and can cause nested-dir conflicts.

**Components with hardcoded `dir` to audit**:
- `AppShell.tsx` → `dir="rtl"` on root div
- `Sidebar.tsx` → `dir="rtl"` on `<motion.aside>`
- `Topbar.tsx` → `dir="ltr"` on `<header>`, `dir="rtl"` on search/profile elements
- Various dashboard/detail components → `dir="rtl"` on wrappers

**Pattern**: Remove the attribute entirely; use `dir="ltr"` only on date/number elements that
must not flip (e.g., order codes, phone numbers, date ranges).

---

## R6: Table ↔ Card List Responsive Pattern

**Decision**: Use the `useBreakpoint` hook to conditionally render `<DesktopTable>` or
`<MobileCardList>` at the page level. The existing project already follows this pattern in some
modules (e.g., `DesktopOrdersTable.tsx` + `MobileOrdersList.tsx` coexist).

**Rationale**: Both components already exist for orders in all 3 role modules. The pattern just
needs to be applied consistently to drivers, invoices, companies, and stations tables.

**Alternatives considered**:
- Horizontal-scroll wrapper on desktop tables — rejected because it creates a poor mobile UX
  for data-heavy tables.
- CSS `display: none` toggle — rejected because it mounts both trees simultaneously.

**Implementation pattern**:
```tsx
const bp = useBreakpoint();
return bp === 'desktop' || bp === 'tablet'
  ? <DesktopOrdersTable data={data} />
  : <MobileOrdersList data={data} />;
```

Where mobile card components don't yet exist (e.g., Admin Drivers, Petrol Stations), new
`Mobile*List.tsx` components will be created following the existing `MobileOrdersList` pattern.

---

## R7: Physical ↔ Logical Property Audit Scope

**Decision**: Audit and replace physical properties systematically per module during i18n key
extraction, treating both changes as a single pass per component file.

**Rationale**: Touching each file only once minimises merge conflicts and review overhead. The
i18n extraction pass naturally requires reading every string in every component — the physical
property replacement piggybacks on that read.

**Audit categories**:
1. **Margin/Padding**: `ml-`, `mr-`, `pl-`, `pr-` → `ms-`, `me-`, `ps-`, `pe-`
2. **Text alignment**: `text-left`, `text-right` → `text-start`, `text-end`
3. **Positioning**: `left-`, `right-` → `start-`, `end-`
4. **Border radius**: `rounded-l-`, `rounded-r-` → `rounded-s-`, `rounded-e-`
5. **Flex direction**: `flex-row` is bidi-safe; no change needed.
6. **Icon mirroring**: Chevrons (`ChevronLeft`, `ChevronRight`) → use `rtl:-scale-x-100` or
   swap to direction-aware icon.
7. **Hardcoded `dir`**: Remove or condition to language.

**Estimated scope**: ~50+ files have physical-direction utilities based on grep analysis.
