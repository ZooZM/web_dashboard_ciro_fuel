# Spec Pointers

This repository's platform-integration work is planned and tracked entirely in the platform
repository, not here. There is no parallel `specs/` directory for these features in this repo,
by design — a parallel spec would fork the source of truth the two repositories are required
to share.

## Feature 013 — Fuel Company Admin Dashboard: Live Platform Integration

- **Spec, plan, tasks, contracts**: `ciro_fuel_backend/specs/013-fuel-company-dashboard/`
- **Branch**: `013-fuel-company-dashboard` (this branch, matching the platform repo's)
- **This repo's role**: implement the dashboard-side tasks in `tasks.md`, prefixed `web_dashboard/`

## Feature 009 — Transport Admin Dashboard: Live Order Lifecycle

- **Spec, plan, tasks, contracts**: `ciro_fuel_backend/specs/009-transport-dashboard-order-lifecycle/`
- **Branch**: `009-transport-dashboard-order-lifecycle`
- **This repo's role**: implement the dashboard-side tasks in `tasks.md`, prefixed `web_dashboard/`

Do not create a `specs/0NN-...` directory in this repository for any platform-integration
feature — it would fork the source of truth the two repos are required to share.
