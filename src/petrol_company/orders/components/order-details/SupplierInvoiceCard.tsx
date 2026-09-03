import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useOrderDetailContext } from './OrderDetailContext';
import { useUploadSupplierInvoice, useConfirmSupplierInvoice, useReplaceSupplierInvoice } from '@/petrol_company/orders/hooks/useSupplierInvoice';
import { FUEL_TYPES, FUEL_TYPE_LABEL_KEY, FuelType } from '@/constants/order-status';
import { ApiError } from '@/lib/api/api-error';
import type { UploadSupplierInvoiceResult } from '@/petrol_company/orders/api/supplier-invoice.api';

interface ConfirmFormState {
  quantityLitres: string;
  fuelType: FuelType;
  reference: string;
  issueDate: string;
}

/**
 * Feature 013 T206/FR-073a/FR-073b — the supplier-invoice upload/confirm/replace flow.
 * Every extracted value is correctable, and any value extraction didn't yield is entered
 * by hand (FR-073a-ii/iii) — this form never distinguishes the two once rendered, exactly
 * because `NullSupplierInvoiceExtractor` means every field is routinely blank. The
 * ordered quantity is shown ALONGSIDE the field being confirmed (FR-073a-v), not just in
 * a summary elsewhere, so an implausible shortfall is visible before confirming.
 */
export function SupplierInvoiceCard() {
  const { t } = useTranslation();
  const { orderId, order } = useOrderDetailContext();
  const upload = useUploadSupplierInvoice(orderId);
  const confirm = useConfirmSupplierInvoice(orderId);
  const replace = useReplaceSupplierInvoice(orderId);

  const [pendingUpload, setPendingUpload] = useState<UploadSupplierInvoiceResult | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [form, setForm] = useState<ConfirmFormState | null>(null);

  const current = order?.supplierInvoice;
  const orderedQuantityLitres = order?.quantityLiters ?? 0;

  async function handleFileSelected(file: File) {
    try {
      const result = await upload.mutateAsync(file);
      setPendingUpload(result);
      setForm({
        quantityLitres: result.extracted.quantityLitres != null ? String(result.extracted.quantityLitres) : '',
        fuelType: result.extracted.fuelType ?? order?.fuelType ?? FuelType.DIESEL,
        reference: result.extracted.reference ?? '',
        issueDate: result.extracted.issueDate ?? '',
      });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  async function handleConfirm() {
    if (!pendingUpload || !form) return;
    const quantityLitres = Number(form.quantityLitres);
    if (!Number.isFinite(quantityLitres) || quantityLitres < 0 || !form.reference.trim() || !form.issueDate) {
      toast.error(t('supplierInvoice.formIncomplete'));
      return;
    }
    const input = {
      fileId: pendingUpload.fileId,
      confirmed: { quantityLitres, fuelType: form.fuelType, reference: form.reference.trim(), issueDate: form.issueDate },
    };
    try {
      const result = isReplacing ? await replace.mutateAsync(input) : await confirm.mutateAsync(input);
      if (result.balanceWarning) {
        toast(t('supplierInvoice.balanceWentNegative'), { icon: '⚠️' });
      } else {
        toast.success(t('supplierInvoice.confirmed'));
      }
      setPendingUpload(null);
      setForm(null);
      setIsReplacing(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  function handleCancel() {
    setPendingUpload(null);
    setForm(null);
    setIsReplacing(false);
  }

  const isSaving = confirm.isPending || replace.isPending;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
          <img src="/transportCompany/orderPage/orderDetails/invoice.svg" alt="" className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-black text-[#162155]">{t('supplierInvoice.title')}</h2>
      </div>

      {!pendingUpload && current && !isReplacing && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('supplierInvoice.ordered')}</span>
              <span className="text-sm font-bold text-slate-700">{current.orderedQuantityLitres.toLocaleString()} L</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('supplierInvoice.supplied')}</span>
              <span className="text-sm font-bold text-slate-700">{current.suppliedQuantityLitres.toLocaleString()} L</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('supplierInvoice.fulfilled')}</span>
              <span className="text-sm font-bold text-slate-700">{(current.proportionFulfilled * 100).toFixed(1)}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('supplierInvoice.shortfall')}</span>
              <span className={`text-sm font-bold ${current.shortfallLitres > 0 ? 'text-orange-600' : current.shortfallLitres < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                {current.shortfallLitres.toLocaleString()} L
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{current.confirmed.reference}</span>
            <span>{new Date(current.confirmed.issueDate).toLocaleDateString()}</span>
          </div>
          <button
            onClick={() => setIsReplacing(true)}
            className="self-start text-sm font-bold text-blue-600 hover:underline"
          >
            {t('supplierInvoice.replace')}
          </button>
        </div>
      )}

      {!pendingUpload && (!current || isReplacing) && (
        <label className="w-full border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            disabled={upload.isPending}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFileSelected(file);
            }}
          />
          <span className="text-sm font-bold text-blue-600">
            {upload.isPending ? t('common.loading') : t('supplierInvoice.uploadPrompt')}
          </span>
        </label>
      )}

      {pendingUpload && form && (
        <div className="flex flex-col gap-3">
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t('supplierInvoice.orderedQuantity')}</span>
            <span className="text-sm font-black text-[#162155]">{orderedQuantityLitres.toLocaleString()} L</span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500">{t('supplierInvoice.suppliedQuantity')}</label>
            <input
              type="number"
              min={0}
              value={form.quantityLitres}
              onChange={(e) => setForm({ ...form, quantityLitres: e.target.value })}
              className="border border-slate-200 rounded-xl p-2.5 text-sm font-bold"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500">{t('supplierInvoice.fuelGrade')}</label>
            <select
              value={form.fuelType}
              onChange={(e) => setForm({ ...form, fuelType: e.target.value as FuelType })}
              className="border border-slate-200 rounded-xl p-2.5 text-sm font-bold"
            >
              {FUEL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(FUEL_TYPE_LABEL_KEY[type])}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500">{t('supplierInvoice.reference')}</label>
            <input
              type="text"
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              className="border border-slate-200 rounded-xl p-2.5 text-sm font-bold"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500">{t('supplierInvoice.issueDate')}</label>
            <input
              type="date"
              value={form.issueDate}
              onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
              className="border border-slate-200 rounded-xl p-2.5 text-sm font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-1">
            <button
              onClick={() => void handleConfirm()}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-bold"
            >
              {isSaving ? t('common.loading') : t('supplierInvoice.confirm')}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="bg-white border border-slate-200 text-slate-700 rounded-xl py-2.5 text-sm font-bold"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
