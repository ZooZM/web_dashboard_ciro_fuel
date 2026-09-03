import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as profileApi from '@/petrol_company/profile/api/profile.api';

export function useMyProfile() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => profileApi.getMe(),
  });
}

export function useUpdateMyName(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fullName: string) => profileApi.updateMyName(id, fullName),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useMyCompany(companyId: string | null) {
  return useQuery({
    queryKey: queryKeys.companies.detail(companyId ?? ''),
    queryFn: () => profileApi.getMyCompany(companyId!),
    enabled: Boolean(companyId),
  });
}

export function useRequestPhoneVerification() {
  return useMutation({
    mutationFn: (newPhone: string) => profileApi.requestPhoneVerification(newPhone),
  });
}

export function useConfirmPhoneVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => profileApi.confirmPhoneVerification(code),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}
