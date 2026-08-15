# Web Admin Dashboard

React 18 + Vite + TypeScript dashboard for the two platform admin personas — `SUPER_ADMIN`
(platform owner) and `COMPANY_ADMIN` (tenant admin) — of the multi-tenant B2B fuel delivery
SaaS. Consumes the feature-001 NestJS backend (`/api/v1`).

See [`specs/003-web-admin-dashboard/`](../specs/003-web-admin-dashboard/) for the full spec,
plan, research decisions, data model, and contracts.

## Prerequisites

- Node 20 LTS
- The feature-001 backend running and reachable, with `/auth/refresh` issuing the refresh
  token as an `httpOnly; Secure; SameSite=Strict` cookie (see
  [`../specs/003-web-admin-dashboard/research.md`](../specs/003-web-admin-dashboard/research.md) R1)
  and CORS configured to allow this origin with credentials.

## Setup

```bash
cp .env.example .env   # set VITE_API_BASE_URL
npm install
```

## Run

```bash
npm run dev          # Vite dev server (http://localhost:5173)
npm run build         # type-check (tsc -b) + production build
npm run preview        # preview the production build
```

## Test

```bash
npm run test           # Vitest unit/component tests (MSW-mocked, no backend needed)
npm run test:watch     # Vitest watch mode
npm run test:e2e       # Playwright E2E — requires a live backend + seeded accounts
                        #   (E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD env vars, etc. — see tests/e2e/)
```

## Lint & format

```bash
npm run lint            # ESLint (includes i18next/no-literal-string on features/**)
npm run lint:fix
npm run lint:no-index   # fails if a root-level barrel index.ts/tsx exists under src/
npm run format          # Prettier
```

## Structure

Feature-Based Architecture under `src/features/{auth,orders,companies,drivers,clients,settings}`,
each owning its own `api/`, `hooks/`, `components/`, and `types.ts`. Cross-cutting concerns
(Axios client + single-flight refresh, i18n/RTL, session store, route guards) live in
`src/lib/`, `src/stores/`, and `src/routing/`. Entry point is `src/main.tsx`.
