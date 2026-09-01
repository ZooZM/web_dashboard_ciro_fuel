import { ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDriver, useSetDriverActive } from '@/transport_company/drivers/hooks/useDrivers';
import { useSession } from '@/stores/session.store';
import { Role } from '@/constants/roles';

/**
 * Feature 009 T090/SC-005: previously hardcoded to "محمد إبراهيم" regardless of which
 * driver was opened — this component never read the route's own `:id` param at all. Wired
 * to `GET /users/:id` and to suspend/reinstate (FR-043) — a suspended driver stops
 * appearing as an assignment candidate and cannot sign in (platform-enforced, this screen
 * only reflects it).
 */
export function DriverDetailsHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: driver, isLoading } = useDriver(id ?? '');
  const setActive = useSetDriverActive();
  const { user } = useSession();
  // Shared with AdminDriverDetailsPage.tsx (out of this feature's scope) — SUPER_ADMIN is
  // not in `activate`/`deactivate`'s role list (UsersController), so the action is hidden
  // rather than offered and refused (FR-070's principle applied to this shared component).
  const canManage = user?.role === Role.TRANSPORT_COMPANY_ADMIN;

  function goBack(): void {
    const basePath = window.location.pathname.startsWith('/admin') ? '/admin' : '/transport';
    navigate(`${basePath}/drivers`);
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-start w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="bg-white border border-slate-200 rounded-lg p-2 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
          <span className="text-slate-500 font-bold text-sm cursor-pointer" onClick={goBack}>
            {t('drivers.title')} / <span className="text-slate-800">{driver?.fullName ?? (isLoading ? t('common.loading') : '')}</span>
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col w-full gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex flex-col gap-1.5 text-right">
              <span className="text-lg font-black text-slate-900">{driver?.fullName ?? '—'}</span>
              <span className="text-sm font-bold text-slate-500" dir="ltr">{driver?.phone ?? ''}</span>
            </div>
          </div>

          {driver && (
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1.5 rounded-md text-xs font-bold ${
                  driver.isActive ? 'bg-green-100/50 text-green-600' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {driver.isActive ? t('drivers.active') : t('drivers.inactive')}
              </span>
              {canManage && (
                <button
                  onClick={() => setActive.mutate({ id: driver.id, isActive: !driver.isActive })}
                  disabled={setActive.isPending}
                  className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                >
                  {driver.isActive ? t('drivers.suspend') : t('drivers.reinstate')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
