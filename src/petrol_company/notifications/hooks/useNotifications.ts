import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as notificationsApi from '@/petrol_company/notifications/api/notifications.api';
import { ORDER_POLL_INTERVAL_MS } from '@/constants/polling';

export function useNotificationsList(unreadOnly: boolean, cursor?: string) {
  return useQuery({
    queryKey: queryKeys.notifications(unreadOnly, cursor),
    queryFn: () => notificationsApi.listNotifications(unreadOnly, cursor),
    refetchInterval: ORDER_POLL_INTERVAL_MS,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markNotificationRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
