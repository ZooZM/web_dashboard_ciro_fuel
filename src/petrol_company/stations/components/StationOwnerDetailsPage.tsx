import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { DueLitersBalanceCard } from './owner_details/DueLitersBalanceCard';
import { CreditLimitRequestCard } from './owner_details/CreditLimitRequestCard';
import { CreditLimitCard } from './owner_details/CreditLimitCard';
import { StationsBlock } from './owner_details/StationsBlock';
import { useOwnerDetail, useSetOwnerActive } from '@/petrol_company/stations/hooks/useOwners';
import { useOwnerStations } from '@/petrol_company/stations/hooks/useStations';

// Feature 013 T073/T079/FR-025/FR-036/FR-047/FR-048: wired to `GET /users/:id`. Dropped:
// pending/total invoices, "monthly orders", and a recent-orders log — no client-scoped
// invoice or order aggregation exists anywhere on the platform (invoicing is Phase 9's
// scope and carries no per-client rollup even then); the account code shown by the mock
// (a second, fabricated "PC-2024-011") is dropped in favour of the real `_id`.
export function StationOwnerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: owner, isLoading, isError } = useOwnerDetail(id);
  const { data: stations } = useOwnerStations(id);
  const setActive = useSetOwnerActive(id ?? '');

  async function toggleActive() {
    if (!owner) return;
    try {
      await setActive.mutateAsync(!owner.isActive);
    } catch {
      toast.error(t('errors.generic'));
    }
  }

  if (isLoading) {
    return <div className="p-6 text-center text-sm text-slate-400">{t('common.loading')}</div>;
  }
  if (isError || !owner || !id) {
    return <div className="p-6 text-center text-sm text-red-500">{t('owners.loadError')}</div>;
  }

  return (
    <div className="flex flex-col p-6 max-w-[1600px] mx-auto w-full gap-6" dir="rtl">

      {/* Header / Breadcrumb */}
      <div className="flex items-center justify-start gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <img src="/petrolCompany/station/arrowRight.svg" className="w-3 h-3 rotate-180" alt="Back" />
        </button>
        <span className="text-sm font-bold text-slate-400">{t('owners.title')} / <span className="text-slate-900">{owner.fullName}</span></span>
      </div>

      {/* Main Profile Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
            <img src="/petrolCompany/orderDetails/profile.jpg" alt="Avatar" className="w-14 h-14 " />
          </div>
          <div className="flex flex-col text-right items-start">
            <div className="flex items-center justify-start gap-3 mb-1">
              <span className="text-lg font-black text-slate-900">{owner.fullName}</span>
              <span className={cn("px-3 py-1 rounded-lg text-xs font-bold", owner.isActive ? "bg-green-100/50 text-green-600" : "bg-red-50 text-red-500")}>
                {owner.isActive ? t('common.active') : t('common.inactive')}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {t('owners.joinedAt')} {new Date(owner.createdAt).toLocaleDateString()} - {owner._id}
            </span>
          </div>
        </div>
        <button
          onClick={toggleActive}
          disabled={setActive.isPending}
          className={cn(
            "flex items-center justify-center px-6 h-10 rounded-xl font-bold text-sm gap-2 cursor-pointer transition-colors border disabled:opacity-60",
            owner.isActive ? "bg-red-50 text-red-500 hover:bg-red-100 border-red-200" : "bg-green-50 text-green-600 hover:bg-green-100 border-green-200",
          )}
        >
          <img src={owner.isActive ? "/petrolCompany/owner/pause (1).svg" : "/petrolCompany/owner/continue.svg"} alt="" className="w-4 h-4" />
          {owner.isActive ? t('owners.deactivate') : t('owners.activate')}
        </button>
      </div>

      {/* Due Liters Balance (Phase 14) */}
      <DueLitersBalanceCard ownerId={id} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex items-center justify-between gap-4">
          <div className="flex flex-col text-right items-start">
            <span className="text-xs font-bold text-slate-500 mb-1">{t('owners.stationsCount')}</span>
            <span className="text-xl font-black text-slate-900">{stations?.length ?? 0}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/petrolCompany/owner/blueStation.svg" alt="" className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex items-center justify-between gap-4">
          <div className="flex flex-col text-right items-start">
            <span className="text-xs font-bold text-slate-500 mb-1">{t('common.phone')}</span>
            <span className="text-base font-black text-slate-900" dir="ltr">{owner.phone}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <img src="/petrolCompany/owner/orangeOrder.svg" alt="" className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* RIGHT COLUMN (lg:col-span-2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Owner Information */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <img src="/petrolCompany/owner/user.svg" alt="" className="w-6 h-6" />
                </div>
                <span className="font-black text-slate-900 text-lg">{t('owners.detail')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold text-slate-400 mb-2">{t('common.fullName')}</span>
                <span className="text-base font-black text-slate-900">{owner.fullName}</span>
              </div>

              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-slate-400">{t('owners.accountCode')}</span>
                  <div className="flex items-center gap-1 bg-slate-50 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">
                    <img src="/petrolCompany/owner/lock.svg" alt="" className="w-3 h-3" />
                    {t('owners.notEditable')}
                  </div>
                </div>
                <span className="text-base font-black text-slate-900">{owner._id}</span>
              </div>

              <div className="flex flex-col items-start">
                <span className="text-sm font-bold text-slate-400 mb-2">{t('common.email')}</span>
                <span className="text-base font-black text-slate-900">{owner.email}</span>
              </div>

              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-slate-400">{t('common.phone')}</span>
                  <div className="flex items-center gap-1 bg-slate-50 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">
                    <img src="/petrolCompany/owner/lock.svg" alt="" className="w-3 h-3" />
                    {t('owners.notEditable')}
                  </div>
                </div>
                <span className="text-base font-black text-slate-900" dir="ltr">{owner.phone}</span>
              </div>
            </div>
          </div>

          <CreditLimitRequestCard ownerId={id} />
          <CreditLimitCard ownerId={id} />
          <StationsBlock ownerId={id} />
        </div>

        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 flex flex-col gap-6">

          {/* Contact Information */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-start gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <img src="/petrolCompany/owner/details.svg" alt="" className="w-6 h-6" />
              </div>
              <span className="font-black text-slate-900 text-lg">{t('owners.contact')}</span>
            </div>

            <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center mb-3">
              <img src="/petrolCompany/orderDetails/profile.jpg" alt="Avatar" className="w-16 h-16" />
            </div>

            <span className="text-base font-black text-slate-900 mb-8">{owner.fullName}</span>

            <div className="w-full flex flex-col gap-5 text-right mb-8">
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-slate-400 mb-1">{t('common.phone')}</span>
                <span className="text-sm font-black text-slate-900" dir="ltr">{owner.phone}</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-slate-400 mb-1">{t('common.email')}</span>
                <span className="text-sm font-black text-slate-900">{owner.email}</span>
              </div>
            </div>

            <a
              href={`tel:${owner.phone}`}
              className="w-full py-3 rounded-xl border border-blue-100 text-blue-600 bg-white hover:bg-blue-50 transition-colors font-bold text-sm flex items-center justify-center gap-2"
            >
              <img src="/petrolCompany/transporters/details/phone.svg" alt="" className=' w-4 h-4' />
              {owner.phone}
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
