import { createBrowserRouter } from 'react-router-dom';
import { Role } from '@/constants/roles';
import { ProtectedRoute } from '@/routing/ProtectedRoute';
import { Forbidden } from '@/routing/Forbidden';
import { NotFound } from '@/routing/NotFound';
import { RoleHome } from '@/routing/RoleHome';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/features/auth/components/LoginPage';
import { OrdersListPage } from '@/features/orders/components/OrdersListPage';
import { InvoicesListPage } from '@/features/invoices/components/InvoicesListPage';
import { TrackingPage } from '@/features/tracking/components/TrackingPage';
import { OrderDetailPage } from '@/features/orders/components/OrderDetailPage';
import { OrderEditPage } from '@/features/orders/components/OrderEditPage';
import { DriversPage } from '@/features/drivers/components/DriversPage';
import { DriverDetailsPage } from '@/features/drivers/components/driver-details/DriverDetailsPage';
import { ClientsPage } from '@/features/clients/components/ClientsPage';
import { SettingsPage } from '@/features/settings/components/SettingsPage';
import { ProfilePage } from '@/features/profile/components/ProfilePage';
import { TermsPage } from '@/features/terms/components/TermsPage';
import { HelpPage } from '@/features/help/components/HelpPage';
import { CompaniesListPage } from '@/features/companies/components/CompaniesListPage';
import { CompanyDetailPage } from '@/features/companies/components/CompanyDetailPage';
import { OnboardCompanyPage } from '@/features/companies/components/OnboardCompany';
import { PlatformOrdersPage } from '@/features/companies/components/PlatformOrders';
import { NotificationsPage } from '@/features/notifications/components/NotificationsPage';

export const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/403', element: <Forbidden /> },
  {
    element: <AppShell />,
    children: [
      { path: '/home', element: <RoleHome /> },
      { path: '/notifications', element: <NotificationsPage /> },
      {
        element: <ProtectedRoute allow={[Role.SUPER_ADMIN]} />,
        children: [
          { path: '/companies', element: <CompaniesListPage /> },
          { path: '/companies/new', element: <OnboardCompanyPage /> },
          { path: '/companies/:id', element: <CompanyDetailPage /> },
          { path: '/platform-orders', element: <PlatformOrdersPage /> },
        ],
      },
      {
        // element: <ProtectedRoute allow={[Role.COMPANY_ADMIN, Role.SUPER_ADMIN, Role.DRIVER]} />,
        children: [
          { path: '/orders', element: <OrdersListPage /> },
          { path: '/orders/:id', element: <OrderDetailPage /> },
          { path: '/orders/:id/edit', element: <OrderEditPage /> },
          { path: '/tracking', element: <TrackingPage /> },
          { path: '/invoices', element: <InvoicesListPage /> },
          { path: '/drivers', element: <DriversPage /> },
          { path: '/drivers/:id', element: <DriverDetailsPage /> },
          { path: '/clients', element: <ClientsPage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/terms', element: <TermsPage /> },
          { path: '/help', element: <HelpPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

// Trigger TS Language Server refresh - 2
