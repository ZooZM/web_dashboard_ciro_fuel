import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as stationsApi from '@/petrol_company/stations/api/stations.api';
import type {
  CreateStationInput,
  UpdateStationInput,
} from '@/petrol_company/stations/api/stations.api';

export function useAllStations() {
  return useQuery({
    queryKey: queryKeys.stations.all,
    queryFn: () => stationsApi.listAllStations(),
  });
}

export function useOwnerStations(ownerId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.stations(ownerId ?? ''),
    queryFn: () => stationsApi.listStationsForOwner(ownerId!),
    enabled: Boolean(ownerId),
  });
}

export function useCreateStation(ownerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStationInput) => stationsApi.createStation(ownerId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.stations(ownerId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.stations.all });
    },
  });
}

export function useUpdateStation(ownerId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateStationInput }) =>
      stationsApi.updateStation(id, input),
    onSuccess: () => {
      if (ownerId) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.users.stations(ownerId) });
      }
      void queryClient.invalidateQueries({ queryKey: queryKeys.stations.all });
    },
  });
}

export function useRemoveStation(ownerId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => stationsApi.removeStation(id),
    onSuccess: () => {
      if (ownerId) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.users.stations(ownerId) });
      }
      void queryClient.invalidateQueries({ queryKey: queryKeys.stations.all });
    },
  });
}
