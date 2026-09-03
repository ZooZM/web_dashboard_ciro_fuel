import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useSupportRequests, useAcknowledgeSupportRequest } from '@/petrol_company/support/hooks/useSupportRequests';
import { ApiError } from '@/lib/api/api-error';

// Feature 013 T123/T124/T129/FR-053/FR-096: a genuinely new screen — no mock existed to
// replace. Wired to `GET /support/requests` and `PATCH /support/requests/:id/acknowledge`.
// `request.message` is rendered as plain JSX text (never `dangerouslySetInnerHTML`), so a
// markup payload (`<script>...</script>`) renders as literal characters, never executes —
// see `tests/unit/support-inbox-xss.test.tsx`.
export function SupportInboxPage() {
  const { t } = useTranslation();
  const { data: requests, isLoading, isError, refetch } = useSupportRequests();
  const acknowledge = useAcknowledgeSupportRequest();

  async function handleAcknowledge(id: string) {
    try {
      await acknowledge.mutateAsync(id);
      toast.success(t('support.acknowledgeSuccess'));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="mb-6 flex flex-col items-start text-right">
        <h1 className="text-2xl font-black text-slate-900">{t('support.title')}</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">{t('support.subtitle')}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('common.loading')}</p>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <p className="text-sm text-red-500">{t('support.loadError')}</p>
            <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
              {t('common.retry')}
            </button>
          </div>
        ) : !requests || requests.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('support.empty')}</p>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {requests.map((request) => (
              <div key={request._id} className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold">
                      {t(`support.topic.${request.topic}`)}
                    </span>
                    <span className="text-xs font-bold text-slate-400" dir="ltr">
                      {new Date(request.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-bold",
                    request.state === 'ACKNOWLEDGED' ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FFEDD5] text-[#EA580C]",
                  )}>
                    {t(`support.state.${request.state}`)}
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap break-words">{request.message}</p>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-400">{request.clientId}</span>
                  {request.state === 'SUBMITTED' ? (
                    <button
                      onClick={() => handleAcknowledge(request._id)}
                      disabled={acknowledge.isPending}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors disabled:opacity-60"
                    >
                      {t('support.acknowledge')}
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">
                      {t('support.acknowledgedAt')}: {request.acknowledgedAt ? new Date(request.acknowledgedAt).toLocaleString() : ''}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
