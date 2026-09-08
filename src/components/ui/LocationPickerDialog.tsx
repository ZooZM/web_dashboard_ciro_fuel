import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';
import { LocationPickerMap } from './LocationPickerMap';
import type { LatLng } from '@/lib/maps/maps-url';

export interface LocationPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The currently saved point, used to seed the draft each time the dialog opens. */
  value: LatLng | null;
  /** Called once, on confirm, with the point the operator settled on. */
  onConfirm: (next: LatLng | null) => void;
  countryRestriction?: string | string[];
}

/**
 * The map in a modal, editing a DRAFT.
 *
 * Nothing the operator does inside — panning, searching, jumping to their own position —
 * touches the form until they press confirm. That is the difference between a picker and
 * an editor, and it is the whole reason for the popup: an inline map has no natural
 * "cancel", so every incidental drag while reading the page silently rewrites the field.
 *
 * The draft is re-seeded from `value` on each open rather than held across closes, so
 * dismissing the dialog genuinely discards the attempt instead of leaving it staged for
 * the next one.
 */
export function LocationPickerDialog({
  open,
  onOpenChange,
  value,
  onConfirm,
  countryRestriction,
}: LocationPickerDialogProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<LatLng | null>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>{t('map.dialogTitle')}</DialogTitle>
          <DialogDescription>{t('map.centerHint')}</DialogDescription>
        </DialogHeader>

        <LocationPickerMap
          value={draft}
          onChange={setDraft}
          height="420px"
          countryRestriction={countryRestriction}
        />

        <div className="mt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-xl bg-slate-100 px-6 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            disabled={!draft}
            onClick={() => {
              onConfirm(draft);
              onOpenChange(false);
            }}
            className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {t('map.confirm')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
