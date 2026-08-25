# Implementation Plan: Global Responsive Design & Localization

**Branch**: `004-responsive-localization` | **Date**: 2026-08-25 | **Spec**: [spec.md](specs/004-responsive-localization/spec.md)

**Input**: Feature specification from `specs/004-responsive-localization/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Upgrade all 210 TSX components in the Ciro Fuel Web Dashboard to be fully bilingual
(Arabic/English) and responsive across Mobile (<600 px), Tablet (600–1024 px), and Desktop
(>1024 px). The project already has partial i18next integration (~20/210 components, ~93 keys per
language) and rudimentary mobile sidebar detection. This plan extends that foundation to
full coverage without introducing new dependencies.

## Technical Context

**Language/Version**: TypeScript ~6.0.2 / React 18.3.1

**Primary Dependencies**: Vite 8.1.1, Tailwind CSS 3.4.19 (with native logical-property utilities),
Framer Motion 13.1.0, Radix UI (dialog, direction, select, toast, label, slot), React Router 6.30.4,
i18next 26.3.6, react-i18next 17.0.10, Zustand 5.0.14, @tanstack/react-query 5.101.3,
@tanstack/react-table 8.21.3, Axios 1.18.1

**Storage**: N/A (front-end only; language persisted in localStorage)

**Testing**: Vitest 4.1.10 (unit/component), Playwright 1.61.1 (E2E), vitest-axe for a11y

**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge) — desktop, tablet, mobile

**Project Type**: web-service (SPA dashboard — React + Vite)

**Performance Goals**: Language switch < 300 ms, no layout reflow during resize

**Constraints**: Zero new third-party dependencies. Safe refactoring — no structural changes to
existing components.

**Scale/Scope**: 210 TSX files across 45 directories, 3 role modules (Admin: 15 screens,
Petrol Company: 11 screens, Transport Company: 15 screens) + shared/auth (9 screens)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | Component-Driven UI | ✅ PASS | No monolithic refactoring. Responsive behaviour added via Tailwind utilities on existing components. New shared hooks (`useBreakpoint`) follow hook composition pattern. |
| II | State Management | ✅ PASS | Language remains in Zustand (`language.store`). No server state mixing. Layout breakpoint state stays in existing `layout.store`. |
| III | Testing Strategy | ✅ PASS | Existing tests must not regress (SC-008). New responsive/i18n behaviour tested via Vitest + RTL. |
| IV | Type Safety | ✅ PASS | Translation keys typed via i18next module augmentation. `Language` and `Direction` types already exist. No `any` introduced. |
| V | Code Quality | ✅ PASS | `eslint-plugin-i18next` already in devDeps — enforces `no-literal-string`. All changes must pass lint+format gate. |
| — | Architecture: i18n | ✅ PASS | Constitution mandates i18next + react-i18next with translation keys; this feature fulfils that mandate. |
| — | Architecture: No new deps | ✅ PASS | No new npm packages required. |

**Gate result**: ALL PASS — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/004-responsive-localization/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── providers.tsx          # DirectionProvider already wired
│   ├── router.tsx             # Lazy routes
│   └── query-client.ts
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx       # MODIFY: breakpoint detection, dynamic dir
│   │   ├── Sidebar.tsx        # MODIFY: 3-tier responsive, i18n labels
│   │   ├── Topbar.tsx         # MODIFY: responsive compact, i18n labels
│   │   └── LangSwitcher.tsx   # VERIFY: already functional
│   └── ui/                    # MODIFY: i18n labels in FilterToolbar, dialog, etc.
├── lib/
│   ├── i18n/
│   │   ├── i18n.ts            # VERIFY: config already correct
│   │   ├── ar.json            # MODIFY: expand from ~93 to ~600+ keys
│   │   └── en.json            # MODIFY: expand from ~93 to ~600+ keys
│   └── rtl/
│       └── direction.ts       # VERIFY: syncDocumentDirection already correct
├── stores/
│   ├── language.store.ts      # VERIFY: already functional
│   └── layout.store.ts        # MODIFY: add breakpoint state + useBreakpoint hook
├── hooks/
│   └── useBreakpoint.ts       # NEW: centralised breakpoint detection hook
├── admin/                     # MODIFY: 15 screen groups — i18n + responsive
├── petrol_company/            # MODIFY: 11 screen groups — i18n + responsive
├── transport_company/         # MODIFY: 15 screen groups — i18n + responsive
├── auth/                      # MODIFY: login, verify — i18n + responsive
├── routing/                   # VERIFY: NotFound, Forbidden already use t()
└── constants/
    └── order-status.ts        # VERIFY: Language/Direction types present
```

**Structure Decision**: Single-project front-end SPA. No structural changes to directory layout.
All modifications are in-place additions of responsive classes and i18n key references.

## Complexity Tracking

> No Constitution violations found — this section is intentionally empty.
