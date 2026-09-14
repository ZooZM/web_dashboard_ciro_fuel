import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useAnnouncement,
  useCreateAnnouncement,
} from '@/admin/notifications/hooks/useAnnouncements';
import { useFuelCompaniesList } from '@/admin/petrol_companies/hooks/useFuelCompanies';
import { useTransportCompaniesList } from '@/admin/transport_companies/hooks/useTransportCompanies';
import { apiErrorMessage } from '@/lib/api/api-error';

/**
 * spec 017 (operator dashboard) T113/US6 — the operator composes one
 * announcement for every company administrator on the platform.
 *
 * **The 202 is rendered as QUEUED, never as delivered** (FR-055). The fan-out
 * runs in the background, so the composer states the intended recipient count
 * the platform resolved and then OFFERS the outcome — it does not block waiting
 * for it, and it does not claim a delivery that has not happened yet. Claiming
 * it would be worse than saying nothing: an operator told "sent to 14" has no
 * reason left to check who was actually missed.
 */
export function AdminAnnouncementComposer() {
  const { t } = useTranslation();
  const create = useCreateAnnouncement();
  const fuelCompanies = useFuelCompaniesList();
  const transportCompanies = useTransportCompaniesList();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetCompanyIds, setTargetCompanyIds] = useState<string[]>([]);
  const [queuedId, setQueuedId] = useState<string | null>(null);

  // Fetched only once something has been queued, so the outcome is there when
  // the operator asks for it without polling in the background.
  const outcome = useAnnouncement(queuedId ?? undefined);

  const companies = [...(fuelCompanies.data ?? []), ...(transportCompanies.data ?? [])];

  function toggleTarget(id: string) {
    setTargetCompanyIds((current) =>
      current.includes(id) ? current.filter((existing) => existing !== id) : [...current, id],
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const queued = await create.mutateAsync({
      title,
      body,
      // An EMPTY list means every active company (FR-049) — the same single
      // field the platform uses, with no separate "all companies" flag beside
      // it to contradict.
      targetCompanyIds,
    });
    setQueuedId(queued.announcementId);
    setTitle('');
    setBody('');
    setTargetCompanyIds([]);
  }

  return (
    <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-right">
      <h2 className="text-base font-black text-[#162155]">{t('announcements.compose')}</h2>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="announcement-title" className="text-sm font-bold text-slate-700 mb-2">
            {t('announcements.composeTitle')}
          </label>
          <input
            id="announcement-title"
            required
            maxLength={200}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full px-4 py-3 bg-white border border-[#E7E9EF] rounded-xl text-sm font-medium"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="announcement-body" className="text-sm font-bold text-slate-700 mb-2">
            {t('announcements.composeBody')}
          </label>
          <textarea
            id="announcement-body"
            required
            maxLength={4000}
            rows={5}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="w-full px-4 py-3 bg-white border border-[#E7E9EF] rounded-xl text-sm font-medium"
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-bold text-slate-700 mb-2">
            {t('announcements.targets')}
          </legend>
          {/*
            Selecting nothing means EVERY active company — said explicitly,
            because an empty selection otherwise reads as "nobody".
          */}
          <p className="text-[11px] font-semibold text-slate-500">
            {targetCompanyIds.length === 0
              ? t('announcements.allCompanies')
              : String(targetCompanyIds.length)}
          </p>
          <div className="max-h-40 overflow-y-auto flex flex-col gap-1 border border-slate-100 rounded-xl p-2">
            {companies.map((company) => (
              <label key={company._id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={targetCompanyIds.includes(company._id)}
                  onChange={() => toggleTarget(company._id)}
                />
                <span>{company.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {create.isError && (
          <p className="text-sm font-bold text-red-700">
            {apiErrorMessage(create.error, t('announcements.failedToSend'))}
          </p>
        )}

        <button
          type="submit"
          disabled={create.isPending}
          className="self-start bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-bold"
        >
          {create.isPending ? t('common.saving') : t('announcements.compose')}
        </button>
      </form>

      {/* FR-055 — QUEUED, stated as such, with the outcome offered separately. */}
      {create.isSuccess && create.data && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col gap-2">
          <p className="text-sm font-bold text-emerald-800">
            {t('announcements.queued', { count: create.data.intendedRecipientCount })}
          </p>
          <p className="text-[11px] font-semibold text-emerald-700">
            {t('announcements.queuedNote')}
          </p>
          <button
            type="button"
            onClick={() => void outcome.refetch()}
            className="self-start text-[12px] font-bold text-emerald-800 underline"
          >
            {t('announcements.deliveries')}
          </button>

          {outcome.data && (
            <dl className="flex flex-col gap-1 text-[12px] mt-2">
              <div className="flex justify-between">
                <dt className="font-semibold">{t('announcements.delivered')}</dt>
                <dd className="font-black">{outcome.data.announcement.deliveredCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-semibold">{t('announcements.missed')}</dt>
                <dd className="font-black">{outcome.data.announcement.failedCount}</dd>
              </div>
              {/*
                Each miss carries its OWN named reason (FR-054). A suspended
                company, a deactivated administrator and a company with no
                administrator at all need three different responses from the
                operator; "not delivered" would collapse them into one shrug.
              */}
              {outcome.data.failures.map((failure) => (
                <div key={failure._id} className="flex justify-between text-amber-800">
                  <dt className="font-semibold font-mono text-[10px]">{failure.companyId}</dt>
                  <dd className="font-bold">
                    {failure.failureReason
                      ? t(`announcements.failureReason.${failure.failureReason}`)
                      : ''}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}
    </div>
  );
}
