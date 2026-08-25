# Tasks: Global Responsive Design & Localization

**Feature**: `004-responsive-localization`
**Date**: 2026-08-25

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for responsive hooks and store state.

- [x] T001 [P] Create `useBreakpoint` hook in `src/hooks/useBreakpoint.ts`
- [x] T002 [P] Update Layout store for drawer state in `src/stores/layout.store.ts`
- [ ] T003 [P] Add new translation namespaces in `src/lib/i18n/ar.json`
- [ ] T004 [P] Add new translation namespaces in `src/lib/i18n/en.json`
- [x] T005 Add `tablet` screen breakpoint to `tailwind.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Remove hardcoded `dir="rtl"` from `src/components/layout/AppShell.tsx` and ensure `syncDocumentDirection` logic correctly cascades

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 — Language Switching (Priority: P1) 🏆 MVP

**Goal**: A user can toggle between Arabic and English, and the entire interface re-renders in the chosen language.

**Independent Test**: Switch language via the AppBar toggle. Every visible string renders in the chosen language and the preference persists.

### Implementation for User Story 1

- [ ] T007 [P] [US1] Extract translations in `src/components/layout/Topbar.tsx` and wire `LangSwitcher`
- [ ] T008 [P] [US1] Extract translations in `src/components/layout/Sidebar.tsx`
- [ ] T009 [P] [US1] Extract translations in `src/auth/` (LoginPage, VerifyPage, RoleSelectionPage)
- [ ] T010 [P] [US1] Extract translations in shared `src/components/ui/` components (FilterToolbar, dialog, etc.)
- [ ] T011 [P] [US1] Extract translations in `src/admin/dashboard/` and `src/admin/orders/`
- [ ] T012 [P] [US1] Extract translations in `src/admin/drivers/`, `src/admin/petrol_companies/`, and `src/admin/transport_companies/`
- [ ] T013 [P] [US1] Extract translations in remaining Admin modules (`fuel_exchange`, `notifications`, `profile`, `tracking`)
- [ ] T014 [P] [US1] Extract translations in Petrol Company module (`src/petrol_company/`)
- [ ] T015 [P] [US1] Extract translations in Transport Company module (`src/transport_company/`)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. All text in the app should correctly toggle between English and Arabic.

---

## Phase 4: User Story 2 — Responsive Sidebar Navigation (Priority: P1)

**Goal**: The sidebar is fixed on Desktop, overlay drawer on Tablet, and full drawer on Mobile.

**Independent Test**: Resize the browser window and verify the sidebar adapts seamlessly without breaking the layout.

### Implementation for User Story 2

- [ ] T016 [US2] Implement responsive layout using `useBreakpoint` in `src/components/layout/AppShell.tsx`
- [ ] T017 [US2] Implement Tablet/Mobile Drawer mode in `src/components/layout/Sidebar.tsx`
- [ ] T018 [US2] Implement compact Topbar and hamburger menu logic in `src/components/layout/Topbar.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. The main shell is now responsive.

---

## Phase 5: User Story 3 — Responsive Dashboard Grid (Priority: P2)

**Goal**: Dashboard stat cards and charts dynamically adapt column counts based on viewport size.

**Independent Test**: Resize the browser on any dashboard and verify grids stack to 1 column on mobile and 2 on tablet.

### Implementation for User Story 3

- [ ] T019 [P] [US3] Add responsive grid classes to `src/admin/dashboard/components/AdminDashboard.tsx`
- [ ] T020 [P] [US3] Add responsive grid classes to `src/petrol_company/dashboard/components/PetrolDashboard.tsx`
- [ ] T021 [P] [US3] Add responsive grid classes to `src/transport_company/dashboard/components/TransportDashboard.tsx`

**Checkpoint**: All dashboards are fully responsive.

---

## Phase 6: User Story 4 — Responsive Data Tables & Lists (Priority: P2)

**Goal**: Data tables switch to a mobile-friendly card list on small viewports.

**Independent Test**: Navigate to Orders, Drivers, or Companies lists. At mobile size, confirm a card-based list renders instead of a horizontally-scrolling table.

### Implementation for User Story 4

- [ ] T022 [P] [US4] Create `MobileDriversList.tsx` and switch responsive views in `src/admin/drivers/components/AdminDriversPage.tsx`
- [ ] T023 [P] [US4] Create card list views and switch in `src/admin/petrol_companies/components/AdminPetrolCompaniesPage.tsx`
- [ ] T024 [P] [US4] Create card list views and switch in `src/admin/transport_companies/components/AdminTransportCompaniesPage.tsx`
- [ ] T025 [P] [US4] Create card list views and switch in `src/petrol_company/stations/components/StationsPage.tsx`
- [ ] T026 [P] [US4] Add responsive table switching to all `OrdersListPage.tsx` components (Admin, Petrol, Transport)
- [ ] T027 [P] [US4] Add responsive table switching to all `FuelExchangePage.tsx` components
- [ ] T028 [P] [US4] Add responsive table switching to all `InvoicesListPage.tsx` components

**Checkpoint**: All tabular data is accessible on mobile viewports.

---

## Phase 7: User Story 5 — Responsive Detail & Form Pages (Priority: P3)

**Goal**: Complex detail pages and forms stack vertically into a single column on mobile.

**Independent Test**: Open any detail or form page at mobile width. Verify all cards stack vertically and form inputs are full-width.

### Implementation for User Story 5

- [ ] T029 [P] [US5] Apply flex/grid responsive stacking to Admin detail pages (`src/admin/orders/components/OrderDetailPage.tsx`, `AdminDriverDetailsPage.tsx`, etc.)
- [ ] T030 [P] [US5] Apply flex/grid responsive stacking to Petrol detail pages (`src/petrol_company/orders/components/OrderDetailPage.tsx`, `CompanyDetailPage.tsx`, etc.)
- [ ] T031 [P] [US5] Apply flex/grid responsive stacking to Transport detail pages (`src/transport_company/orders/components/OrderDetailPage.tsx`, `DriverDetailsPage.tsx`, etc.)
- [ ] T032 [P] [US5] Update all Add/Edit form pages to use full-width inputs on mobile (`src/admin/petrol_companies/components/AddPetrolCompanyPage.tsx`, `AddDriverPage.tsx`, etc.)

**Checkpoint**: Detail and Form pages are readable on mobile.

---

## Phase 8: User Story 6 — RTL Layout Integrity (Priority: P3)

**Goal**: All text alignment, margins, padding, and positioning correctly mirror in RTL mode via Tailwind logical properties.

**Independent Test**: Switch to Arabic and verify everything renders correctly mirrored (e.g. padding, margins, chevrons).

### Implementation for User Story 6

- [ ] T033 [P] [US6] Replace physical properties (`ml-`, `pr-`, `text-left`) with logical properties (`ms-`, `pe-`, `text-start`) in `src/components/layout/` and `src/components/ui/`
- [ ] T034 [P] [US6] Replace physical properties with logical properties across `src/admin/`
- [ ] T035 [P] [US6] Replace physical properties with logical properties across `src/petrol_company/`
- [ ] T036 [P] [US6] Replace physical properties with logical properties across `src/transport_company/`
- [ ] T037 [P] [US6] Replace physical properties in shared auth and routing pages (`src/auth/`, `src/routing/`)

**Checkpoint**: All user stories are implemented.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T038 Verify 100% string extraction by running lint `npm run lint`
- [ ] T039 Verify responsive scaling without horizontal overflow on 320px viewport
- [ ] T040 Clean up unused physical CSS classes or variables

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent.
- **User Story 2 (P1)**: Independent, but leverages Setup.
- **User Story 3 (P2)**: Independent.
- **User Story 4 (P2)**: Independent.
- **User Story 5 (P3)**: Independent.
- **User Story 6 (P3)**: Touches all files, should ideally run after or alongside User Story 1.

### Parallel Opportunities

- All Setup tasks marked `[P]` can run in parallel
- Translation extraction tasks (`T007` - `T015`) can be fully parallelized per module
- Dashboard updates (`T019` - `T021`) can be fully parallelized per role
- Detail & Form stacking (`T029` - `T032`) can be fully parallelized

---

## Parallel Example: User Story 1

```bash
# Extract translations across different modules concurrently:
Task: "Extract translations in src/admin/dashboard/ and src/admin/orders/"
Task: "Extract translations in Petrol Company module (src/petrol_company/)"
Task: "Extract translations in Transport Company module (src/transport_company/)"
```

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Phase 1 & 2.
2. Complete Phase 3 (Language Switching).
3. Complete Phase 4 (Sidebar Responsiveness).
4. **STOP and VALIDATE**: Validate translations and sidebar navigation.

### Incremental Delivery

1. Foundation ready.
2. Deliver US1 & US2 -> MVP!
3. Deliver US3 (Dashboards).
4. Deliver US4 (Tables).
5. Deliver US5 & US6 (Detail pages, RTL polishing).
