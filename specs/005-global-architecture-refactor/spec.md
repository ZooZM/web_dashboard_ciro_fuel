# Specification: Global Architecture & Refactoring

## 1. Overview
The goal of this feature is to establish a solid architectural foundation for the `web_dashboard_ciro_fuel` React project. This includes integrating real business logic, robust global state management, centralized API handling, and auth guards, while simultaneously optimizing and refactoring the existing codebase to improve performance. 

**Critical Constraint**: All existing UI components and file structures must be preserved. No deletions are permitted; refactoring is strictly limited to logic injection, cleanup, and optimization.

## 2. Phased Approach

### Phase 1: Global Setup & Router
- **State Management**: Establish Zustand as the global state management solution. It is lightweight, reduces boilerplate compared to Redux, and integrates seamlessly with React hooks without causing unnecessary re-renders.
- **Global States**: Define stores for `AuthStore` (token, user details, permissions), `SessionStore` (active session data, inactivity timeouts), and `AppStore` (theme, localization/RTL status, global settings).
- **Routing Setup**: Review the current `react-router-dom` configuration to ensure it supports nested layouts and programmatic navigation efficiently.

### Phase 2: Auth Logic & Guards
- **Protected Routes**: Implement higher-order components (HOCs) or wrapper components (e.g., `<ProtectedRoute />`) to guard routes that require authentication.
- **Redirection**: Automatically redirect unauthenticated users to the Login page, while preserving the intended destination URL for post-login redirection.
- **Role-Based Access Control (RBAC)**: Ensure the router can restrict access based on user roles (e.g., Admin vs. specific Petrol Company roles).

### Phase 3: API Integration & Data Handling
- **API Client**: Set up a centralized API client using Axios (`apiClient.ts`) configured with base URLs, request/response interceptors, and automatic token injection (Bearer token).
- **Data Fetching**: Integrate `@tanstack/react-query` (React Query) for robust data fetching, caching, synchronization, and background updates.
- **Global States (UI)**: Implement global loading states (e.g., skeletons or a global spinner context) and global error handling. Unhandled API errors should trigger toast notifications using a library like `react-hot-toast` or `sonner`.

### Phase 4: Component Logic & Refactoring
- **Code Optimization**: Audit the codebase for unused imports, dead code, and redundant states.
- **Performance**: Introduce `useMemo` and `useCallback` where expensive calculations or function recreations cause unnecessary re-renders (especially in large lists or tables).
- **Prop Drilling**: Replace deep prop drilling with Zustand stores or React Context where appropriate to simplify component signatures.
- **Preservation Rule**: Apply these optimizations strictly without altering the visual output or deleting UI files.

## 3. User Scenarios
- **Scenario 1: Unauthenticated Access Attempt**
  - Given an unauthenticated user attempts to access `/admin/profile`.
  - When the router processes the request.
  - Then the user is redirected to `/login` and a toast notification informs them to log in.
- **Scenario 2: API Request with Expired Token**
  - Given a user is logged in but their token has expired.
  - When the application makes a data fetching request via Axios.
  - Then the response interceptor catches the 401 error, attempts a token refresh (if applicable), or clears the AuthStore and redirects to `/login`.
- **Scenario 3: Navigating to a Data-Heavy Page**
  - Given a user navigates to the Invoices list.
  - When the page loads.
  - Then a skeleton loader is displayed until React Query resolves the data, preventing UI blocking.

## 4. Functional Requirements
- **FR1**: The application MUST use Zustand for global state management.
- **FR2**: Axios MUST be configured with an interceptor to attach the JWT token to all outbound API requests.
- **FR3**: React Router MUST include a protected route mechanism that verifies the `AuthStore` state before rendering private components.
- **FR4**: All refactoring MUST pass visual regression checks, ensuring no UI elements are removed or broken.
- **FR5**: React Query MUST be used for server state to handle caching and loading states natively.

## 5. Success Criteria
- **Architecture**: Global state (Zustand) and API client (Axios + React Query) are successfully integrated and functional.
- **Security**: 100% of private routes are inaccessible to unauthenticated users.
- **Performance**: React Profiler shows a reduction in unnecessary re-renders, specifically in data-heavy components.
- **Code Quality**: Unused imports and dead code are cleaned up across the main feature directories without loss of UI fidelity.

## 6. Key Entities
- **AuthStore**: Manages JWT, User Profile, Roles.
- **AppStore**: Manages UI state (Theme, Direction).
- **Axios Interceptor**: Middleware for API requests/responses.
- **ProtectedRoute**: Router component for auth verification.

## 7. Assumptions
- The backend API provides standard RESTful endpoints and uses JWT for authentication.
- The existing UI components are structurally sound enough to be refactored without requiring complete rewrites.
