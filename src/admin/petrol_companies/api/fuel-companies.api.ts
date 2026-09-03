import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import { CompanyStatus } from '@/constants/order-status';
import type { FuelType } from '@/constants/order-status';
import type { CursorPage } from '@/lib/api/pagination';
import type { BillingBalances, CommissionTerm, CashbackProgramme } from '@/petrol_company/invoices/api/billing.api';
import type { AccountMovement } from '@/petrol_company/platform_account/api/platform-account.api';
import type { Invoice } from '@/petrol_company/invoices/api/invoices.api';
import type { LitreBalance } from '@/petrol_company/litre_balances/api/litre-balances.api';

export interface FuelCompany {
  _id: string;
  name: string;
  type: 'FUEL' | 'TRANSPORT';
  status: CompanyStatus;
  contactEmail: string;
  contactPhone: string;
  fuelPrices: { fuelType: FuelType; basePricePerLiter: number }[];
  commissionCeiling: number | null;
  commercialRegisterFileId: string | null;
  createdAt: string;
}

export interface StationOwner {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  companyId: string;
}

export interface Station {
  _id: string;
  addressText: string;
  isActive: boolean;
  companyId: string;
}

// Feature 013 T235/FR-087: the operator's fuel companies list — `GET /companies?type=FUEL`
// already exists (SA-scoped to every company on the platform).
export async function listFuelCompanies(): Promise<FuelCompany[]> {
  const { data } = await apiClient.get<FuelCompany[]>(apiRoutes.companies.list, { params: { type: 'FUEL' } });
  return data;
}

export async function getFuelCompany(id: string): Promise<FuelCompany> {
  const { data } = await apiClient.get<FuelCompany>(apiRoutes.companies.detail(id));
  return data;
}

export interface OnboardFuelCompanyInput {
  name: string;
  contactEmail: string;
  contactPhone: string;
  adminEmail: string;
  adminFullName: string;
  adminPhone: string;
  adminPassword: string;
  commercialRegister?: File;
}

// T237/FR-088 — multipart: `POST /companies` accepts an optional `commercialRegister`
// file alongside the plain DTO fields, in one request (the platform creates the company
// AND its first administrator atomically server-side).
export async function onboardFuelCompany(input: OnboardFuelCompanyInput): Promise<FuelCompany> {
  const formData = new FormData();
  formData.append('name', input.name);
  formData.append('contactEmail', input.contactEmail);
  formData.append('contactPhone', input.contactPhone);
  formData.append('adminEmail', input.adminEmail);
  formData.append('adminFullName', input.adminFullName);
  formData.append('adminPhone', input.adminPhone);
  formData.append('adminPassword', input.adminPassword);
  if (input.commercialRegister) {
    formData.append('commercialRegister', input.commercialRegister);
  }
  const { data } = await apiClient.post<FuelCompany>(apiRoutes.companies.create, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

// T243/FR-090 — suspend or reinstate. The administrator's own sign-in refusal (with the
// stated reason) is entirely backend-side (spec 013 Phase 3, T026); this call only flips
// the company's own status.
export async function setFuelCompanyStatus(id: string, status: CompanyStatus): Promise<FuelCompany> {
  const { data } = await apiClient.patch<FuelCompany>(apiRoutes.companies.status(id), { status });
  return data;
}

// T238/FR-089 — the operator's per-company drill-down. Every one of these reuses an
// endpoint a fuel company admin already calls for themselves, now accepting an explicit
// `companyId`/`fuelCompanyId` filter meaningful only for SUPER_ADMIN (see each backend
// service's own comment on why this is safe to expose to every role).
export async function listCompanyOwners(companyId: string): Promise<StationOwner[]> {
  const { data } = await apiClient.get<StationOwner[]>(apiRoutes.users.list, {
    params: { role: 'CLIENT', companyId },
  });
  return data;
}

export async function listCompanyStations(companyId: string): Promise<Station[]> {
  const { data } = await apiClient.get<{ items: Station[] }>(apiRoutes.stations.allForCompany, {
    params: { companyId },
  });
  return data.items;
}

// T248 — the operator's own cross-company ledger/invoice views (`/admin/invoices`,
// `/admin/platform-account`), unscoped: `SUPER_ADMIN` bypasses the isolation plugin
// entirely with no `fuelCompanyId`/`companyId` filter, seeing every company's rows.
export async function listAllInvoices(cursor?: string): Promise<CursorPage<Invoice>> {
  const { data } = await apiClient.get<CursorPage<Invoice>>(apiRoutes.invoices.list, {
    params: cursor ? { cursor } : {},
  });
  return data;
}

export async function listAllMovements(cursor?: string): Promise<CursorPage<AccountMovement>> {
  const { data } = await apiClient.get<CursorPage<AccountMovement>>(apiRoutes.platformAccount.movements, {
    params: cursor ? { cursor } : {},
  });
  return data;
}

export async function listCompanyInvoices(companyId: string, cursor?: string): Promise<CursorPage<Invoice>> {
  const { data } = await apiClient.get<CursorPage<Invoice>>(apiRoutes.invoices.list, {
    params: { fuelCompanyId: companyId, ...(cursor ? { cursor } : {}) },
  });
  return data;
}

export async function listCompanyMovements(companyId: string, cursor?: string): Promise<CursorPage<AccountMovement>> {
  const { data } = await apiClient.get<CursorPage<AccountMovement>>(apiRoutes.platformAccount.movements, {
    params: { companyId, ...(cursor ? { cursor } : {}) },
  });
  return data;
}

export async function getCompanyBillingBalances(companyId: string): Promise<BillingBalances> {
  const { data } = await apiClient.get<BillingBalances>(apiRoutes.billing.balancesForCompany(companyId));
  return data;
}

export async function listCompanyLitreBalances(companyId: string): Promise<LitreBalance[]> {
  const { data } = await apiClient.get<{ items: LitreBalance[] }>(apiRoutes.litreBalances.list, {
    params: { companyId },
  });
  return data.items;
}

// T239/T240 — the operator's write surface, absent for a fuel company admin entirely
// (T244/FR-091). `GET`s reuse the existing FCA-and-SA-readable endpoints.
export async function getCurrentCommissionTerm(): Promise<CommissionTerm | null> {
  const { data } = await apiClient.get<CommissionTerm | null>(apiRoutes.billing.commissionTermsCurrent);
  return data;
}

export async function getCurrentCashbackProgramme(): Promise<CashbackProgramme | null> {
  const { data } = await apiClient.get<CashbackProgramme | null>(apiRoutes.billing.cashbackProgrammeCurrent);
  return data;
}

export interface SetCommissionTermInput {
  basis: 'PERCENTAGE' | 'PER_UNIT';
  rate: number;
}
export async function setCommissionTerm(input: SetCommissionTermInput): Promise<CommissionTerm> {
  const { data } = await apiClient.put<CommissionTerm>(apiRoutes.billing.commissionTerms, input);
  return data;
}

export interface SetCashbackProgrammeInput {
  basis: 'PERCENTAGE' | 'PER_UNIT';
  rate: number;
  isActive: boolean;
  targetsAllCompanies: boolean;
  targetCompanyIds: string[];
}
export async function setCashbackProgramme(input: SetCashbackProgrammeInput): Promise<CashbackProgramme> {
  const { data } = await apiClient.put<CashbackProgramme>(apiRoutes.billing.cashbackProgramme, input);
  return data;
}

export async function setCommissionCeiling(companyId: string, commissionCeiling: number): Promise<FuelCompany> {
  const { data } = await apiClient.put<FuelCompany>(apiRoutes.companies.commissionCeiling(companyId), {
    commissionCeiling,
  });
  return data;
}

// T241/FR-069/FR-067a — the operator confirms a company's recorded payment by hand,
// never automatically.
export async function confirmPayment(paymentId: string): Promise<AccountMovement> {
  const { data } = await apiClient.patch<AccountMovement>(apiRoutes.platformAccount.confirmPayment(paymentId), {});
  return data;
}
