import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { queryKeys } from '@/constants/query-keys';
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  NotificationType,
  type Notification,
} from '@/petrol_company/notifications/api/notifications.api';
import { AdminAnnouncementComposer } from './AdminAnnouncementComposer';
import { useAnnouncements } from '@/admin/notifications/hooks/useAnnouncements';

/**
 * spec 017 (operator dashboard) US6 — the operator's real notifications, and
 * the composer that reaches every company administrator.
 *
 * The notification half needed **no backend work at all**: `GET /notifications`,
 * `PATCH /notifications/:id/read` and `PATCH /notifications/read-all` were
 * already role-agnostic and cursor-paged (research, cross-cutting table). This
 * screen was 353 lines of hardcoded Arabic notification objects, right down to
 * the timestamps.
 */
export function AdminNotificationsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.notifications(unreadOnly, cursor),
    queryFn: () => listNotifications(unreadOnly, cursor),
  });

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: ['notifications'] });

  const markOne = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: invalidate,
  });
  const markAll = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: invalidate,
  });

  const announcements = useAnnouncements();
  const notifications = data?.items ?? [];

  return (
    <div
      className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans"
      dir="rtl"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col text-right">
            <h1 className="text-2xl font-black text-[#162155]">{t('announcements.title')}</h1>
            {data && (
              <p className="text-sm font-semibold text-slate-500 mt-1">
                {t('notificationsPage.unread', { count: data.unreadCount })}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setUnreadOnly((current) => !current);
                setCursor(undefined);
              }}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-bold border',
                unreadOnly
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200',
              )}
            >
              {t('notificationsPage.unreadOnly')}
            </button>
            <button
              type="button"
              disabled={markAll.isPending}
              onClick={() => markAll.mutate()}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-bold disabled:opacity-50"
            >
              {t('notificationsPage.markAllRead')}
            </button>
          </div>
        </div>

        <AdminAnnouncementComposer />

        <div className="bg-white border border-[#E7E9EF] rounded-2xl shadow-sm p-4 flex flex-col gap-2">
          {/* FR-076: loading, empty and failed each render distinctly. */}
          {isLoading && (
            <p className="py-12 text-center text-sm font-medium text-slate-400">
              {t('common.loading')}
            </p>
          )}

          {isError && (
            <div className="py-12 flex flex-col items-center gap-3">
              <p className="text-sm font-bold text-red-700">
                {t('notificationsPage.failed')}
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold"
              >
                {t('common.retry')}
              </button>
            </div>
          )}

          {!isLoading && !isError && notifications.length === 0 && (
            <p className="py-12 text-center text-sm font-medium text-slate-400">
              {t('notificationsPage.empty')}
            </p>
          )}

          {notifications.map((notification) => (
            <NotificationRow
              key={notification._id}
              notification={notification}
              onMarkRead={() => markOne.mutate(notification._id)}
            />
          ))}

          {!isLoading && !isError && notifications.length > 0 && (
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={!cursor}
                onClick={() => setCursor(undefined)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 disabled:opacity-40"
              >
                {t('common.first')}
              </button>
              <button
                type="button"
                disabled={!data?.nextCursor}
                onClick={() => setCursor(data?.nextCursor ?? undefined)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-bold disabled:opacity-40"
              >
                {t('common.next')}
              </button>
            </div>
          )}
        </div>

        {/* FR-052 — what the operator has sent, distinct from the deliveries. */}
        {announcements.data && announcements.data.items.length > 0 && (
          <div className="bg-white border border-[#E7E9EF] rounded-2xl shadow-sm p-4 flex flex-col gap-2 text-right">
            <h2 className="text-base font-black text-[#162155] mb-2">
              {t('announcements.title')}
            </h2>
            {announcements.data.items.map((announcement) => (
              <div
                key={announcement._id}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">
                    {announcement.title}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(announcement.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold">
                  <span className="text-emerald-700">
                    {t('announcements.delivered')}: {announcement.deliveredCount}
                  </span>
                  <span className="text-amber-700">
                    {t('announcements.missed')}: {announcement.failedCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationRow({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: () => void;
}) {
  const { t } = useTranslation();
  const isUnread = notification.readAt === null;
  const isAnnouncement = notification.type === NotificationType.PLATFORM_ANNOUNCEMENT;

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 p-4 rounded-xl border',
        isUnread ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-slate-100',
      )}
    >
      <div className="flex flex-col text-right gap-1 min-w-0">
        <span className="text-sm font-black text-[#162155]">
          {/*
            A platform announcement carries its own title in the payload. Every
            other type falls back to its translated name, and an unrecognised
            one to the raw value — conspicuous rather than blank, the same rule
            `OrderStatusBadge` follows.
          */}
          {isAnnouncement
            ? String(notification.payload?.title ?? t('announcements.title'))
            : t(`notificationsPage.type.${notification.type}`, {
                defaultValue: notification.type,
              })}
        </span>
        {isAnnouncement && notification.payload?.body ? (
          <span className="text-[12px] text-slate-600">
            {String(notification.payload.body)}
          </span>
        ) : null}
        <span className="text-[11px] text-slate-400">
          {new Date(notification.createdAt).toLocaleString()}
        </span>
      </div>

      {isUnread && (
        <button
          type="button"
          onClick={onMarkRead}
          className="shrink-0 text-[12px] font-bold text-blue-600 underline"
        >
          {t('notificationsPage.markRead')}
        </button>
      )}
    </div>
  );
}
