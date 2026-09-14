import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  AccountMovementKind,
  AccountMovementState,
  getDocumentBlobUrl,
  type AccountMovement,
} from '@/petrol_company/platform_account/api/platform-account.api';

async function openDocument(fileId: string): Promise<void> {
  const url = await getDocumentBlobUrl(fileId);
  window.open(url, '_blank');
}

interface Props {
  movements: AccountMovement[];
}

// T172: RECORDED is visibly distinct from CONFIRMED and never presented as paid — this
// role has no confirm action at all (that's `SUPER_ADMIN`, FR-069); it only ever reads
// which state a movement is in.
export function DesktopPlatformAccountTable({ movements }: Props) {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:block w-full overflow-x-auto pb-4">
      <table className="w-full text-right border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="py-4 px-4 text-xs font-bold text-slate-500 bg-slate-50">{t('platformAccount.type')}</th>
            <th className="py-4 px-4 text-xs font-bold text-slate-500 bg-slate-50 text-center">{t('platformAccount.amount')}</th>
            <th className="py-4 px-4 text-xs font-bold text-slate-500 bg-slate-50">{t('platformAccount.method')}</th>
            <th className="py-4 px-4 text-xs font-bold text-slate-500 bg-slate-50">{t('platformAccount.reference')}</th>
            <th className="py-4 px-4 text-xs font-bold text-slate-500 bg-slate-50 text-center">{t('platformAccount.date')}</th>
            <th className="py-4 px-4 text-xs font-bold text-slate-500 bg-slate-50 text-center">{t('platformAccount.state')}</th>
            <th className="py-4 px-4 text-xs font-bold text-slate-500 bg-slate-50 text-center">{t('platformAccount.document')}</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((m) => {
            const isCommission = m.kind === AccountMovementKind.COMMISSION_CHARGED;
            const isCashback = m.kind === AccountMovementKind.CASHBACK_CREDITED;
            // spec 017 T148/FR-064/FR-071 — a payout the PLATFORM made to this
            // company. Without this distinction it is indistinguishable from a
            // payment the company made: same positive amount, same row.
            const isPayout = m.kind === AccountMovementKind.CASHBACK_PAID_OUT;
            const created = new Date(m.createdAt);
            return (
              <tr key={m._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-4 align-middle">
                  <div
                    className={cn(
                      'flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-md text-xs font-bold',
                      isCommission ? 'bg-orange-50 text-orange-600' : isCashback ? 'bg-green-50 text-green-600' : isPayout ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-600',
                    )}
                  >
                    {isCommission ? t('billing.commissionTitle') : isCashback ? t('billing.cashbackTitle') : isPayout ? t('cashback.direction.OUTBOUND') : t('platformAccount.payment')}
                  </div>
                </td>
                <td className="py-4 px-4 align-middle text-center">
                  <span className="text-sm font-black text-slate-900" dir="ltr">
                    {m.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {m.currency}
                  </span>
                </td>
                <td className="py-4 px-4 align-middle">
                  <span className="text-sm font-semibold text-slate-600">
                    {m.method ? t(`platformAccount.settlementMethod.${m.method}`) : '—'}
                  </span>
                </td>
                <td className="py-4 px-4 align-middle">
                  <span className="text-sm font-semibold text-slate-600">{m.reference ?? '—'}</span>
                </td>
                <td className="py-4 px-4 align-middle text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-slate-600">{created.toLocaleDateString()}</span>
                    <span className="text-xs font-semibold text-slate-400">{created.toLocaleTimeString()}</span>
                  </div>
                </td>
                <td className="py-4 px-4 align-middle text-center">
                  <span
                    className={cn(
                      'inline-flex items-center justify-center px-3 py-1 text-xs font-bold rounded-md',
                      m.state === AccountMovementState.CONFIRMED ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600',
                    )}
                  >
                    {t(`platformAccount.movementState.${m.state}`)}
                  </span>
                </td>
                <td className="py-4 px-4 align-middle text-center">
                  {m.documentFileId ? (
                    <button
                      onClick={() => void openDocument(m.documentFileId!)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors mx-auto flex items-center justify-center w-fit"
                    >
                      <img src="/transportCompany/orderPage/download.svg" className="w-4 h-4 object-contain" alt="" />
                    </button>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
