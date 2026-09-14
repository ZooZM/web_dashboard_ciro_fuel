import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import { queryKeys } from '@/constants/query-keys';
import { Role } from '@/constants/roles';

/**
 * spec 017 (operator dashboard) T071/FR-036 — this company's drivers, from
 * `GET /users?role=DRIVER&companyId=`.
 *
 * The `companyId` filter is load-bearing only for `SUPER_ADMIN`: the tenant
 * plugin overwrites it for every other role, which is why this card lives on
 * the operator's screens and nowhere else.
 *
 * Carries the driver's identity and active state and **nothing about where they
 * have been** — the same boundary the platform-wide roster draws (FR-043,
 * FR-044). The mock's "truck" column is dropped here rather than reinstated:
 * `User` has carried no truck since spec 008's cutover, and the last-operated
 * truck is a derived, per-driver figure the roster resolves in one batched
 * aggregate. It has no place in a per-company sidebar card.
 */
interface CompanyDriver {
  _id: string;
  fullName: string;
  phone: string;
  isActive: boolean;
}

export function AdminCompanyDriversCard({ companyId }: { companyId: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.users.list({ role: 'DRIVER', companyId }),
    queryFn: async () => {
      const { data } = await apiClient.get<CompanyDriver[]>(apiRoutes.users.list, {
        params: { role: Role.DRIVER, companyId },
      });
      return data;
    },
    enabled: Boolean(companyId),
  });

  const drivers = data ?? [];

  return (
    <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-start gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#F4F8FD] flex items-center justify-center">
          <img
            src="/transportCompany/orderPage/AssignPage/driver.svg"
            alt=""
            className="w-5 h-5"
          />
        </div>
        <h3 className="text-base font-black text-[#162155]">{t('drivers.title')}</h3>
      </div>

      {/* FR-076: loading, empty and failed each render distinctly. */}
      {isLoading && (
        <p className="py-6 text-center text-sm font-medium text-slate-400">
          {t('common.loading')}
        </p>
      )}
      {isError && (
        <p className="py-6 text-center text-sm font-bold text-red-700">
          {t('driverRoster.failed')}
        </p>
      )}
      {!isLoading && !isError && drivers.length === 0 && (
        <p className="py-6 text-center text-sm font-medium text-slate-400">
          {t('drivers.empty')}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {drivers.map((driver) => (
          <button
            key={driver._id}
            onClick={() => navigate(`/admin/drivers/${driver._id}`)}
            className="flex items-center justify-between py-3 border-b border-[#E7E9EF] last:border-0 last:pb-0 text-right hover:bg-slate-50 transition-colors"
          >
            <div className="flex flex-col text-right">
              <span className="text-sm font-black text-[#162155]">{driver.fullName}</span>
              <span className="text-xs font-bold text-slate-400" dir="ltr">
                {driver.phone}
              </span>
            </div>
            <span
              className={
                driver.isActive
                  ? 'text-[11px] font-bold text-green-600'
                  : 'text-[11px] font-bold text-red-600'
              }
            >
              {driver.isActive ? t('drivers.active') : t('drivers.inactive')}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
