import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as fuelExchangeApi from '@/petrol_company/fuel_exchange/api/fuel-exchange.api';
import type { CreateExchangeRequestInput, ExchangeDirection } from '@/petrol_company/fuel_exchange/api/fuel-exchange.api';

export function useExchangeRequestsList(direction: ExchangeDirection, cursor?: string) {
  return useQuery({
    queryKey: queryKeys.fuelExchange.list(direction, cursor),
    queryFn: () => fuelExchangeApi.listExchangeRequests(direction, cursor),
  });
}

export function useExchangeRequestDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.fuelExchange.detail(id),
    queryFn: () => fuelExchangeApi.getExchangeRequest(id),
    enabled: Boolean(id),
  });
}

export function useExchangePartners() {
  return useQuery({
    queryKey: queryKeys.fuelExchange.partners,
    queryFn: () => fuelExchangeApi.listExchangePartners(),
  });
}

function useInvalidateExchange() {
  const queryClient = useQueryClient();
  return () => void queryClient.invalidateQueries({ queryKey: ['fuel-exchange'] });
}

export function useCreateExchangeRequest() {
  const invalidate = useInvalidateExchange();
  return useMutation({
    mutationFn: (input: CreateExchangeRequestInput) => fuelExchangeApi.createExchangeRequest(input),
    onSuccess: invalidate,
  });
}

export function useRespondToExchangeRequest(id: string) {
  const invalidate = useInvalidateExchange();
  return useMutation({
    mutationFn: (accept: boolean) => fuelExchangeApi.respondToExchangeRequest(id, accept),
    onSuccess: invalidate,
  });
}

export function useWithdrawExchangeRequest(id: string) {
  const invalidate = useInvalidateExchange();
  return useMutation({
    mutationFn: () => fuelExchangeApi.withdrawExchangeRequest(id),
    onSuccess: invalidate,
  });
}
