import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as orderActionsApi from '@/petrol_company/orders/api/order-actions.api';
import type {
  ApproveOrderInput,
  RejectOrderInput,
  ForceCompleteOrderInput,
} from '@/petrol_company/orders/api/order-actions.api';

function useInvalidateOrder(id: string) {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
    void queryClient.invalidateQueries({ queryKey: ['orders'] });
  };
}

export function useApproveOrder(id: string) {
  const invalidate = useInvalidateOrder(id);
  return useMutation({
    mutationFn: (input: ApproveOrderInput) => orderActionsApi.approveOrder(id, input),
    onSuccess: invalidate,
  });
}

export function useRejectOrder(id: string) {
  const invalidate = useInvalidateOrder(id);
  return useMutation({
    mutationFn: (input: RejectOrderInput) => orderActionsApi.rejectOrder(id, input),
    onSuccess: invalidate,
  });
}

export function useForceCompleteOrder(id: string) {
  const invalidate = useInvalidateOrder(id);
  return useMutation({
    mutationFn: (input: ForceCompleteOrderInput) => orderActionsApi.forceCompleteOrder(id, input),
    onSuccess: invalidate,
  });
}
