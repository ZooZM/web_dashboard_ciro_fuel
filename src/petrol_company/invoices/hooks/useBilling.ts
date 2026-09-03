import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as billingApi from '@/petrol_company/invoices/api/billing.api';

export function useCurrentCommissionTerm() {
  return useQuery({
    queryKey: queryKeys.billing.commissionTerms,
    queryFn: () => billingApi.getCurrentCommissionTerm(),
  });
}

export function useCurrentCashbackProgramme() {
  return useQuery({
    queryKey: queryKeys.billing.cashbackProgramme,
    queryFn: () => billingApi.getCurrentCashbackProgramme(),
  });
}

export function useMyBillingBalances() {
  return useQuery({
    queryKey: queryKeys.billing.balancesMe,
    queryFn: () => billingApi.getMyBillingBalances(),
  });
}
