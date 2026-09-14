import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';

// Feature 013 T120/FR-052: mirrors `src/common/enums/notification-type.enum.ts` exactly
// (FR-097) — every value the platform can send, so an unrecognised future addition still
// degrades to a generic label rather than throwing.
export const NotificationType = {
  ORDER_APPROVED_FINAL_PRICE: 'ORDER_APPROVED_FINAL_PRICE',
  NO_DRIVER_AVAILABLE: 'NO_DRIVER_AVAILABLE',
  PAYMENT_TIMEOUT: 'PAYMENT_TIMEOUT',
  ORDER_ASSIGNED: 'ORDER_ASSIGNED',
  ORDER_STATUS_CHANGED: 'ORDER_STATUS_CHANGED',
  OTP_ISSUED: 'OTP_ISSUED',
  PAYMENT_RECONCILIATION_REQUIRED: 'PAYMENT_RECONCILIATION_REQUIRED',
  ORDER_ROUTED_TO_TRANSPORT: 'ORDER_ROUTED_TO_TRANSPORT',
  SUPPORT_REQUEST_RAISED: 'SUPPORT_REQUEST_RAISED',
  DRIVER_STOP_DETECTED: 'DRIVER_STOP_DETECTED',
  ORDER_STOP_UNRESOLVED: 'ORDER_STOP_UNRESOLVED',
  CREDIT_LIMIT_REQUEST_RESOLVED: 'CREDIT_LIMIT_REQUEST_RESOLVED',
  // spec 017 T101/FR-048 — a platform announcement from the operator. Every
  // recipient is a company administrator; no mobile persona ever receives it.
  PLATFORM_ANNOUNCEMENT: 'PLATFORM_ANNOUNCEMENT',
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export interface Notification {
  _id: string;
  companyId: string;
  recipientUserId: string;
  type: NotificationType | string;
  orderId: string | null;
  payload: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationsPage {
  items: Notification[];
  nextCursor: string | null;
  unreadCount: number;
}

export async function listNotifications(unreadOnly?: boolean, cursor?: string): Promise<NotificationsPage> {
  const { data } = await apiClient.get<NotificationsPage>(apiRoutes.notifications.list, {
    params: { unread: unreadOnly ? 'true' : undefined, cursor },
  });
  return data;
}

export async function markNotificationRead(id: string): Promise<Notification> {
  const { data } = await apiClient.patch<Notification>(apiRoutes.notifications.markRead(id));
  return data;
}

/**
 * spec 017 (operator dashboard) T112/FR-047 — mark every notification read.
 *
 * The route is on the platform already and is role-agnostic (research,
 * cross-cutting table); the dashboard simply never called it.
 */
export async function markAllNotificationsRead(): Promise<{ updated: number }> {
  const { data } = await apiClient.patch<{ updated: number }>(apiRoutes.notifications.markAllRead);
  return data;
}
