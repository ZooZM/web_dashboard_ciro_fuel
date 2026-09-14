import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as api from '@/admin/notifications/api/announcements.api';

export function useAnnouncements(cursor?: string) {
  return useQuery({
    queryKey: queryKeys.announcements.list(cursor),
    queryFn: () => api.listAnnouncements(cursor),
  });
}

export function useAnnouncement(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.announcements.detail(id ?? ''),
    queryFn: () => api.getAnnouncement(id!),
    enabled: Boolean(id),
  });
}

/**
 * FR-055 — a 202 means QUEUED. The composer renders it as queued and offers the
 * outcome separately; it never reports a delivery that has not happened yet.
 */
export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.CreateAnnouncementInput) => api.createAnnouncement(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}
