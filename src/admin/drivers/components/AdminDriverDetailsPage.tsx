import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import { queryKeys } from '@/constants/query-keys';
import {
  AdminDriverTransportCompanyCard,
  type DriverTransportCompany,
} from './AdminDriverTransportCompanyCard';

/**
 * spec 017 (operator dashboard) T091a/T092/FR-042/FR-045 — one driver's own
 * record and their employer.
 *
 * Both routes it reads (`GET /users/:id`, `GET /companies/:id`) are unchanged
 * and already admit the operator — this screen needed wiring, not platform
 * work.
 *
 * **The excluded cards are DROPPED, not rendered empty** (FR-045, FR-078, and
 * recorded in this feature's Removals table): `DriverStatsRow`,
 * `DriverRecentTripsCard`, `DriverTruckCard` and `DriverMapCard`. Every one of
 * them shows either a per-driver trip aggregate this feature is forbidden to
 * compute (FR-044) or the driver's live position (FR-043) — the anti-
 * surveillance boundary feature 011 drew. Rendering them empty would be worse
 * than removing them: an empty card reads as "nothing yet", which invites
 * someone to go and fill it.
 *
 * Wired BEFORE the removal, deliberately (T091a before T092): removing first
 * leaves a screen with nothing on it and no signal that the wiring is still
 * outstanding.
 */
interface DriverRecord {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  companyId: string | null;
  ratingAverage?: number;
}

export function AdminDriverDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const driver = useQuery({
    queryKey: queryKeys.users.detail(id ?? ''),
    queryFn: async () => {
      const { data } = await apiClient.get<DriverRecord>(apiRoutes.users.detail(id!));
      return data;
    },
    enabled: Boolean(id),
  });

  const companyId = driver.data?.companyId ?? undefined;
  const company = useQuery({
    queryKey: ['companies', companyId ?? ''],
    queryFn: async () => {
      const { data } = await apiClient.get<DriverTransportCompany>(
        apiRoutes.companies.detail(companyId!),
      );
      return data;
    },
    enabled: Boolean(companyId),
  });

  return (
    <div
      className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans"
      dir="rtl"
    >
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        {driver.isLoading && (
          <div className="h-24 rounded-2xl bg-white border border-slate-200 animate-pulse" />
        )}

        {driver.isError && (
          <div className="bg-white border border-red-200 rounded-2xl p-6 text-right">
            <p className="text-sm font-bold text-red-700 mb-3">{t('driverRoster.failed')}</p>
            <button
              type="button"
              onClick={() => void driver.refetch()}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {driver.data && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 w-full flex flex-col gap-6">
              <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm text-right">
                <h1 className="text-2xl font-black text-[#162155] mb-4">
                  {driver.data.fullName}
                </h1>
                <Field label={t('drivers.phone')} value={driver.data.phone} ltr />
                <Field label={t('common.email')} value={driver.data.email} ltr />
                <Field
                  label={t('drivers.active')}
                  value={driver.data.isActive ? t('common.yes') : t('common.no')}
                />
                {/*
                  `ratingAverage` has NO schema default: its absence IS "not yet
                  rated", a distinct state from a score of zero, all the way
                  from document to screen (spec 007). So it renders as that
                  statement rather than as `0`.
                */}
                <Field
                  label={t('drivers.rating')}
                  value={
                    driver.data.ratingAverage === undefined
                      ? t('drivers.notYetRated')
                      : driver.data.ratingAverage.toFixed(1)
                  }
                />
              </div>
            </div>

            <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 self-start">
              <AdminDriverTransportCompanyCard
                company={company.data}
                isLoading={company.isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <span className="text-sm font-black text-[#162155]" dir={ltr ? 'ltr' : undefined}>
        {value}
      </span>
    </div>
  );
}
