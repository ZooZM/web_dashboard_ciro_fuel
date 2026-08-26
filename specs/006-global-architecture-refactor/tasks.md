# Implementation Tasks: Global Architecture & Google Maps Integration

## Phase 1-6: Global Architecture Refactoring
**Status**: COMPLETE
*Note: The global architecture tasks (Zustand, Axios, React Query, Auth Guards) were completed under the previous phase.*

---

## Phase 7: Google Maps Integration

**Purpose**: Replace all static map mockups with dynamic Google Maps using `@react-google-maps/api`.

- [x] T001 Install required dependencies: `npm install @react-google-maps/api`
- [x] T002 Configure `.env` file to include `VITE_GOOGLE_MAPS_API_KEY` (if not already present).
- [x] T003 Create `CustomGoogleMap` component in `src/components/ui/CustomGoogleMap.tsx` that supports the `className` prop for UI consistency.
- [x] T004 Refactor `MapCard` in `src/petrol_company/orders/components/order-details/MapCard.tsx` to use `CustomGoogleMap`.
- [x] T005 Refactor `MapCard` in `src/transport_company/orders/components/order-details/MapCard.tsx` to use `CustomGoogleMap`.
- [x] T006 Refactor `AssignMapCard` in `src/transport_company/orders/components/assign-driver/AssignMapCard.tsx`.
- [x] T007 Refactor `TrackingMapCard` in `src/transport_company/tracking/components/TrackingMapCard.tsx`.
- [x] T008 Refactor `DriverMapCard` in `src/transport_company/drivers/components/driver-details/DriverMapCard.tsx`.
- [x] T009 Refactor `MapTrackingCard` in `src/transport_company/home/components/MapTrackingCard.tsx`.
- [x] T010 Refactor map widget in `src/petrol_company/dashboard/components/PetrolDashboard.tsx`.
- [x] T011 Verify UI dimensions and layout stability across all updated map cards.
