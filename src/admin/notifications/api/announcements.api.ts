import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { CursorPage } from '@/lib/api/pagination';

/**
 * spec 017 (operator dashboard) T111/US6 — platform announcements.
 *
 * The notification half of this story needed **no** new API at all:
 * `GET /notifications`, `PATCH /notifications/:id/read` and
 * `PATCH /notifications/read-all` are already role-agnostic and cursor-paged,
 * and the operator reads them through the existing
 * `petrol_company/notifications` client. This file covers only what is new.
 */
export type AnnouncementState = 'QUEUED' | 'COMPLETED';

export type AnnouncementDeliveryFailureReason =
  | 'COMPANY_SUSPENDED'
  | 'ADMIN_DEACTIVATED'
  | 'NO_ACTIVE_ADMIN';

export interface Announcement {
  _id: string;
  title: string;
  body: string;
  sentBy: string;
  /** **Empty means every active company** (FR-049) — there is no separate flag. */
  targetCompanyIds: string[];
  intendedRecipientCount: number;
  deliveredCount: number;
  failedCount: number;
  state: AnnouncementState;
  createdAt: string;
}

export interface AnnouncementDelivery {
  _id: string;
  announcementId: string;
  recipientUserId?: string;
  companyId: string;
  notificationId?: string;
  /** A NAMED reason, never a boolean (FR-054). */
  failureReason?: AnnouncementDeliveryFailureReason;
  createdAt: string;
}

export interface CreateAnnouncementInput {
  title: string;
  body: string;
  /** Omit or leave empty to reach every active company. */
  targetCompanyIds?: string[];
}

/**
 * **Returns 202, not 201** (FR-055). The fan-out is ENQUEUED, not performed —
 * the composer must render this as "queued", never as "delivered", and read the
 * outcome afterwards from `getAnnouncement`.
 */
export interface AnnouncementQueued {
  announcementId: string;
  intendedRecipientCount: number;
  state: AnnouncementState;
}

export async function createAnnouncement(
  input: CreateAnnouncementInput,
): Promise<AnnouncementQueued> {
  const { data } = await apiClient.post<AnnouncementQueued>(
    apiRoutes.announcements.create,
    input,
  );
  return data;
}

export async function listAnnouncements(cursor?: string): Promise<CursorPage<Announcement>> {
  const { data } = await apiClient.get<CursorPage<Announcement>>(
    apiRoutes.announcements.list,
    { params: cursor ? { cursor } : {} },
  );
  return data;
}

/** FR-052/FR-054 — the announcement, its tallies, and who was missed and why. */
export async function getAnnouncement(
  id: string,
): Promise<{ announcement: Announcement; failures: AnnouncementDelivery[] }> {
  const { data } = await apiClient.get<{
    announcement: Announcement;
    failures: AnnouncementDelivery[];
  }>(apiRoutes.announcements.detail(id));
  return data;
}
