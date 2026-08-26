# Implementation Tasks: Global Architecture & Refactoring

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install required dependencies: `npm install zustand axios @tanstack/react-query react-hot-toast`
- [x] T002 Create directory structure for `src/store` and `src/api`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**🛑 CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Setup React Query Provider in `src/main.tsx` (or `src/App.tsx` depending on current routing setup)
- [x] T004 Create `AuthStore` in `src/store/authStore.ts` to manage token, user details, and permissions
- [x] T005 Create `AppStore` in `src/store/appStore.ts` to manage UI states (theme, RTL)
- [x] T006 Create `SessionStore` in `src/store/sessionStore.ts` for inactivity timeouts
- [x] T007 Configure central Axios client in `src/api/apiClient.ts` with base URL and default headers

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Unauthenticated Access Attempt (Auth Logic & Guards) (Priority: P1) ⭐ MVP

**Goal**: Ensure private routes cannot be accessed without a valid token.

**Independent Test**: Navigate to `/admin` in incognito mode; verify redirection to `/login`.

### Implementation for User Story 1

- [x] T008 [US1] Implement `ProtectedRoute` HOC/Wrapper in `src/components/auth/ProtectedRoute.tsx`
- [x] T009 [US1] Apply `ProtectedRoute` to all admin and petrol company routes in the main router configuration
- [x] T010 [US1] Integrate `react-hot-toast` to show a "Please login" toast upon unauthorized redirection

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - API Request with Expired Token (Priority: P2)

**Goal**: Automatically handle expired tokens during API requests and force logout.

**Independent Test**: Manually set an expired token in LocalStorage and trigger an API call; verify redirection to `/login`.

### Implementation for User Story 2

- [x] T011 [US2] Add request interceptor in `src/api/apiClient.ts` to inject the Bearer token from `AuthStore`
- [x] T012 [US2] Add response interceptor in `src/api/apiClient.ts` to catch 401 errors
- [x] T013 [US2] Implement logic in the response interceptor to call `logout()` from `AuthStore` and trigger a toast notification

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Navigating to a Data-Heavy Page (Priority: P3)

**Goal**: Integrate React Query for data fetching with proper loading skeletons to prevent UI blocking.

**Independent Test**: Throttle network speed, navigate to Invoices page, and observe the skeleton loader instead of a frozen UI.

### Implementation for User Story 3

- [x] T014 [US3] Create a reusable `Skeleton` component (or use existing UI library) in `src/components/ui/Skeleton.tsx`
- [x] T015 [US3] Refactor an existing data-heavy component (e.g., `InvoicesListPage.tsx`) to fetch data using `useQuery` from React Query
- [x] T016 [US3] Replace legacy loading states with the new React Query `isLoading` and `Skeleton` component

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T017 Audit and remove unused imports across `src/admin` and `src/petrol_company`
- [x] T018 Apply `useMemo` and `useCallback` to expensive calculations in `InvoicesListPage.tsx` and related components
- [x] T019 Run quickstart.md validation scenarios to ensure end-to-end functionality

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2)
