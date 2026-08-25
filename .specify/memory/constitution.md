<!--
Sync Impact Report
Version: 0.0.0 -> 1.0.0
Modified Principles:
- I. Component-Driven UI
- II. State Management
- III. Testing Strategy
- IV. Type Safety
- V. Code Quality & Formatting
Added Sections:
- Architecture & Standards
- Development Workflow
Deferred Items: None
-->

# Ciro Fuel Web Dashboard Constitution

## Core Principles

### I. Component-Driven UI
Build isolated, reusable components using Radix UI and Tailwind CSS. Avoid monolithic pages. Ensure all components are accessible and follow a consistent design system.

### II. State Management
Use React Query (`@tanstack/react-query`) for server state and data fetching. Use Zustand for global client state. Keep component state local whenever possible to prevent unnecessary re-renders.

### III. Testing Strategy
Use Vitest for unit and integration tests, and Playwright for End-to-End (E2E) tests. Focus on testing user workflows and critical paths over implementation details. Test files must be colocated with their respective components.

### IV. Type Safety
Strict TypeScript mode is mandatory. Avoid the use of `any` or `ts-ignore`. Use Zod for runtime validation of external API data and form inputs.

### V. Code Quality & Formatting
Enforce ESLint, Oxlint, and Prettier on all code. Ensure no unused variables or unresolved imports exist. Code must pass `npm run lint` and `npm run format` without warnings before being merged.

## Architecture & Standards

- **Framework**: React 18 with Vite for fast builds and hot module replacement.
- **Styling**: Tailwind CSS combined with Class Variance Authority (CVA) and `tailwind-merge` for scalable and reusable utility classes.
- **Data Fetching & API**: Axios configured with interceptors, integrated with React Query for caching and synchronization.
- **Forms**: React Hook Form for state management, coupled with Zod for schema-based validation.
- **Internationalization**: `i18next` with `react-i18next` for managing translations.
- **Icons**: `lucide-react` and `react-icons`.

## Development Workflow

- **Local Development**: Run `npm run dev` for the local server.
- **Pre-commit Checks**: Run `npm run lint` and `npm run test` before creating any pull requests.
- **Build Verification**: Ensure `npm run build` completes successfully.
- **Formatting**: Rely on Prettier for consistent code formatting across the repository.

## Governance

This Constitution acts as the primary source of truth for architectural and process decisions in the Ciro Fuel Web Dashboard.
- All Pull Requests must verify compliance with these core principles.
- Introducing new major dependencies or architectural patterns requires an amendment to this Constitution.
- Complexity must always be justified; favor simplicity and readability.

**Version**: 1.0.0 | **Ratified**: 2026-08-25 | **Last Amended**: 2026-08-25
