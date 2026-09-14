import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as api from '@/admin/profile/api/operator-account.api';

export function useOperatorAccount() {
  return useQuery({
    queryKey: queryKeys.operatorAccount,
    queryFn: () => api.getOperatorAccount(),
  });
}

export function useRequestPhoneChange() {
  return useMutation({
    mutationFn: (newPhone: string) => api.requestPhoneChange(newPhone),
  });
}

export function useConfirmPhoneChange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => api.confirmPhoneChange(code),
    onSuccess: () => {
      // FR-062: the change does NOT revoke any session — feature 015's
      // concurrent administrator sessions survive it untouched. Only the
      // account payload is refetched; nothing signs the operator out.
      void queryClient.invalidateQueries({ queryKey: queryKeys.operatorAccount });
    },
  });
}
