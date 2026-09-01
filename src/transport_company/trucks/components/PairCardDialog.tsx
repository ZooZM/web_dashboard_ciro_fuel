import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CardCaptureField } from '@/transport_company/trucks/components/CardCaptureField';
import { usePairCard } from '@/transport_company/trucks/hooks/usePairCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/lib/toast/toast';
import type { Truck } from '@/transport_company/trucks/types';

/**
 * Feature 009 T086: pairs a card to an EXISTING truck (from the fleet list) — the
 * creation-time path lives inline in AddTruckForm, reusing the same CardCaptureField.
 * Capture is armed only while this dialog is open (FR-048).
 */
export function PairCardDialog({ truck }: { truck: Truck }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const pairCard = usePairCard(truck.id);

  function onConfirm(uid: string): void {
    pairCard.mutate(uid, {
      onSuccess: () => setOpen(false),
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {truck.hasCard ? t('trucks.pairing.rePair') : t('trucks.pairing.pair')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('trucks.pairing.title', { plate: truck.plateNumber })}</DialogTitle>
        </DialogHeader>
        <CardCaptureField
          armed={open}
          targetLabel={truck.plateNumber}
          onConfirm={onConfirm}
          disabled={pairCard.isPending}
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            {t('common.cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
