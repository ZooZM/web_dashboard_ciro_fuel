import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { LocationPickerDialog } from './LocationPickerDialog';
import { LocationAddress } from './LocationAddress';
import type { LatLng } from '@/lib/maps/maps-url';

export interface LocationFieldProps {
  value: LatLng | null;
  onChange: (next: LatLng | null) => void;
  countryRestriction?: string | string[];
  /** Hides the clear action where the underlying field is required. */
  clearable?: boolean;
  className?: string;
}

/**
 * The drop-in control: a button that opens the map popup, plus a readout of what is
 * currently chosen. This is what pages should use — `LocationPickerDialog` and
 * `LocationPickerMap` are the pieces underneath it.
 *
 * The readout states COORDINATES rather than a reassuring label, because coordinates are
 * the only thing actually stored. A reverse-geocoded street name would read as the
 * authority on where the truck is going while being a guess about a point the operator
 * chose deliberately — and would disagree with what the receiving company opens.
 */
export function LocationField({
  value,
  onChange,
  countryRestriction,
  clearable = true,
  className = '',
}: LocationFieldProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100"
        >
          <MapPin className="h-4 w-4" />
          {value ? t('map.changeLocation') : t('map.chooseLocation')}
        </button>

        <LocationAddress
          value={value}
          className="text-xs font-bold text-slate-700 max-w-md"
          emptyLabel={t('map.noLocationChosen')}
        />

        {value && clearable && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs font-bold text-red-500 transition-colors hover:text-red-600"
          >
            {t('map.clear')}
          </button>
        )}
      </div>

      <LocationPickerDialog
        open={open}
        onOpenChange={setOpen}
        value={value}
        onConfirm={onChange}
        countryRestriction={countryRestriction}
      />
    </div>
  );
}
