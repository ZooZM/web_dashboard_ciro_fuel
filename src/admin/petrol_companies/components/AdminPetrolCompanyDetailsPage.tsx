import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { AdminPetrolCompanyInfoCard } from './AdminPetrolCompanyInfoCard';
import { AdminOwnerListItem } from './AdminOwnerListItem';
import { AdminStationListItem } from './AdminStationListItem';
import {
  useFuelCompanyDetail,
  useCompanyOwners,
  useCompanyStations,
  useCompanyInvoices,
  useCompanyMovements,
  useCompanyBillingBalances,
  useSetFuelCompanyStatus,
  useSetCommissionCeiling,
  useConfirmPayment,
} from '@/admin/petrol_companies/hooks/useFuelCompanies';
import { CompanyStatus } from '@/constants/order-status';
import { ApiError } from '@/lib/api/api-error';

// Feature 013 T238/FR-089: the operator's per-company drill-down, wired to real backend
// data across every section FR-089 names — station owners, stations, invoices and
// platform account. Every fabricated figure from the previous mock (monthly revenue,
// orders this month, a fake map, per-owner/per-station volume) is dropped — the platform
// has no aggregate source for any of them without a new endpoint this feature's task list
// never asked for. Credit-limit cards are dropped too: a credit limit is a per-CLIENT
// fact (already visible per-owner once wired at that level), never a per-company one.
export function AdminPetrolCompanyDetailsPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const companyId = id ?? '';

  const { data: company, isLoading, isError, refetch } = useFuelCompanyDetail(companyId);
  const { data: owners } = useCompanyOwners(companyId);
  const { data: stations } = useCompanyStations(companyId);
  const { data: invoicesPage } = useCompanyInvoices(companyId);
  const { data: movementsPage } = useCompanyMovements(companyId);
  const { data: balances } = useCompanyBillingBalances(companyId);
  const setStatus = useSetFuelCompanyStatus(companyId);
  const setCeiling = useSetCommissionCeiling(companyId);
  const confirmPayment = useConfirmPayment(companyId);

  const [isEditingCeiling, setIsEditingCeiling] = useState(false);
  const [ceilingDraft, setCeilingDraft] = useState('');

  if (isLoading) {
    return <div className="p-6 text-center text-sm text-slate-400">{t('common.loading')}</div>;
  }
  if (isError || !company) {
    return (
      <div className="p-6 flex flex-col items-center gap-3">
        <p className="text-sm text-red-500">{t('adminCompanies.loadError')}</p>
        <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
          {t('common.retry')}
        </button>
      </div>
    );
  }

  const isActive = company.status === 'ACTIVE';

  async function toggleStatus() {
    try {
      await setStatus.mutateAsync(isActive ? CompanyStatus.SUSPENDED : CompanyStatus.ACTIVE);
      toast.success(isActive ? t('adminCompanies.suspendedSuccess') : t('adminCompanies.reinstatedSuccess'));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  async function handleSaveCeiling() {
    const value = Number(ceilingDraft);
    if (!Number.isFinite(value) || value < 0) {
      toast.error(t('adminCompanies.invalidCeiling'));
      return;
    }
    try {
      await setCeiling.mutateAsync(value);
      toast.success(t('adminCompanies.ceilingUpdated'));
      setIsEditingCeiling(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  async function handleConfirmPayment(paymentId: string) {
    try {
      await confirmPayment.mutateAsync(paymentId);
      toast.success(t('adminCompanies.paymentConfirmed'));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-[calc(100vh-6rem)] border border-[#E7E9EF] rounded-2xl" dir="rtl">
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={() => navigate('/admin/petrol-companies')}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E9EF] rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/requests/details/chevronRight.svg" alt="Back" className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          {t('adminCompanies.title')} / {company.name}
        </span>
      </div>

      <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 font-black text-xl">
            {company.name.charAt(0)}
          </div>
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-[#162155]">{company.name}</span>
              <span className={cn('px-4 py-1.5 rounded-xl text-xs font-bold', isActive ? 'bg-green-100/50 text-green-600' : 'bg-red-50 text-red-600')}>
                {isActive ? t('adminCompanies.active') : t('adminCompanies.suspended')}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => void toggleStatus()}
          disabled={setStatus.isPending}
          className={cn(
            'px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50',
            isActive ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 shadow-sm' : 'bg-green-100 text-green-600 hover:bg-green-200 border border-green-200 shadow-sm',
          )}
        >
          {isActive ? t('adminCompanies.suspend') : t('adminCompanies.reinstate')}
        </button>
      </div>

      {/* Real stats: owners/stations counts only — no aggregate source for the rest */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <img src="/Admin/Brands/group.svg" alt="" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[#858C95] text-xs font-bold mb-1">{t('adminCompanies.stationOwners')}</span>
            <span className="text-[#162155] text-2xl font-black">{owners?.length ?? 0}</span>
          </div>
        </div>
        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <img src="/Admin/Brands/station.svg" alt="" className="w-6 h-6" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[#858C95] text-xs font-bold mb-1">{t('adminCompanies.totalStations')}</span>
            <span className="text-[#162155] text-2xl font-black">{stations?.length ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Commission and Cashback — T239/T240: ceiling is editable here (per-company);
          the platform-wide commission RATE/basis and cashback PROGRAMME are edited from
          a separate platform-wide screen (AdminBillingSettingsPage), since they are not
          per-company facts. */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-[52px] h-[52px] rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm10 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-14 4l14-14" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[#858C95] text-xs font-bold mb-1">{t('billing.owed')}</span>
                <span className="text-[#162155] text-xl font-black flex items-center gap-1">
                  {(balances?.commissionAccrued ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-sm font-bold text-[#858C95]">{balances?.currency ?? 'SAR'}</span>
                </span>
              </div>
            </div>
          </div>
          {isEditingCeiling ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={ceilingDraft}
                onChange={(e) => setCeilingDraft(e.target.value)}
                placeholder={String(balances?.commissionCeiling ?? '')}
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold"
              />
              <button onClick={() => void handleSaveCeiling()} disabled={setCeiling.isPending} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold disabled:opacity-50">
                {t('common.confirm')}
              </button>
              <button onClick={() => setIsEditingCeiling(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold">
                {t('common.cancel')}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>{t('billing.ceilingLimit', { ceiling: (balances?.commissionCeiling ?? 0).toLocaleString('en-US') })}</span>
              <button
                onClick={() => {
                  setCeilingDraft(String(balances?.commissionCeiling ?? ''));
                  setIsEditingCeiling(true);
                }}
                className="text-blue-600 hover:underline"
              >
                {t('adminCompanies.editCeiling')}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-[52px] h-[52px] rounded-2xl bg-[#E8F6ED] flex items-center justify-center shrink-0">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M35.516 15.0002H23.362C20.5844 15.0002 18.3327 17.2387 18.3327 20.0002C18.3327 22.7616 20.5844 25.0002 23.362 25.0002H35.516M23.3327 20.0002V20.0168M5.92527 9.5372C6.8049 8.93535 12.9623 8.3335 19.9993 8.3335C27.0364 8.3335 33.1938 8.93535 34.0734 9.5372C34.592 9.89201 35.1106 12.3353 35.4489 14.5836C35.5339 15.1484 35.6075 15.7535 35.6669 16.3891C35.7721 17.5152 35.8327 18.737 35.8327 20.0003C35.8327 21.9766 35.6845 23.8515 35.4489 25.4169C35.1106 27.6652 34.592 30.1083 34.0734 30.4631C33.1938 31.065 27.0364 31.6668 19.9993 31.6668C12.9623 31.6668 6.8049 31.065 5.92527 30.4631C5.04565 29.8613 4.16602 24.8151 4.16602 20.0003C4.16602 18.737 4.22657 17.5152 4.33178 16.3891C4.62759 13.2233 5.27643 9.98115 5.92527 9.5372Z" stroke="#12A150" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[#858C95] text-xs font-bold mb-1">{t('billing.available')}</span>
            <span className="text-[#162155] text-xl font-black flex items-center gap-1">
              {(balances?.cashbackAccrued ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-sm font-bold text-[#858C95]">{balances?.currency ?? 'SAR'}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start pb-6">
        <div className="flex-1 w-full flex flex-col gap-6">
          <AdminPetrolCompanyInfoCard company={company} />

          <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col">
            <h3 className="text-base font-black text-[#162155] mb-4">{t('adminCompanies.stationOwners')}</h3>
            {!owners || owners.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">{t('adminCompanies.noOwners')}</p>
            ) : (
              <div className="flex flex-col border border-slate-100 rounded-xl overflow-hidden">
                {owners.map((owner, idx) => (
                  <AdminOwnerListItem key={owner._id} owner={owner} isLast={idx === owners.length - 1} />
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col">
            <h3 className="text-base font-black text-[#162155] mb-4">{t('adminCompanies.stations')}</h3>
            {!stations || stations.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">{t('adminCompanies.noStations')}</p>
            ) : (
              <div className="flex flex-col border border-slate-100 rounded-xl overflow-hidden">
                {stations.map((station, idx) => (
                  <AdminStationListItem key={station._id} station={station} isLast={idx === stations.length - 1} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[380px] flex flex-col gap-6 shrink-0 self-start">
          <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col">
            <h3 className="text-base font-black text-[#162155] mb-4">{t('invoices.title')}</h3>
            {!invoicesPage || invoicesPage.items.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">{t('invoices.empty')}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {invoicesPage.items.slice(0, 6).map((inv) => (
                  <div key={inv._id} className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-500">{t(`invoices.methodLabel.${inv.method}`)}</span>
                    <span className="text-sm font-black text-slate-900" dir="ltr">{inv.amount.toLocaleString()} <span className="text-[10px] font-bold text-slate-400">{t('invoices.currency')}</span></span>
                    <span className={cn('px-2 py-1 rounded-md text-[10px] font-bold', inv.state === 'SETTLED' ? 'bg-green-50 text-green-600' : inv.state === 'VOID' ? 'bg-slate-100 text-slate-500' : 'bg-orange-50 text-orange-600')}>
                      {t(`invoices.state.${inv.state}`)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col">
            <h3 className="text-base font-black text-[#162155] mb-4">{t('platformAccount.title')}</h3>
            {!movementsPage || movementsPage.items.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">{t('platformAccount.empty')}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {movementsPage.items.slice(0, 6).map((m) => (
                  <div key={m._id} className="flex flex-col gap-1 border-b border-slate-100 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">{new Date(m.createdAt).toLocaleDateString(i18n.language)}</span>
                      <span className="text-sm font-black text-slate-900" dir="ltr">{m.amount.toLocaleString()} {m.currency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={cn('px-2 py-1 rounded-md text-[10px] font-bold w-fit', m.state === 'CONFIRMED' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600')}>
                        {t(`platformAccount.movementState.${m.state}`)}
                      </span>
                      {m.kind === 'PAYMENT_RECORDED' && m.state === 'RECORDED' && (
                        <button
                          onClick={() => void handleConfirmPayment(m._id)}
                          disabled={confirmPayment.isPending}
                          className="text-[10px] font-bold text-blue-600 hover:underline disabled:opacity-50"
                        >
                          {t('adminCompanies.confirmPayment')}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
