# Implementation Plan: Global Architecture & Refactoring

**Branch**: `005-global-architecture-refactor` | **Date**: 2026-08-26 | **Spec**: [spec.md](../spec.md)

**Input**: Feature specification from `/specs/005-global-architecture-refactor/spec.md`

## Summary

Establish a solid architectural foundation by integrating Zustand for global state, Axios for API handling, and React Router auth guards, while simultaneously optimizing the existing codebase to improve performance without altering the visual UI.

## Technical Context

**Language/Version**: TypeScript / React 18 / Vite

**Primary Dependencies**: Zustand, Axios, React Query (@tanstack/react-query), React Router DOM, TailwindCSS

**Storage**: LocalStorage (for JWT/Auth tokens)

**Testing**: N/A for this phase (Visual Regression / Manual testing)

**Target Platform**: Web Browser

**Project Type**: Web Application Dashboard

**Performance Goals**: Reduce unnecessary re-renders, improve data fetching efficiency, avoid UI blocking.

**Constraints**: Existing UI components and file structures must be completely preserved.

**Scale/Scope**: Entire application architecture (State, API, Routing).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No constitution file found, assuming standard React/Vite best practices. 

## Project Structure

### Documentation (this feature)

```text
specs/005-global-architecture-refactor/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (to be generated)
```

### Source Code (repository root)

```text
src/
├── store/                  # NEW: Zustand stores
│   ├── authStore.ts
│   ├── sessionStore.ts
│   └── appStore.ts
├── api/                    # NEW: API client and queries
│   ├── apiClient.ts
│   └── queries/
├── components/
│   ├── auth/               # NEW/UPDATED: Auth guards
│   │   └── ProtectedRoute.tsx
│   └── ui/
├── routes/                 # UPDATED: React router configuration
├── admin/                  # REFACTORED: Optimization
└── petrol_company/         # REFACTORED: Optimization
```

**Structure Decision**: A standard scalable React structure adding `/store` and `/api` directories to handle global concerns, while preserving the existing domain-driven folders (`admin`, `petrol_company`).

## Complexity Tracking

No violations.
