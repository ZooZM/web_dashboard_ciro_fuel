import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateTruck } from '@/transport_company/trucks/hooks/useTrucks';
import { usePairCard } from '@/transport_company/trucks/hooks/usePairCard';
import { CardCaptureField } from '@/transport_company/trucks/components/CardCaptureField';
import { toast } from '@/lib/toast/toast';

interface AddTruckFormProps {
  onCancel: () => void;
  entityName: string;
}

/**
 * Feature 009 T084/FR-039/FR-045: wired to real creation (`POST /trucks`) and, once
 * created, real card pairing — the NFC placeholder this form already had is now the live
 * CardCaptureField rather than static markup. Capture is armed only once a truck exists to
 * pair the card to and this form is still open (FR-048).
 */
export function AddTruckForm({ onCancel, entityName }: AddTruckFormProps) {
  const { t } = useTranslation();
  const [plateNumber, setPlateNumber] = useState('');
  const [model, setModel] = useState('');
  const [createdTruckId, setCreatedTruckId] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  const createTruck = useCreateTruck();
  const pairCard = usePairCard(createdTruckId ?? '');

  function onCreate(): void {
    if (!plateNumber.trim()) return;
    createTruck.mutate(
      { plateNumber: plateNumber.trim(), model: model.trim() || undefined },
      {
        onSuccess: (truck) => setCreatedTruckId(truck.id),
        onError: () => toast.error(t('trucks.duplicatePlate')),
      },
    );
  }

  function onPairConfirm(uid: string): void {
    pairCard.mutate(uid, {
      onSuccess: () => {
        setOpen(false);
        onCancel();
      },
      onError: (error) => {
        const details = (error as { details?: { heldByPlateNumber?: string } }).details;
        toast.error(
          details?.heldByPlateNumber
            ? t('trucks.pairing.alreadyPairedNamed', { plate: details.heldByPlateNumber })
            : t('trucks.pairing.alreadyPaired'),
        );
      },
    });
  }

  return (
    <div className="flex flex-col gap-8 w-full relative pb-16">
      {/* Step 1: plate + model */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 text-right">{t('trucks.plateNumber')}</label>
          <input
            type="text"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            disabled={Boolean(createdTruckId)}
            dir="ltr"
            className="w-full h-14 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm text-right disabled:bg-slate-50"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 text-right">{t('trucks.model')}</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={Boolean(createdTruckId)}
            className="w-full h-14 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm text-right disabled:bg-slate-50"
          />
        </div>
      </div>

      {/* Step 2: pair the card, once the truck exists */}
      {createdTruckId && (
        <div className="w-full max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex justify-center items-center gap-2">
            <span className="text-base font-bold text-slate-900">{t('trucks.pairing.title', { plate: plateNumber })}</span>
          </div>
          <CardCaptureField
            armed={open}
            targetLabel={plateNumber}
            onConfirm={onPairConfirm}
            disabled={pairCard.isPending}
          />
        </div>
      )}

      <div className="absolute bottom-0 left-0 flex items-center justify-start gap-3">
        <button
          onClick={() => {
            setOpen(false);
            onCancel();
          }}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 px-6 py-2.5 rounded-xl transition-colors text-sm font-bold"
        >
          {t('common.cancel')}
        </button>
        {!createdTruckId && (
          <button
            onClick={onCreate}
            disabled={createTruck.isPending || !plateNumber.trim()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-colors text-sm font-bold shadow-sm disabled:opacity-50"
          >
            {t('trucks.addEntity', { entity: entityName })}
          </button>
        )}
      </div>
    </div>
  );
}
