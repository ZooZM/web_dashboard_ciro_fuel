import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import { queryKeys } from '@/constants/query-keys';
import { Role } from '@/constants/roles';
import { useSession } from '@/stores/session.store';

interface CompanyIdentity {
  _id: string;
  name: string;
  type: 'FUEL' | 'TRANSPORT';
}

/**
 * The shell's own identity strip (Sidebar + Topbar) used to be hard-coded: the company
 * card read `'سيرو ترانسبورت' / 'TRN-2024-002'` for every non-SUPER_ADMIN session and the
 * user card read `'مدير العمليات'` for every non-SUPER_ADMIN role, so a signed-in fuel
 * company administrator was shown a transport company's name and a role they do not hold.
 *
 * `name` is the acting administrator's OWN company (`GET /companies/:id`, which
 * `assertCompanyReadAccess` admits for `user.companyId === :id` in every admin role).
 * There is deliberately NO registration-code line any more: `Company` has no such field,
 * so `TRN-2024-002`/`BRN-2024-001` were invented — the same class of fabricated element
 * feature 009 removed from `MapTrackingCard`'s legend rather than leave on screen. The
 * company TYPE takes its place, which is real.
 */
export function useSessionIdentity() {
  const { user } = useSession();
  const { t } = useTranslation();

  // SUPER_ADMIN operates the platform itself and holds no `companyId` — nothing to fetch.
  const companyId = user?.companyId ?? null;
  const { data: company } = useQuery({
    queryKey: queryKeys.companies.detail(companyId ?? ''),
    queryFn: async () => {
      const { data } = await apiClient.get<CompanyIdentity>(
        apiRoutes.companies.detail(companyId!),
      );
      return data;
    },
    enabled: Boolean(companyId),
    staleTime: 5 * 60 * 1000,
  });

  const isPlatform = user?.role === Role.SUPER_ADMIN;

  return {
    user,
    /** The organisation this session acts for. */
    organizationName: isPlatform ? 'CIRO FUEL' : (company?.name ?? ''),
    /** What that organisation IS — never a fabricated registration number. */
    organizationSubtitle: isPlatform
      ? t('roles.platform')
      : company
        ? t(company.type === 'FUEL' ? 'roles.fuelCompany' : 'roles.transportCompany')
        : '',
    /** The signed-in person's real name, never a placeholder. */
    fullName: user?.fullName ?? '',
    /** The role they actually hold, never a hard-coded job title. */
    roleLabel: user ? t(`roles.${user.role}`) : '',
  };
}
