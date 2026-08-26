# Global Architecture Refactoring & Application Specs

## 1. State Management & Architecture
- **Global State**: We use **Zustand** for global state management due to its minimal boilerplate, lack of context providers, and easy integration with React hooks without causing unnecessary re-renders.
- **Global States**:
  - `AuthStore`: Manages JWT, User Details, and Roles.
  - `AppStore`: Manages UI states like Theme (Dark/Light) and Layout direction (RTL/LTR).
  - `SessionStore`: Tracks user activity and handles inactivity timeouts.

## 2. API Integration & Data Handling
- **API Client**: A centralized **Axios** client setup (`apiClient.ts`) handles default headers, base URLs, and interceptors.
- **Interceptors**: 
  - *Request Interceptor* injects the Bearer token into all requests.
  - *Response Interceptor* catches `401 Unauthorized` errors to trigger a global logout and show an error toast.
- **Data Fetching**: **React Query** (`@tanstack/react-query`) is used for caching, background updates, and handling loading/error states out of the box.
- **Loading & Error**: We rely on global `Skeleton` loaders for initial fetches and `react-hot-toast` for API errors.

## 3. Routing & Auth Guards
- **React Router**: Application uses `react-router-dom` for declaring routes.
- **Auth Guards**: A `<ProtectedRoute>` component wraps private routes, verifying the `AuthStore` state. Unauthenticated users are safely redirected to the Login page.

## 4. Code Optimization & Refactoring
- Identify and remove unused imports across all domain folders.
- Apply `useMemo` and `useCallback` on heavy data manipulation tasks (e.g., in `InvoicesListPage.tsx`) to avoid useless re-renders.
- Refactor prop drilling by tapping directly into the Zustand stores where appropriate, while strictly preserving visual UI and file structure.

---

## Google Maps Integration
**Goal**: Replace all static mock images representing maps with dynamic Google Maps using the `@react-google-maps/api` package.

1. **Dependency Installation**:
   - Install `@react-google-maps/api`.
   
2. **Environment Variables**:
   - Configure `.env` to hold the Google Maps API key (e.g., `VITE_GOOGLE_MAPS_API_KEY`).
   - The application must validate this key on initialization.

3. **Reusable Component**:
   - Create a reusable `<CustomGoogleMap />` component.
   - **Critical Rule**: The new component MUST keep the exact same UI dimensions and layout structure as the mock images it replaces to prevent layout shifts or breaking the design.
   - Support passing standard map options (center coordinates, zoom level, markers).

4. **Implementation Strategy**:
   - Find all static map images across the admin and company dashboards.
   - Drop in `<CustomGoogleMap />` as a direct replacement.
   - Inject dynamic latitude/longitude properties from the respective entities.
