import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  AccountMovementKind,
  AccountMovementState,
  getDocumentBlobUrl,
  type AccountMovement,
} from '@/petrol_company/platform_account/api/platform-account.api';

interface Props {
  movements: AccountMovement[];
}

async function openDocument(fileId: string): Promise<void> {
  const url = await getDocumentBlobUrl(fileId);
  window.open(url, '_blank');
}

export function MobilePlatformAccountList({ movements }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      {movements.map((m) => {
        const isCommission = m.kind === AccountMovementKind.COMMISSION_CHARGED;
        const isCashback = m.kind === AccountMovementKind.CASHBACK_CREDITED;
        // spec 017 T148/FR-064/FR-071 — a payout the PLATFORM made to this
        // company. Without this distinction it is indistinguishable from a
        // payment the company made: same positive amount, same row.
        const isPayout = m.kind === AccountMovementKind.CASHBACK_PAID_OUT;
        const created = new Date(m.createdAt);

        return (
          <div key={m._id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  'flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-md text-xs font-bold',
                  isCommission ? 'bg-orange-50 text-orange-600' : isCashback ? 'bg-green-50 text-green-600' : isPayout ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-600',
                )}
              >
                {isCommission ? t('billing.commissionTitle') : isCashback ? t('billing.cashbackTitle') : isPayout ? t('cashback.direction.OUTBOUND') : t('platformAccount.payment')}
              </div>
              <span
                className={cn(
                  'inline-flex items-center justify-center px-3 py-1 text-xs font-bold rounded-md',
                  m.state === AccountMovementState.CONFIRMED ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600',
                )}
              >
                {t(`platformAccount.movementState.${m.state}`)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">{t('platformAccount.method')}</span>
                <span className="text-sm font-semibold text-slate-700">
                  {m.method ? t(`platformAccount.settlementMethod.${m.method}`) : '—'}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-slate-500">{t('platformAccount.amount')}</span>
                <span className="text-lg font-black text-slate-900" dir="ltr">
                  {m.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-semibold text-slate-500">{m.currency}</span>
                </span>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">{t('platformAccount.reference')}</span>
                <span className="text-sm font-semibold text-slate-700">{m.reference ?? '—'}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-slate-500">{t('platformAccount.date')}</span>
                <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                  <span>{created.toLocaleDateString()}</span>
                  <span className="text-xs text-slate-400">{created.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {m.documentFileId && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => void openDocument(m.documentFileId!)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-bold py-2.5 px-4 rounded-xl transition-colors"
                >
                  <img src="/transportCompany/orderPage/download.svg" className="w-4 h-4 object-contain" alt="" />
                  {t('platformAccount.document')}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
