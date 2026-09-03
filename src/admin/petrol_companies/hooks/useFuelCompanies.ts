import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as fuelCompaniesApi from '@/admin/petrol_companies/api/fuel-companies.api';
import type {
  OnboardFuelCompanyInput,
  SetCommissionTermInput,
  SetCashbackProgrammeInput,
} from '@/admin/petrol_companies/api/fuel-companies.api';
import { CompanyStatus } from '@/constants/order-status';

const QK = {
  companies: ['admin', 'fuel-companies'] as const,
  company: (id: string) => ['admin', 'fuel-companies', id] as const,
  owners: (id: string) => ['admin', 'fuel-companies', id, 'owners'] as const,
  stations: (id: string) => ['admin', 'fuel-companies', id, 'stations'] as const,
  invoices: (id: string, cursor?: string) => ['admin', 'fuel-companies', id, 'invoices', cursor] as const,
  movements: (id: string, cursor?: string) => ['admin', 'fuel-companies', id, 'movements', cursor] as const,
  billingBalances: (id: string) => ['admin', 'fuel-companies', id, 'billing-balances'] as const,
  litreBalances: (id: string) => ['admin', 'fuel-companies', id, 'litre-balances'] as const,
  commissionTerm: ['admin', 'billing', 'commission-term'] as const,
  cashbackProgramme: ['admin', 'billing', 'cashback-programme'] as const,
  allInvoices: (cursor?: string) => ['admin', 'invoices', cursor] as const,
  allMovements: (cursor?: string) => ['admin', 'platform-account', 'movements', cursor] as const,
};

export function useAllInvoices(cursor?: string) {
  return useQuery({ queryKey: QK.allInvoices(cursor), queryFn: () => fuelCompaniesApi.listAllInvoices(cursor) });
}

export function useAllMovements(cursor?: string) {
  return useQuery({ queryKey: QK.allMovements(cursor), queryFn: () => fuelCompaniesApi.listAllMovements(cursor) });
}

export function useFuelCompaniesList() {
  return useQuery({ queryKey: QK.companies, queryFn: () => fuelCompaniesApi.listFuelCompanies() });
}

export function useFuelCompanyDetail(id: string) {
  return useQuery({
    queryKey: QK.company(id),
    queryFn: () => fuelCompaniesApi.getFuelCompany(id),
    enabled: Boolean(id),
  });
}

export function useCompanyOwners(id: string) {
  return useQuery({
    queryKey: QK.owners(id),
    queryFn: () => fuelCompaniesApi.listCompanyOwners(id),
    enabled: Boolean(id),
  });
}

export function useCompanyStations(id: string) {
  return useQuery({
    queryKey: QK.stations(id),
    queryFn: () => fuelCompaniesApi.listCompanyStations(id),
    enabled: Boolean(id),
  });
}

export function useCompanyInvoices(id: string, cursor?: string) {
  return useQuery({
    queryKey: QK.invoices(id, cursor),
    queryFn: () => fuelCompaniesApi.listCompanyInvoices(id, cursor),
    enabled: Boolean(id),
  });
}

export function useCompanyMovements(id: string, cursor?: string) {
  return useQuery({
    queryKey: QK.movements(id, cursor),
    queryFn: () => fuelCompaniesApi.listCompanyMovements(id, cursor),
    enabled: Boolean(id),
  });
}

export function useCompanyBillingBalances(id: string) {
  return useQuery({
    queryKey: QK.billingBalances(id),
    queryFn: () => fuelCompaniesApi.getCompanyBillingBalances(id),
    enabled: Boolean(id),
  });
}

export function useCompanyLitreBalances(id: string) {
  return useQuery({
    queryKey: QK.litreBalances(id),
    queryFn: () => fuelCompaniesApi.listCompanyLitreBalances(id),
    enabled: Boolean(id),
  });
}

export function useOnboardFuelCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: OnboardFuelCompanyInput) => fuelCompaniesApi.onboardFuelCompany(input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: QK.companies }),
  });
}

export function useSetFuelCompanyStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: CompanyStatus) => fuelCompaniesApi.setFuelCompanyStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QK.companies });
      void queryClient.invalidateQueries({ queryKey: QK.company(id) });
    },
  });
}

export function useAdminCurrentCommissionTerm() {
  return useQuery({ queryKey: QK.commissionTerm, queryFn: () => fuelCompaniesApi.getCurrentCommissionTerm() });
}

export function useAdminCurrentCashbackProgramme() {
  return useQuery({ queryKey: QK.cashbackProgramme, queryFn: () => fuelCompaniesApi.getCurrentCashbackProgramme() });
}

export function useSetCommissionTerm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SetCommissionTermInput) => fuelCompaniesApi.setCommissionTerm(input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: QK.commissionTerm }),
  });
}

export function useSetCashbackProgramme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SetCashbackProgrammeInput) => fuelCompaniesApi.setCashbackProgramme(input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: QK.cashbackProgramme }),
  });
}

export function useSetCommissionCeiling(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commissionCeiling: number) => fuelCompaniesApi.setCommissionCeiling(companyId, commissionCeiling),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QK.company(companyId) });
      void queryClient.invalidateQueries({ queryKey: QK.billingBalances(companyId) });
    },
  });
}

export function useConfirmPayment(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: string) => fuelCompaniesApi.confirmPayment(paymentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QK.movements(companyId) });
      void queryClient.invalidateQueries({ queryKey: QK.billingBalances(companyId) });
    },
  });
}
