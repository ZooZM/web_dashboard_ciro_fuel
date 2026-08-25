# Goal Description
Implement the Admin Transport Companies and Drivers pages, matching the provided UI designs, and reusing existing components where applicable.

## Open Questions
- Where should the "السائقين" (Drivers) page be accessible from? Should I add a "السائقين" link to the Admin sidebar, or should it be accessed from inside the Transport Company details page?

## Proposed Changes

### `router.tsx`
- **[MODIFY]** Map the following new routes in the Admin section:
  - `/admin/transport-companies` -> `AdminTransportCompaniesPage`
  - `/admin/transport-companies/add` -> `AddTransportCompanyPage`
  - `/admin/transport-companies/:id` -> `AdminTransportCompanyDetailsPage`
  - `/admin/drivers` -> `AdminDriversPage` (Assuming a global drivers list for Admin)

### `src/components/layout/Sidebar.tsx`
- **[MODIFY]** Add a NavItem for "السائقين" (Drivers) in the Admin sidebar, so the user can reach the Drivers page (image 12).

### `src/admin/transport_companies/components/AdminTransportCompaniesPage.tsx`
- **[NEW]** Create the main transport companies list page (image 9).
- Reuses existing list patterns.
- Includes a stats header (Companies, Active Transporters, Monthly Orders, Covered Areas).
- Uses the provided `blueTruck.svg` and `orangeTruck.svg` icons.

### `src/admin/transport_companies/components/AddTransportCompanyPage.tsx`
- **[NEW]** Create the add transport company form (image 11).
- Includes the side panel with "ملخص الحساب", "تسجيل الدخول", and "الخطوات التالية بعد الإنشاء".
- Reuses form layout patterns from `petrol_company/companies/components/AddTransporterPage.tsx`.

### `src/admin/transport_companies/components/AdminTransportCompanyDetailsPage.tsx`
- **[NEW]** Create the transport company details dashboard (image 10).
- Includes Stats row (Areas, Orders, Avg Time, Rating).
- Includes "معلومات الشركة" (Company Info), "معلومات التواصل" (Contact Info), "المناطق المغطاة" (Covered Areas), and "سجل الرحلات الأخيرة" (Recent Trips).
- Uses the provided `filledTruck.svg`, `pin.svg`, and `order.svg` icons.

### `src/admin/drivers/components/AdminDriversPage.tsx`
- **[NEW]** Create the Drivers list page (image 12).
- Reuses the existing `DriversPage` layout from `transport_company`.
- Includes stats (Total, Active, Inactive, On Duty).

## Verification Plan
1. Start the React dev server.
2. Navigate to `/admin/transport-companies` and verify the list renders and stats appear correctly.
3. Click to add a company and verify the layout matches `image_11`.
4. Click on a company details page and verify the widgets and layout match `image_10`.
5. Navigate to the new Drivers link and verify it matches `image_12`.
