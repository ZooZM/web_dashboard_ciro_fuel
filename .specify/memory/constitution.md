<!--
Sync Impact Report
Version: 1.0.0 -> 1.1.0
Bump Rationale: MINOR — Expanded Governance section with amendment procedure, versioning policy,
  and compliance review expectations; added Rationale sub-notes to each principle; strengthened
  declarative language (MUST/SHOULD); added explicit amendment process and quarterly review cadence.
Modified Principles:
  - I. Component-Driven UI     (added MUST/SHOULD rationale, accessibility clause, layer taxonomy)
  - II. State Management       (added MUST/SHOULD rationale, cache invalidation guidance)
  - III. Testing Strategy      (added MUST/SHOULD rationale, colocation enforcement)
  - IV. Type Safety            (added MUST/SHOULD rationale, z.infer<> derivation rule)
  - V. Code Quality & Formatting (added MUST/SHOULD rationale, explicit lint/format gate)
Modified Sections:
  - Architecture & Standards   (routing layer added, i18n literal-string rule added)
  - Development Workflow       (E2E gate added, format-on-commit rule added)
  - Governance                 (significantly expanded: amendment, versioning, compliance review)
Added Sections: None
Removed Sections: None
Deferred Items: None
-->

# Ciro Fuel Web Dashboard Constitution

## Core Principles

### I. Component-Driven UI

All UI MUST be built as isolated, reusable components using Radix UI primitives and Tailwind CSS.
Monolithic page-level components are prohibited. Every component MUST:
- Be accessible (WCAG 2.1 AA minimum; Radix handles most primitives automatically).
- Belong to a coherent layer: `ui/` (atoms), `components/` (molecules), `features/` (organisms).
- Receive data via props only; side-effects are confined to custom hooks or data-fetching layers.

*Rationale*: Isolation enables independent testing and design-system evolution without cascading
regressions.

### II. State Management

Server state MUST be managed exclusively through React Query (`@tanstack/react-query`).
Global client state MUST use Zustand; local component state MUST stay local (useState/useReducer).
Mixing state domains (e.g., caching server data in Zustand) is prohibited.
Cache invalidation SHOULD be triggered by mutation callbacks (`onSuccess`/`onSettled`), not
manual store clearing.

*Rationale*: Clear domain boundaries eliminate stale-data bugs and reduce cognitive overhead when
tracing data flow.

### III. Testing Strategy

All features MUST have unit/integration tests written with Vitest before a PR is opened.
E2E tests via Playwright MUST cover every critical user workflow (auth, fuel ordering, billing).
Test files MUST be colocated with the source component they exercise (e.g., `Foo.test.tsx`
alongside `Foo.tsx`). Testing implementation details (internal state, refs) is prohibited;
test observable behaviour only.

*Rationale*: Colocated tests reduce discovery friction; behaviour-focused tests survive refactors
without becoming maintenance debt.

### IV. Type Safety

Strict TypeScript mode is mandatory across the entire repository (`"strict": true` in tsconfig).
The use of `any`, `@ts-ignore`, or `@ts-expect-error` (without a documented justification
comment) is prohibited. All external API responses and form inputs MUST be validated at runtime
using Zod schemas; inferred TypeScript types MUST be derived from those schemas (`z.infer<>`).

*Rationale*: End-to-end type coverage surfaces contract violations at compile time, not in
production.

### V. Code Quality & Formatting

All code MUST pass `npm run lint` (ESLint + Oxlint) and `npm run format` (Prettier) with zero
warnings or errors before merge. Unused variables, dead imports, and unresolved module references
are prohibited. Formatting MUST be delegated entirely to Prettier; manual style deviations are
not permitted.

*Rationale*: Automated enforcement removes style debates and ensures the diff surface in PRs
contains only meaningful changes.

## Architecture & Standards

- **Framework**: React 18 with Vite for fast incremental builds and hot module replacement.
- **Styling**: Tailwind CSS combined with Class Variance Authority (CVA) and `tailwind-merge`
  for composable, scalable utility classes.
- **Data Fetching & API**: Axios configured with interceptors (auth token refresh, error
  normalisation), integrated with React Query for caching and background synchronisation.
- **Forms**: React Hook Form for controlled field state, with Zod schemas providing declarative
  validation rules.
- **Internationalization**: `i18next` + `react-i18next`; all user-visible strings MUST use
  translation keys — no literal strings in JSX.
- **Icons**: `lucide-react` (primary) and `react-icons` (supplementary).
- **Routing**: React Router v6 with lazy-loaded route components to minimise initial bundle size.

## Development Workflow

- **Local Development**: `npm run dev` starts the Vite dev server at `http://localhost:5173`.
- **Pre-PR Checklist**: `npm run lint` → `npm run test` → `npm run build` MUST all pass before
  opening a pull request.
- **Formatting Gate**: `npm run format` MUST be run (or Prettier integrated in the editor on
  save) before committing. CI will reject unformatted code.
- **E2E**: `npm run test:e2e` requires a live backend with seeded accounts; run locally before
  targeting staging.

## Governance

This Constitution is the primary source of truth for all architectural and process decisions in
the Ciro Fuel Web Dashboard. It supersedes any conflicting guidance in comments, wikis, or
informal agreements.

### Amendment Procedure

1. Open a PR that modifies `.specify/memory/constitution.md` only (no source changes bundled).
2. State the version bump type (MAJOR / MINOR / PATCH) and rationale in the PR description.
3. Obtain approval from at least one other team member before merging.
4. For MAJOR amendments (principle removals or redefinitions), a migration plan addressing
   existing non-compliant code MUST be included in the same PR.

### Versioning Policy

Constitution versions follow Semantic Versioning:
- **MAJOR**: Backward-incompatible governance changes — removal or redefinition of a principle.
- **MINOR**: New principle, new section, or materially expanded guidance.
- **PATCH**: Clarifications, wording fixes, typo corrections, non-semantic refinements.

### Compliance Review

- All Pull Requests MUST be reviewed for compliance with the Core Principles.
- Introducing a new major dependency (one that replaces an existing architectural concern) or a
  new architectural pattern MUST be preceded by a Constitution amendment.
- Complexity MUST be justified; favour simplicity and readability in every design decision.
- A quarterly lightweight review SHOULD be scheduled to assess whether current principles remain
  relevant and actionable as the product evolves.

**Version**: 1.1.0 | **Ratified**: 2026-08-25 | **Last Amended**: 2026-08-25
