import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useNotificationsList, useMarkNotificationRead } from '@/petrol_company/notifications/hooks/useNotifications';
import type { Notification } from '@/petrol_company/notifications/api/notifications.api';

// Feature 013 T120/T121/FR-052: wired to `GET /notifications`, cursor-paged. Feature 009
// disclosed this whole screen as unwired; every sample notification and the "mute"
// toggle (no such capability exists on the platform) are gone. Filters narrowed to what
// the endpoint actually supports (`?unread=true`) — the mock's topic-based filters
// (orders/invoices/alerts/system) have no matching field on `Notification` to filter by.
const TYPE_STYLE: Record<string, { card: string; iconBg: string; dot: string }> = {
  ORDER_APPROVED_FINAL_PRICE: { card: 'bg-[#EAF5EC] border-[#D1EBD5]', iconBg: 'bg-[#10B981]', dot: 'bg-[#10B981]' },
  CREDIT_LIMIT_REQUEST_RESOLVED: { card: 'bg-[#EAF5EC] border-[#D1EBD5]', iconBg: 'bg-[#10B981]', dot: 'bg-[#10B981]' },
  PAYMENT_RECONCILIATION_REQUIRED: { card: 'bg-[#FEEFE6] border-[#FBD6C0]', iconBg: 'bg-[#F97316]', dot: 'bg-[#F97316]' },
  SUPPORT_REQUEST_RAISED: { card: 'bg-[#FEEFE6] border-[#FBD6C0]', iconBg: 'bg-[#F97316]', dot: 'bg-[#F97316]' },
  ORDER_ASSIGNED: { card: 'bg-[#EBF2FE] border-[#D1E0FB]', iconBg: 'bg-[#3B82F6]', dot: 'bg-[#3B82F6]' },
  ORDER_STATUS_CHANGED: { card: 'bg-[#EBF2FE] border-[#D1E0FB]', iconBg: 'bg-[#3B82F6]', dot: 'bg-[#3B82F6]' },
  ORDER_ROUTED_TO_TRANSPORT: { card: 'bg-[#EBF2FE] border-[#D1E0FB]', iconBg: 'bg-[#3B82F6]', dot: 'bg-[#3B82F6]' },
  OTP_ISSUED: { card: 'bg-[#F1F5F9] border-[#E2E8F0]', iconBg: 'bg-[#94A3B8]', dot: 'bg-[#94A3B8]' },
  NO_DRIVER_AVAILABLE: { card: 'bg-[#FDECEC] border-[#F6D0D0]', iconBg: 'bg-[#EF4444]', dot: 'bg-[#EF4444]' },
  PAYMENT_TIMEOUT: { card: 'bg-[#FDECEC] border-[#F6D0D0]', iconBg: 'bg-[#EF4444]', dot: 'bg-[#EF4444]' },
  DRIVER_STOP_DETECTED: { card: 'bg-[#FDECEC] border-[#F6D0D0]', iconBg: 'bg-[#EF4444]', dot: 'bg-[#EF4444]' },
  ORDER_STOP_UNRESOLVED: { card: 'bg-[#FDECEC] border-[#F6D0D0]', iconBg: 'bg-[#EF4444]', dot: 'bg-[#EF4444]' },
};
const DEFAULT_STYLE = { card: 'bg-[#F1F5F9] border-[#E2E8F0]', iconBg: 'bg-[#94A3B8]', dot: 'bg-[#94A3B8]' };

function groupByDate(items: Notification[]): [string, Notification[]][] {
  const groups = new Map<string, Notification[]>();
  for (const item of items) {
    const key = new Date(item.createdAt).toLocaleDateString();
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
  }
  return Array.from(groups.entries());
}

export function NotificationsPage() {
  const { t } = useTranslation();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const { data, isLoading, isError, refetch } = useNotificationsList(showUnreadOnly, cursor);
  const markRead = useMarkNotificationRead();
  const items = data?.items ?? [];
  const dateGroups = groupByDate(items);

  async function handleMarkAllRead() {
    const unread = items.filter((n) => !n.readAt);
    await Promise.all(unread.map((n) => markRead.mutateAsync(n._id)));
  }

  return (
    <div className="flex flex-col flex-1 text-right font-sans bg-[#F8FAFC] -mt-4 border border-[#E7E9EF] rounded-2xl min-h-full p-6" dir="rtl">

      <div className="pb-6 flex-1">
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-8 pt-8 pb-6 flex-wrap gap-3">
            <h1 className="text-[26px] font-bold text-slate-900">{t('notificationsPage.title')}</h1>
            {data && data.unreadCount > 0 && (
              <span className="text-[13px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                {t('notificationsPage.unreadBadge', { count: data.unreadCount })}
              </span>
            )}
          </div>

          <div className="px-8 pb-6 flex justify-start">
            <div className="flex gap-2.5">
              {(['ALL', 'UNREAD'] as const).map((f) => {
                const isActive = (f === 'UNREAD') === showUnreadOnly;
                return (
                  <button
                    key={f}
                    onClick={() => {
                      setShowUnreadOnly(f === 'UNREAD');
                      setCursor(undefined);
                    }}
                    className={cn(
                      "relative px-6 py-[7.5px] text-[13.5px] font-bold rounded-lg transition-colors whitespace-nowrap bg-slate-200 cursor-pointer",
                      isActive ? "text-white" : "text-slate-600 hover:bg-slate-200/50",
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-notif-filter"
                        className="absolute inset-0 bg-[#2563EB] rounded-lg shadow-sm"
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className="relative z-10">{f === 'ALL' ? t('notificationsPage.filterAll') : t('notificationsPage.filterUnread')}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10">
          {items.some((n) => !n.readAt) && (
            <div className="px-8 pb-6 flex justify-end">
              <button
                onClick={handleMarkAllRead}
                disabled={markRead.isPending}
                className="flex items-center gap-2 text-[13px] text-[#2563EB] hover:text-blue-700 font-medium transition-colors disabled:opacity-60"
              >
                {t('notificationsPage.markAllRead')}
                <img src="/transportCompany/notification/seen.svg" className="w-[18px] h-[18px]" alt="" />
              </button>
            </div>
          )}

          <div className="px-4 sm:px-8 pb-10">
            {isLoading ? (
              <p className="text-center text-sm text-slate-400 py-12">{t('common.loading')}</p>
            ) : isError ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <p className="text-sm text-red-500">{t('notificationsPage.loadError')}</p>
                <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
                  {t('common.retry')}
                </button>
              </div>
            ) : items.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-12">{t('notificationsPage.empty')}</p>
            ) : (
              <>
                {dateGroups.map(([date, groupItems]) => (
                  <div key={date} className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-[34px] h-[34px] rounded-full border-[2px] border-[#10B981] bg-[#E4F7EC] flex items-center justify-center shrink-0">
                        <img src="/transportCompany/notification/date.svg" className="w-4 h-4" alt="" />
                      </div>
                      <span className="text-[14px] font-bold text-[#10B981]">{date}</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {groupItems.map((notif) => {
                        const style = TYPE_STYLE[notif.type] ?? DEFAULT_STYLE;
                        const typeKey = `notificationsPage.type.${notif.type}` as const;
                        const title = t(`${typeKey}.title`, t('notificationsPage.type.unknown.title'));
                        const body = t(`${typeKey}.body`, t('notificationsPage.type.unknown.body'));
                        return (
                          <div
                            key={notif._id}
                            onClick={() => !notif.readAt && markRead.mutate(notif._id)}
                            className={cn(
                              "flex items-center gap-4 px-3 sm:px-5 py-4 rounded-[14px] border transition-all hover:shadow-md cursor-pointer",
                              style.card,
                              notif.readAt && "opacity-60",
                            )}
                          >
                            <span className="text-[12px] sm:text-[13px] font-bold text-slate-600 whitespace-nowrap shrink-0">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>

                            <div className="flex-1 min-w-0 text-right">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <h4 className="text-[13px] sm:text-[14px] font-bold text-slate-900">{title}</h4>
                                {notif.orderId && (
                                  <span className="text-[11px] text-slate-400 font-medium">{notif.orderId}</span>
                                )}
                                {!notif.readAt && <span className={cn("w-2 h-2 rounded-full", style.dot)} />}
                              </div>
                              {body && (
                                <p className="text-[12px] sm:text-[12.5px] text-slate-500 mt-1 leading-relaxed truncate">{body}</p>
                              )}
                            </div>

                            <div className={cn("w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] flex items-center justify-center shrink-0", style.iconBg)}>
                              <img src="/transportCompany/notification/notification.svg" className="w-4 h-4 sm:w-[18px] sm:h-[18px] brightness-0 invert" alt="" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {data?.nextCursor && (
                  <div className="flex justify-center pt-4">
                    <button onClick={() => setCursor(data.nextCursor!)} className="text-sm font-bold text-blue-600 hover:underline">
                      {t('common.loadMore')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
