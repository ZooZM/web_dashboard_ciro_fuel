# Quickstart: Responsive Design & Localization Validation

**Feature**: `004-responsive-localization`
**Date**: 2026-08-25

## Prerequisites

- Node 20 LTS
- Local development server running

## Setup & Run

1. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```
2. Open the application in your browser (default: `http://localhost:5173`).

## Validation Scenarios

### 1. Language Toggle & RTL Layout

1. **Initial Load**: Observe the application loads in Arabic by default. The layout should be Right-to-Left (RTL) — sidebar on the right, text right-aligned.
2. **Toggle to English**: Click the Language Toggle (`AR/EN` or Globe icon) in the Topbar.
3. **Verify LTR**: The application should instantly switch to English. The layout must flip to Left-to-Right (LTR) — sidebar on the left, text left-aligned, and navigation chevrons mirrored.
4. **Persistence**: Refresh the page. Verify the application remains in English.

### 2. Sidebar Responsiveness

1. **Desktop (> 1024px)**: Ensure window width is > 1024px. Verify the sidebar is permanently visible and pinned. Click the menu toggle to verify it collapses to an icon-only rail.
2. **Tablet (600px - 1024px)**: Resize the window to ~800px. Verify the sidebar hides and a hamburger menu appears in the Topbar. Click the hamburger to open the sidebar as an overlay with a backdrop. Click the backdrop to close it.
3. **Mobile (< 600px)**: Resize the window to ~400px. Verify the hamburger menu opens the sidebar as a full-width (or near full-width) drawer overlay.

### 3. Dashboard Grid Responsiveness

1. Navigate to the **Admin Dashboard** (or Transport/Petrol Dashboard).
2. **Desktop**: Verify stat cards display in a multi-column grid (e.g., 6 columns).
3. **Tablet**: Resize to ~800px. Verify stat cards wrap to a 2-column grid.
4. **Mobile**: Resize to ~400px. Verify stat cards stack in a single vertical column.

### 4. Data Tables to Card Lists

1. Navigate to the **Orders** or **Drivers** page.
2. **Desktop (> 768px)**: Verify the data is displayed in a standard tabular format.
3. **Mobile (≤ 768px)**: Resize the window below 768px. Verify the table is replaced by a vertical list of cards, retaining all critical information without horizontal scrolling.

### 5. Detail & Form Pages Stacking

1. Navigate to an **Order Details** page.
2. **Desktop**: Verify information cards (e.g., Map, Timeline, Order Data) are displayed in a side-by-side or complex grid layout.
3. **Mobile**: Resize the window to ~400px. Verify all cards stack vertically in a single column to prevent horizontal scrolling.

### 6. Automated Code Quality Checks

Run the linter to ensure all `useTranslation` keys are properly utilized and no raw literal strings violate the `i18next/no-literal-string` rules.

```bash
npm run lint
npm run test
```
