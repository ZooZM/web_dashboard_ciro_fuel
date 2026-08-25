import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Role } from '@/constants/roles';
import { ProtectedRoute } from '@/routing/ProtectedRoute';
import { Forbidden } from '@/routing/Forbidden';
import { NotFound } from '@/routing/NotFound';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/auth/components/LoginPage';
import { VerifyPage } from '@/auth/components/VerifyPage';
import { RoleSelectionPage } from '@/auth/components/RoleSelectionPage';

// Admin imports
import { AdminDashboard } from '@/admin/dashboard/components/AdminDashboard';
import { AdminNotificationsPage } from '@/admin/notifications/components/AdminNotificationsPage';
import { AdminOrdersPage } from '@/admin/orders/components/AdminOrdersPage';
import { AdminOrderDetailPage } from '@/admin/orders/components/AdminOrderDetailPage';
import { AdminFuelExchangePage } from '@/admin/fuel_exchange/components/AdminFuelExchangePage';
import { AdminFuelExchangeDetailPage } from '@/admin/fuel_exchange/components/AdminFuelExchangeDetailPage';
import { AdminPetrolCompaniesPage } from '@/admin/petrol_companies/components/AdminPetrolCompaniesPage';
import { AddPetrolCompanyPage } from '@/admin/petrol_companies/components/AddPetrolCompanyPage';
import { AdminProfilePage } from '@/admin/profile/components/AdminProfilePage';
import { AdminTransportCompaniesPage } from '@/admin/transport_companies/components/AdminTransportCompaniesPage';
import { AddTransportCompanyPage } from '@/admin/transport_companies/components/AddTransportCompanyPage';
import { AdminTransportCompanyDetailsPage } from '@/admin/transport_companies/components/AdminTransportCompanyDetailsPage';
import { AdminDriversPage } from '@/admin/drivers/components/AdminDriversPage';
import { AdminDriverDetailsPage } from '@/admin/drivers/components/AdminDriverDetailsPage';
// Transport imports
import { TransportDashboard } from '@/transport_company/dashboard/components/TransportDashboard';
// Petrol imports
import { PetrolDashboard } from '@/petrol_company/dashboard/components/PetrolDashboard';
import { OrdersListPage as PetrolOrdersListPage } from '@/petrol_company/orders/components/OrdersListPage';
import { OrderDetailPage as PetrolOrderDetailPage } from '@/petrol_company/orders/components/OrderDetailPage';
import { OrderDriverDetailsPage as PetrolOrderDriverDetailsPage } from '@/petrol_company/orders/components/order-driver-details/OrderDriverDetailsPage';
import { NotificationsPage as PetrolNotificationsPage } from '@/petrol_company/notifications/components/NotificationsPage';
import { ProfilePage as PetrolProfilePage } from '@/petrol_company/profile/components/ProfilePage';
import { OrdersListPage } from '@/transport_company/orders/components/OrdersListPage';
import { InvoicesListPage } from '@/transport_company/invoices/components/InvoicesListPage';
import { InvoicesListPage as PetrolInvoicesListPage } from '@/petrol_company/invoices/components/InvoicesListPage';
import { FuelExchangePage } from '@/petrol_company/fuel_exchange/components/FuelExchangePage';
import { FuelExchangeDetailPage } from '@/petrol_company/fuel_exchange/components/FuelExchangeDetailPage';
import { FuelPricesPage } from '@/petrol_company/fuel_prices/components/FuelPricesPage';
import { CompaniesListPage as PetrolCompaniesListPage } from '@/petrol_company/companies/components/CompaniesListPage';
import { CompanyDetailPage as PetrolCompanyDetailPage } from '@/petrol_company/companies/components/CompanyDetailPage';
import { AddTransporterPage as PetrolAddTransporterPage } from '@/petrol_company/companies/components/AddTransporterPage';
import { StationsPage as PetrolStationsPage } from '@/petrol_company/stations/components/StationsPage';
import { StationOwnerDetailsPage as PetrolStationOwnerDetailsPage } from '@/petrol_company/stations/components/StationOwnerDetailsPage';
import { StationDetailsPage as PetrolStationDetailsPage } from '@/petrol_company/stations/components/StationDetailsPage';
import { AddStationOwnerPage as PetrolAddStationOwnerPage } from '@/petrol_company/stations/components/AddStationOwnerPage';
import { TrackingPage } from '@/transport_company/tracking/components/TrackingPage';
import { OrderDetailPage } from '@/transport_company/orders/components/OrderDetailPage';
import { OrderEditPage } from '@/transport_company/orders/components/OrderEditPage';
import { DriversPage } from '@/transport_company/drivers/components/DriversPage';
import { AddDriverPage } from '@/transport_company/drivers/components/AddDriverPage';
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
import { OrderAssignPage } from '@/transport_company/orders/components/assign-driver/OrderAssignPage';
import { TrucksAndTanksPage } from '@/transport_company/trucks/components/TrucksAndTanksPage';
import { DeliveryAreasPage } from '@/transport_company/delivery_areas/components/DeliveryAreasPage';

import { OrderTrackingPage } from '@/pages/OrderTracking/OrderTrackingPage';

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
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'profile', element: <AdminProfilePage /> },
      { path: 'help', element: <HelpPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'notifications', element: <AdminNotificationsPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'orders/:id', element: <AdminOrderDetailPage /> },
      { path: 'tracking', element: <TrackingPage /> },
      { path: 'order-tracking', element: <OrderTrackingPage /> },
      { path: 'fuel-exchange', element: <AdminFuelExchangePage /> },
      { path: 'fuel-exchange/:id', element: <AdminFuelExchangeDetailPage /> },
      { path: 'petrol-companies', element: <AdminPetrolCompaniesPage /> },
      { path: 'petrol-companies/add', element: <AddPetrolCompanyPage /> },
      { path: 'petrol-companies/owners/:id', element: <PetrolStationOwnerDetailsPage /> },
      { path: 'petrol-companies/stations/:id', element: <PetrolStationDetailsPage /> },
      { path: 'petrol-companies/:id', element:   <div className="p-6">Petrol Company Details Page (Coming Soon)</div> },
      { path: 'invoices', element: <PetrolInvoicesListPage /> },
      { path: 'transport-companies', element: <AdminTransportCompaniesPage /> },
      { path: 'transport-companies/add', element: <AddTransportCompanyPage /> },
      { path: 'transport-companies/:id', element: <AdminTransportCompanyDetailsPage /> },
      { path: 'drivers', element: <AdminDriversPage /> },
      { path: 'drivers/:id', element: <AdminDriverDetailsPage /> },
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
      { path: 'orders', element: <PetrolOrdersListPage /> },
      { path: 'orders/:id', element: <PetrolOrderDetailPage /> },
      { path: 'orders/:id/driver', element: <PetrolOrderDriverDetailsPage /> },
      { path: 'tracking', element: <TrackingPage /> },
      { path: 'fuel-exchange', element: <FuelExchangePage /> },
      { path: 'fuel-exchange/:id', element: <FuelExchangeDetailPage /> },
      { path: 'pricing', element: <FuelPricesPage /> },
      { path: 'companies', element: <PetrolCompaniesListPage /> },
      { path: 'companies/add', element: <PetrolAddTransporterPage /> },
      { path: 'companies/:id', element: <PetrolCompanyDetailPage /> },
      { path: 'stations', element: <PetrolStationsPage /> },
      { path: 'stations/owners/add', element: <PetrolAddStationOwnerPage /> },
      { path: 'stations/owners/:id', element: <PetrolStationOwnerDetailsPage /> },
      { path: 'stations/:id', element: <PetrolStationDetailsPage /> },
      { path: 'invoices', element: <PetrolInvoicesListPage /> },
      { path: 'reports', element: <div className="p-6">Reports (Coming Soon)</div> },
      { path: 'profile', element: <PetrolProfilePage /> },
      { path: 'help', element: <HelpPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'notifications', element: <PetrolNotificationsPage /> },
      { path: 'order-tracking', element: <OrderTrackingPage /> },
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
      { path: 'orders/:id/assign', element: <OrderAssignPage /> },
      { path: 'tracking', element: <TrackingPage /> },
      { path: 'delivery-areas', element: <DeliveryAreasPage /> },
      { path: 'invoices', element: <InvoicesListPage /> },
      { path: 'drivers', element: <DriversPage /> },
      { path: 'drivers/add', element: <AddDriverPage /> },
      { path: 'drivers/:id', element: <DriverDetailsPage /> },
      { path: 'trucks', element: <TrucksAndTanksPage /> },
      { path: 'clients', element: <ClientsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'help', element: <HelpPage /> },
    ]
  },

  { path: '*', element: <NotFound /> },
]);
