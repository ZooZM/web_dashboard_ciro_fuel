import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as fuelExchangeApi from '@/petrol_company/fuel_exchange/api/fuel-exchange.api';
import type { CreateOfferInput, ProposeInput } from '@/petrol_company/fuel_exchange/api/fuel-exchange.api';
import type { ExchangeDirection, ExchangeOfferState } from '@/constants/fuel-company';

export function useOffersList(direction: ExchangeDirection, state?: ExchangeOfferState, cursor?: string) {
  return useQuery({
    queryKey: queryKeys.fuelExchange.list(direction, state, cursor),
    queryFn: () => fuelExchangeApi.listOffers(direction, state, cursor),
  });
}

export function useOffer(id: string) {
  return useQuery({
    queryKey: queryKeys.fuelExchange.detail(id),
    queryFn: () => fuelExchangeApi.getOffer(id),
    enabled: Boolean(id),
  });
}

// research R9 — replaces counting the loaded page of two list queries; the platform has
// no other way to answer "how many, across the WHOLE scoped set".
export function useOfferSummary() {
  return useQuery({
    queryKey: queryKeys.fuelExchange.summary,
    queryFn: () => fuelExchangeApi.getOfferSummary(),
  });
}

function useInvalidateExchange() {
  const queryClient = useQueryClient();
  return () => void queryClient.invalidateQueries({ queryKey: ['fuel-exchange'] });
}

export function useCreateOffer() {
  const invalidate = useInvalidateExchange();
  return useMutation({
    mutationFn: (input: CreateOfferInput) => fuelExchangeApi.createOffer(input),
    onSuccess: invalidate,
  });
}

export function useProposeOnOffer(id: string) {
  const invalidate = useInvalidateExchange();
  return useMutation({
    mutationFn: (input: ProposeInput) => fuelExchangeApi.proposeOnOffer(id, input),
    onSuccess: invalidate,
  });
}

export function useAwardOffer(id: string) {
  const invalidate = useInvalidateExchange();
  return useMutation({
    mutationFn: (proposalId: string) => fuelExchangeApi.awardOffer(id, proposalId),
    onSuccess: invalidate,
  });
}

export function useWithdrawOffer(id: string) {
  const invalidate = useInvalidateExchange();
  return useMutation({
    mutationFn: () => fuelExchangeApi.withdrawOffer(id),
    onSuccess: invalidate,
  });
}
