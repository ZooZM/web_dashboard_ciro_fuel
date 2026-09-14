import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toApiError } from '@/lib/api/api-error';
import {
  useConfirmPhoneChange,
  useRequestPhoneChange,
} from '@/admin/profile/hooks/useOperatorAccount';

interface AdminChangePhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * spec 017 (operator dashboard) T126/FR-060/FR-061 — changing the number the
 * operator signs in with.
 *
 * Two steps, both existing platform routes, unchanged.
 *
 * **The refusal that matters lands at the FIRST step.** Requesting a change to
 * a number another account already holds now returns `409 PHONE_IN_USE` before
 * any SMS is sent — for an administrator's number as well as a client's or
 * driver's. Until this feature the pre-check called a lookup deliberately
 * scoped to `CLIENT`/`DRIVER`, so an administrator changing onto another
 * administrator's number passed it, SPENT a message, and was refused only at
 * confirm by the unique index (research R10). This modal renders that refusal
 * where it now happens, which is the whole point of fixing it.
 *
 * **Confirming does NOT sign the operator out** (FR-062). The platform leaves
 * `sessionGeneration` and `activeSessions` untouched, so their other devices
 * keep working — this modal must never "helpfully" clear the session after a
 * successful change.
 */
export function AdminChangePhoneModal({ isOpen, onClose }: AdminChangePhoneModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2>(1);
  const [newPhone, setNewPhone] = useState('');
  const [code, setCode] = useState('');

  const request = useRequestPhoneChange();
  const confirm = useConfirmPhoneChange();

  if (!isOpen) return null;

  const requestError = request.error ? toApiError(request.error) : null;
  const confirmError = confirm.error ? toApiError(confirm.error) : null;

  function close() {
    setStep(1);
    setNewPhone('');
    setCode('');
    request.reset();
    confirm.reset();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl flex flex-col gap-4 text-right"
        dir="rtl"
      >
        <h2 className="text-lg font-black text-[#162155]">
          {t('operatorAccount.changePhone')}
        </h2>

        {step === 1 && (
          <form
            className="flex flex-col gap-4"
            onSubmit={async (event) => {
              event.preventDefault();
              await request.mutateAsync(newPhone);
              setStep(2);
            }}
          >
            <div className="flex flex-col">
              <label htmlFor="new-phone" className="text-sm font-bold text-slate-700 mb-2">
                {t('operatorAccount.signInNumber')}
              </label>
              <input
                id="new-phone"
                required
                dir="ltr"
                value={newPhone}
                placeholder="+9665XXXXXXXX"
                onChange={(event) => setNewPhone(event.target.value)}
                className="w-full px-4 py-3 border border-[#E7E9EF] rounded-xl text-sm font-medium"
              />
            </div>

            {/*
              FR-061 — stated here, at the request step, because that is where
              the platform now refuses it and where no message has been spent.
            */}
            {requestError && (
              <p className="text-sm font-bold text-red-700">
                {requestError.error === 'PHONE_IN_USE'
                  ? t('operatorAccount.phoneInUse')
                  : requestError.message}
              </p>
            )}

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={request.isPending}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold disabled:opacity-50"
              >
                {request.isPending ? t('common.saving') : t('common.next')}
              </button>
              <button
                type="button"
                onClick={close}
                className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form
            className="flex flex-col gap-4"
            onSubmit={async (event) => {
              event.preventDefault();
              await confirm.mutateAsync(code);
              close();
            }}
          >
            <div className="flex flex-col">
              <label htmlFor="phone-code" className="text-sm font-bold text-slate-700 mb-2">
                {t('operatorAccount.verificationCode')}
              </label>
              <input
                id="phone-code"
                required
                dir="ltr"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="w-full px-4 py-3 border border-[#E7E9EF] rounded-xl text-lg font-black tracking-widest text-center"
              />
            </div>

            {confirmError && (
              <p className="text-sm font-bold text-red-700">{confirmError.message}</p>
            )}

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={confirm.isPending}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold disabled:opacity-50"
              >
                {confirm.isPending ? t('common.saving') : t('common.confirm')}
              </button>
              <button
                type="button"
                onClick={close}
                className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
