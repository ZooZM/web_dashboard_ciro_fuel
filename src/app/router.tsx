import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Role } from '@/constants/roles';
import { ProtectedRoute } from '@/routing/ProtectedRoute';
import { Forbidden } from '@/routing/Forbidden';
import { NotFound } from '@/routing/NotFound';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/auth/components/LoginPage';
import { VerifyPage } from '@/auth/components/VerifyPage';
import { RoleSelectionPage } from '@/auth/components/RoleSelectionPage';

// Transport imports
import { TransportDashboard } from '@/transport_company/dashboard/components/TransportDashboard';
// Petrol imports
import { PetrolDashboard } from '@/petrol_company/dashboard/components/PetrolDashboard';
import { OrdersListPage } from '@/transport_company/orders/components/OrdersListPage';
import { InvoicesListPage } from '@/transport_company/invoices/components/InvoicesListPage';
import { TrackingPage } from '@/transport_company/tracking/components/TrackingPage';
import { OrderDetailPage } from '@/transport_company/orders/components/OrderDetailPage';
import { OrderEditPage } from '@/transport_company/orders/components/OrderEditPage';
import { DriversPage } from '@/transport_company/drivers/components/DriversPage';
import { DriverDetailsPage } from '@/transport_company/drivers/components/driver-details/DriverDetailsPage';
import { ClientsPage } from '@/transport_company/clients/components/ClientsPage';
import { SettingsPage } from '@/transport_company/settings/components/SettingsPage';
import { ProfilePage } from '@/transport_company/profile/components/ProfilePage';
import { TermsPage } from '@/transport_company/terms/components/TermsPage';
import { HelpPage } from '@/transport_company/help/components/HelpPage';
import { CompaniesListPage } from '@/transport_company/companies/components/CompaniesListPage';
import { CompanyDetailPage } from '@/transport_company/companies/components/CompanyDetailPage';
import { OnboardCompanyPage } from '@/transport_company/companies/components/OnboardCompany';
import { PlatformOrdersPage } from '@/transport_company/companies/components/PlatformOrders';
import { NotificationsPage } from '@/transport_company/notifications/components/NotificationsPage';

export const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/verify', element: <VerifyPage /> },
  { path: '/select-role', element: <RoleSelectionPage /> },
  { path: '/403', element: <Forbidden /> },
  
  // Admin Routes
  {
    path: '/admin',
    element: <ProtectedRoute allow={[Role.SUPER_ADMIN]}><AppShell /></ProtectedRoute>,
    children: [
      { path: '', element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <div className="p-6">Admin Dashboard (Coming Soon)</div> },
      { path: 'profile', element: <div className="p-6">Profile (Coming Soon)</div> },
      { path: 'help', element: <div className="p-6">Help & Support (Coming Soon)</div> },
      { path: 'terms', element: <div className="p-6">Terms & Conditions (Coming Soon)</div> },
      { path: 'notifications', element: <div className="p-6">Notifications (Coming Soon)</div> },
      { path: 'companies', element: <CompaniesListPage /> },
      { path: 'companies/new', element: <OnboardCompanyPage /> },
      { path: 'companies/:id', element: <CompanyDetailPage /> },
      { path: 'platform-orders', element: <PlatformOrdersPage /> },
    ]
  },

  // Petrol Brand Routes
  {
    path: '/petrolCompany',
    element: <ProtectedRoute allow={[Role.CLIENT, Role.COMPANY_ADMIN]}><AppShell /></ProtectedRoute>,
    children: [
      { path: '', element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <PetrolDashboard /> },
      { path: 'orders', element: <div className="p-6">Orders (Coming Soon)</div> },
      { path: 'tracking', element: <div className="p-6">Tracking (Coming Soon)</div> },
      { path: 'fuel-exchange', element: <div className="p-6">Fuel Exchange (Coming Soon)</div> },
      { path: 'companies', element: <div className="p-6">Transport Companies (Coming Soon)</div> },
      { path: 'stations', element: <div className="p-6">Stations (Coming Soon)</div> },
      { path: 'invoices', element: <div className="p-6">Invoices & Payments (Coming Soon)</div> },
      { path: 'reports', element: <div className="p-6">Reports (Coming Soon)</div> },
      { path: 'profile', element: <div className="p-6">Profile (Coming Soon)</div> },
      { path: 'help', element: <div className="p-6">Help & Support (Coming Soon)</div> },
      { path: 'terms', element: <div className="p-6">Terms & Conditions (Coming Soon)</div> },
      { path: 'notifications', element: <NotificationsPage /> },
    ]
  },

  // Transportation Routes
  {
    path: '/transport',
    element: <ProtectedRoute allow={[Role.COMPANY_ADMIN, Role.DRIVER, Role.SUPER_ADMIN]}><AppShell /></ProtectedRoute>,
    children: [
      { path: '', element: <Navigate to="dashboard" replace /> }, 
      { path: 'dashboard', element: <TransportDashboard /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'orders', element: <OrdersListPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      { path: 'orders/:id/edit', element: <OrderEditPage /> },
      { path: 'tracking', element: <TrackingPage /> },
      { path: 'invoices', element: <InvoicesListPage /> },
      { path: 'drivers', element: <DriversPage /> },
      { path: 'drivers/:id', element: <DriverDetailsPage /> },
      { path: 'clients', element: <ClientsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'help', element: <HelpPage /> },
    ]
  },
  
  { path: '*', element: <NotFound /> },
]);
