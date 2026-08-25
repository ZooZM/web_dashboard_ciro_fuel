# Feature Specification: Global Responsive Design & Localization

**Feature Branch**: `004-responsive-localization`

**Created**: 2026-08-25

**Status**: Draft

**Input**: User description: "Upgrade the entire web_dashboard_ciro_fuel project to be fully Responsive and Localized with English/Arabic support, RTL, and adaptive navigation."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Language Switching (Priority: P1)

A user (Super Admin, Petrol Company Admin, or Transport Company Admin) opens the dashboard in their
default language (Arabic). They click the language toggle in the top AppBar and switch to English.
The entire interface — sidebar labels, topbar, page headings, stat cards, table headers, form
labels, buttons, error messages, and toast notifications — re-renders in English with a left-to-right
layout. The selected language persists across sessions.

**Why this priority**: Without fully extracted translation keys, no other localisation work is
possible. This is the foundational enabling story for all bilingual and RTL behaviour.

**Independent Test**: Switch language via the AppBar toggle. Every visible string renders in the
chosen language. Refresh the browser — the language preference is retained. Verify both `ar → en`
and `en → ar` transitions.

**Acceptance Scenarios**:

1. **Given** the dashboard is loaded in Arabic, **When** the user clicks the language toggle,
   **Then** the UI re-renders entirely in English (LTR) within 300 ms and no Arabic literals remain.
2. **Given** the user switched to English and closed the tab, **When** they reopen the dashboard,
   **Then** it loads in English without requiring another toggle.
3. **Given** the app is in English, **When** the user switches back to Arabic, **Then** the layout
   switches to RTL and all strings render in Arabic.

---

### User Story 2 — Responsive Sidebar Navigation (Priority: P1)

On a desktop viewport (> 1024 px) the sidebar is permanently visible and can be collapsed to an icon
rail. On a tablet viewport (600–1024 px) the sidebar collapses by default but can be opened as an
overlay drawer. On a mobile viewport (< 600 px) the sidebar is hidden entirely and opens as a full
drawer when the user taps the hamburger icon in the topbar.

**Why this priority**: Navigation is the entry point to every screen. If it breaks on smaller
devices, the entire dashboard is inaccessible.

**Independent Test**: Resize the browser through the three breakpoints. At each, verify the
sidebar transitions correctly without layout overflow or overlapping content.

**Acceptance Scenarios**:

1. **Given** a desktop viewport (> 1024 px), **When** the page loads, **Then** the sidebar is
   visible and pinned; main content occupies the remaining width.
2. **Given** a tablet viewport (600–1024 px), **When** the page loads, **Then** the sidebar is
   hidden; a hamburger icon appears in the topbar. Tapping it opens the sidebar as an overlay with
   backdrop. Tapping the backdrop or a nav link closes it.
3. **Given** a mobile viewport (< 600 px), **When** the page loads, **Then** the sidebar behaves
   identically to the tablet drawer but at full viewport width.
4. **Given** the sidebar is open on tablet, **When** the viewport is resized to desktop width,
   **Then** the sidebar pins in place and the overlay backdrop is removed automatically.

---

### User Story 3 — Responsive Dashboard Grid (Priority: P2)

The Admin, Petrol Company, and Transport Company dashboards display stat cards, doughnut charts,
action cards, and map widgets in adaptive grids. On mobile the grid collapses to a single column.
On tablet it becomes two columns. On desktop it expands to the full multi-column layout already
designed.

**Why this priority**: Dashboards are the most-visited screens. Broken layout on smaller viewports
harms user trust.

**Independent Test**: Navigate to each dashboard at each breakpoint and verify every card, chart,
and widget displays without horizontal overflow, truncation, or overlap.

**Acceptance Scenarios**:

1. **Given** a mobile viewport, **When** the Admin Dashboard loads, **Then** stat cards stack in a
   single column, action cards stack vertically, and the map fills full width.
2. **Given** a tablet viewport, **When** the Transport Dashboard loads, **Then** stat cards arrange
   in a 2-column grid, and the new-orders / in-progress sections sit side-by-side.
3. **Given** a desktop viewport, **When** the Petrol Dashboard loads, **Then** the current
   multi-column layout is preserved unchanged.

---

### User Story 4 — Responsive Data Tables & Lists (Priority: P2)

All data tables (Orders, Drivers, Invoices, Companies, Stations) use a desktop table on large
viewports and switch to a mobile-friendly card list on small viewports. The crossover is
context-driven (typically ≤ 768 px shows cards).

**Why this priority**: Tables are the primary data-interaction surface. Broken horizontal scrolling
is the most common responsive failure mode.

**Independent Test**: Navigate to each list page. At desktop, confirm the full `<table>` renders. At
mobile, confirm the card-list renders. Verify filtering / pagination works identically in both views.

**Acceptance Scenarios**:

1. **Given** a mobile viewport, **When** the user opens the Orders page, **Then** orders display as
   vertical cards with key data visible (order code, status, date) and a tap target for details.
2. **Given** a desktop viewport, **When** the user opens the Drivers page, **Then** the full
   sortable table is shown with all columns.
3. **Given** the user applies a filter on mobile, **When** results update, **Then** the card list
   reflects the filtered data correctly.

---

### User Story 5 — Responsive Detail & Form Pages (Priority: P3)

Detail pages (Order Detail, Driver Detail, Company Detail, Station Detail, Profile) and form pages
(Add Driver, Add Company, Add Station Owner, Order Edit) adapt their multi-column card layouts to
single-column stacking on mobile, with form fields becoming full-width.

**Why this priority**: While less frequently visited than list pages, forms are critical for data
entry and must not overflow on small screens.

**Independent Test**: Open each detail and form page at mobile width. Verify all cards stack
vertically, no form field is clipped, and submit actions remain accessible.

**Acceptance Scenarios**:

1. **Given** a mobile viewport, **When** the user opens the Order Detail page, **Then** the order
   data card, map card, timeline card, and driver card stack vertically without horizontal scroll.
2. **Given** a mobile viewport, **When** the user opens the Add Driver form, **Then** all form
   fields are full-width and the submit button is visible without scrolling past the fold.
3. **Given** a desktop viewport, **When** the user opens the Company Detail page, **Then** the
   existing side-by-side card layout is preserved.

---

### User Story 6 — RTL Layout Integrity (Priority: P3)

When Arabic is selected, the entire app renders in RTL: text alignment, flexbox direction, sidebar
position, icon mirroring (e.g., chevrons), margin/padding sides, and scroll direction all flip
correctly. No visual artefacts (overlapping elements, misaligned icons, truncated text) are present.

**Why this priority**: Arabic is the primary language of the target user base. RTL correctness is
non-negotiable for production use.

**Independent Test**: Switch to Arabic. Systematically navigate every screen. Confirm sidebar is on
the right, text is right-aligned, navigation chevrons point left-to-right, and no layout breaks.

**Acceptance Scenarios**:

1. **Given** the app is in Arabic (RTL), **When** the user opens the sidebar, **Then** the sidebar
   appears on the right side with text right-aligned and collapse/expand chevron mirrored.
2. **Given** the app is in Arabic, **When** the user opens a data table, **Then** column headers and
   cell text are right-aligned and the table scrolls naturally.
3. **Given** the app is in English (LTR), **When** the user opens the same table, **Then** text
   is left-aligned and the layout mirrors the Arabic view.

---

### Edge Cases

- What happens when the user resizes the viewport mid-interaction (e.g., while a dropdown is open)?
  The dropdown repositions or closes gracefully without layout corruption.
- What happens when a translation key is missing? The fallback language (Arabic) value is displayed;
  no raw key string is ever shown to the user.
- What happens when an extremely long translated string is used (e.g., German-length)? The UI
  wraps or truncates with an ellipsis rather than breaking the layout.
- What happens when the language store and `i18next` get out of sync? The language store update
  triggers both `i18n.changeLanguage` and `syncDocumentDirection` atomically.
- What happens on a 320 px viewport (e.g., iPhone SE)? All critical content is still reachable
  via vertical scroll; no horizontal overflow exists.

## Requirements *(mandatory)*

### Functional Requirements

#### Localization

- **FR-001**: System MUST support two languages: English (`en`) and Arabic (`ar`).
- **FR-002**: System MUST store translation strings in structured JSON files under
  `src/lib/i18n/` — one file per language (`ar.json`, `en.json`).
- **FR-003**: All user-visible hardcoded strings across all 210 TSX components MUST be replaced with
  translation-key references using `react-i18next`'s `useTranslation` hook / `t()` function.
- **FR-004**: Translation JSON files MUST be organized into namespaced sections mirroring the app
  modules: `common`, `nav`, `auth`, `admin`, `petrol`, `transport`, `orders`, `drivers`, `clients`,
  `companies`, `stations`, `invoices`, `fuel_exchange`, `tracking`, `notifications`, `settings`,
  `profile`, `help`, `terms`, `errors`.
- **FR-005**: System MUST provide a language toggle control in the top AppBar that switches between
  English and Arabic instantly (without page reload).
- **FR-006**: Selected language MUST persist in `localStorage` and be restored on next session.
- **FR-007**: System MUST set `<html dir="rtl" lang="ar">` when Arabic is active and
  `<html dir="ltr" lang="en">` when English is active.
- **FR-008**: When Arabic is selected, the entire layout MUST render in RTL — sidebar on the right,
  text right-aligned, flexbox directions reversed, icon mirroring applied where appropriate.

#### Responsive Design

- **FR-009**: System MUST implement three responsive breakpoints: Mobile (< 600 px), Tablet
  (600–1024 px), Desktop (> 1024 px).
- **FR-010**: The sidebar MUST be permanently visible and pinned on Desktop, hidden-by-default with
  overlay drawer on Tablet, and hidden-by-default with full-width drawer on Mobile.
- **FR-011**: All grid layouts (stat cards, action cards, doughnut charts) MUST adapt column count:
  1 column on Mobile, 2 on Tablet, original multi-column on Desktop.
- **FR-012**: Data tables MUST switch to a card-based list view on viewports ≤ 768 px.
- **FR-013**: Multi-column detail-page layouts MUST collapse to single-column stacking on viewports
  < 768 px.
- **FR-014**: All form pages MUST render fields at full width on Mobile with no horizontal overflow.
- **FR-015**: All hardcoded fixed pixel widths/heights that cause layout overflow on small screens
  MUST be replaced with relative sizing (`flex`, percentage-based, `max-w-*`, or responsive
  Tailwind utility classes).
- **FR-016**: The topbar MUST remain sticky at the top across all breakpoints and adapt its content
  (hide search bar on mobile, compact profile display).

#### Safe Refactoring

- **FR-017**: Existing UI components MUST NOT be deleted or restructured. Responsive behaviour
  MUST be achieved by wrapping existing widgets in responsive containers or adding responsive
  Tailwind classes.
- **FR-018**: Existing functionality — navigation, data fetching, form submission, auth flow —
  MUST NOT regress.

### Key Entities

- **Language**: One of `'ar' | 'en'`. Determines active translation file and document direction.
- **Breakpoint**: Named viewport threshold — `mobile` (< 600 px), `tablet` (600–1024 px),
  `desktop` (> 1024 px). Used by CSS media queries and optional JS hooks.
- **Translation Namespace**: A top-level key in the JSON translation files that groups related
  strings by module (e.g., `admin.dashboard`, `transport.orders`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100 % of user-visible strings across all 210 TSX files are sourced from translation
  JSON files — zero hardcoded Arabic or English literals remain in JSX.
- **SC-002**: Users can switch between English and Arabic in under 1 second via the AppBar toggle
  with no page reload.
- **SC-003**: Language preference is retained across browser sessions with 100 % reliability.
- **SC-004**: The dashboard renders without horizontal overflow on viewports as narrow as 320 px
  (iPhone SE).
- **SC-005**: All data tables provide a usable card-based view on Mobile with no loss of critical
  information (order code, status, date, amount).
- **SC-006**: The sidebar transitions correctly between pinned, overlay-drawer, and full-drawer
  modes across all three breakpoints with no layout jump or overlap.
- **SC-007**: In RTL mode, all interactive elements (buttons, dropdowns, navigation links) are
  reachable and correctly positioned — verified by manual walkthrough of every screen.
- **SC-008**: No existing automated test fails after the responsive and localisation changes are
  applied.

## Assumptions

- The existing `i18next` + `react-i18next` infrastructure (already present in the project) will
  continue to be used. No migration to a different i18n library is required.
- The existing Zustand `language.store` and `syncDocumentDirection` utility are retained and
  extended rather than replaced.
- Tailwind CSS responsive utilities (`sm:`, `md:`, `lg:`, `xl:`) and logical-property utilities
  (`rtl:`, `ltr:`) are sufficient for the vast majority of responsive and RTL adaptations. Minimal
  custom CSS will be introduced only where Tailwind lacks coverage.
- The current Arabic translations (~93 keys in `ar.json`) are accurate and will be preserved.
  New keys will be added alongside existing ones.
- No new third-party dependencies are required beyond what is already installed (`i18next`,
  `react-i18next`, Tailwind CSS, Framer Motion, Radix UI).
- Backend API contracts remain unchanged; this feature is entirely a front-end concern.
- The 768 px table-to-card crossover applies globally. Individual screens do not require custom
  breakpoints.

## Screen-by-Screen Change Outline

> The following section maps every screen group to the specific responsive and localisation
> changes required. It is intended as implementation guidance for `/speckit-plan`.

### 1. Shell (AppShell, Sidebar, Topbar)

| Screen / Component | Responsive Changes | Localisation Changes |
|---|---|---|
| `AppShell` | Add breakpoint detection; control sidebar mode (pinned / overlay / drawer). Remove hardcoded `dir="rtl"` — derive from `language.store`. | Direction driven by language store. |
| `Sidebar` | Formalise 3-tier behaviour: pinned (> 1024), overlay (600–1024), full drawer (< 600). Use CSS transitions for drawer. | Extract all Arabic labels (nav items, company card text, user profile text, logout, tooltips) into i18n keys. |
| `Topbar` | Hide search bar on Mobile. Compact profile (avatar only, no name) on Mobile. Keep hamburger visible on Tablet + Mobile. | Extract all Arabic labels (search placeholder, dropdown labels, notification count tooltip). Add language toggle prominently. |
| `LangSwitcher` | Already responsive-friendly (small button). | Already wired to `useTranslation`. Ensure the label toggles correctly. |

### 2. Admin Module (15 screens)

| Screen / Component | Responsive Changes | Localisation Changes |
|---|---|---|
| `AdminDashboard` | Stat cards: 1 col → 2 col → 6 col. Action cards: 1 col → 2 col → 4 col. Map + progress orders: stack on mobile. | Extract all Arabic stat card titles, action card titles/subtitles, doughnut legends, greeting, date labels. |
| `AdminOrdersPage` | Switch table ↔ mobile card list at 768 px. | Extract headers, filter labels, status badges. |
| `AdminOrderDetailPage` | Stack detail cards vertically on mobile. | Extract all card headings, labels, button text. |
| `AdminDriversPage` | Switch table ↔ mobile card list at 768 px. | Extract headers, filter labels. |
| `AdminDriverDetailsPage` | Stack info cards on mobile. | Extract labels, stat values. |
| `AdminPetrolCompaniesPage` | Switch table ↔ mobile card list. Stats grid: 1 → 2 → 4 col. | Extract stats labels, table headers, filter text. |
| `AddPetrolCompanyPage` | Form fields full-width on mobile. | Extract form labels, button text, validation messages. |
| `AdminTransportCompaniesPage` | Switch table ↔ mobile card list. Stats grid: 1 → 2 → 4 col. | Extract stats labels, table headers, filter text. |
| `AdminTransportCompanyDetailsPage` | Stack info card and sub-cards vertically on mobile. | Extract all card headings, labels. |
| `AddTransportCompanyPage` | Form fields full-width on mobile. | Extract form labels, button text, validation messages. |
| `AdminFuelExchangePage` | Switch table ↔ card list. | Extract table headers, status labels. |
| `AdminFuelExchangeDetailPage` | Stack cards on mobile. | Extract all labels. |
| `AdminNotificationsPage` | Full-width cards on mobile. | Extract notification text, timestamps. |
| `AdminProfilePage` | Stack profile cards on mobile. | Extract all labels, headers. |
| `AdminGlobalTrackingPage` | Map full width; sidebar overlay on small screens. | Extract labels, legends. |

### 3. Petrol Company Module (11 screens)

| Screen / Component | Responsive Changes | Localisation Changes |
|---|---|---|
| `PetrolDashboard` | Same grid adaptations as AdminDashboard. | Extract all Arabic strings. |
| `OrdersListPage` | Table ↔ card list at 768 px. | Extract headers, filters, statuses. |
| `OrderDetailPage` | Stack cards on mobile. | Extract all labels. |
| `OrderEditPage` | Form full-width on mobile. | Extract form labels, buttons. |
| `OrderDriverDetailsPage` | Stack cards. | Extract labels. |
| `FuelExchangePage` | Table ↔ card list. | Extract all. |
| `FuelPricesPage` | Cards grid: 1 → 2 → 3 col. | Extract price labels, buttons. |
| `CompaniesListPage` | Card list responsive. | Extract all. |
| `CompanyDetailPage` | Stack cards. | Extract all. |
| `StationsPage` | Table / list responsive. | Extract all. |
| All sub-detail pages (Station Owner, Station Detail) | Stack cards. | Extract all. |

### 4. Transport Company Module (15 screens)

| Screen / Component | Responsive Changes | Localisation Changes |
|---|---|---|
| `TransportDashboard` | Same grid adaptations as AdminDashboard. | Extract all Arabic strings. |
| `OrdersListPage` | Table ↔ card list at 768 px. | Extract all. |
| `OrderDetailPage` | Stack cards on mobile. | Extract all. |
| `OrderEditPage` | Form full-width on mobile. | Extract all. |
| `OrderAssignPage` | Stack assign cards on mobile. | Extract all. |
| `DriversPage` | Table ↔ card list. Stats grid responsive. | Extract all. |
| `DriverDetailsPage` | Stack cards. | Extract all. |
| `AddDriverPage` | Form full-width. | Extract all. |
| `TrucksAndTanksPage` | Cards grid responsive. | Extract all. |
| `ClientsPage` | Table ↔ card list. | Extract all. |
| `InvoicesListPage` | Table ↔ card list. | Extract all. |
| `DeliveryAreasPage` | Map + list responsive. | Extract all. |
| `TrackingPage` | Map full-width; sidebar overlay on small screens. | Extract all. |
| `SettingsPage` | Form full-width. | Extract all. |
| `NotificationsPage` | Full-width cards. | Extract all. |

### 5. Shared & Auth (9 screens)

| Screen / Component | Responsive Changes | Localisation Changes |
|---|---|---|
| `LoginPage` | Centre card, full-width on mobile. | Extract all form labels, button text, errors. |
| `VerifyPage` | Same as login. | Extract all. |
| `RoleSelectionPage` | Cards stack on mobile. | Extract all. |
| `NotFound` | Full-width centred message. | Already using `t()`. Verify keys. |
| `Forbidden` | Full-width centred message. | Already using `t()`. Verify keys. |
| `FilterToolbar` | Wrap filters; collapse to dropdown on mobile. | Extract all filter labels. |
| `HelpPage` | FAQ accordion full-width. | Extract all FAQ content. |
| `TermsPage` | Terms sidebar becomes top accordion on mobile. | Extract all terms content. |
| Profile pages (all roles) | Stack cards on mobile. | Extract all labels. |
