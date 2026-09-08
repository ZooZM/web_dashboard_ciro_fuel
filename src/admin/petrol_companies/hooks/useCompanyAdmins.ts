import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import { queryKeys } from '@/constants/query-keys';
import { Role } from '@/constants/roles';

export interface CompanyAdmin {
  _id: string;
  role: Role;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
}

/**
 * The administrator account behind a company — specifically its `phone`, which is the
 * number that administrator signs in with.
 *
 * This existed nowhere on screen, and the gap had a real cost: every company screen showed
 * `Company.contactPhone` under the same label the sign-in field uses ("رقم الجوال"), so an
 * operator reading a number off a company row and typing it into the login page was reading
 * the wrong field entirely. In this platform's own data not one company's contactPhone
 * equals its admin's phone — they are seeded a digit or more apart — so the mistake fails
 * every time, and (under the neutral FR-015 response) fails silently.
 *
 * `GET /users?role=…&companyId=…` is tenant-scoped for everyone except SUPER_ADMIN, whose
 * `companyId` filter is the only one that is load-bearing (users.controller.ts's own note).
 * A fuel company admin calling this for one of their TRANSPORTERS gets their own admins
 * back, not the transporter's — which is why this is used only on the operator's screens.
 */
export function useCompanyAdmins(companyId: string | undefined, role: Role) {
  return useQuery({
    queryKey: queryKeys.users.companyAdmins(companyId ?? ''),
    queryFn: async () => {
      const { data } = await apiClient.get<CompanyAdmin[]>(apiRoutes.users.list, {
        params: { role, companyId },
      });
      return data;
    },
    enabled: Boolean(companyId),
  });
}
