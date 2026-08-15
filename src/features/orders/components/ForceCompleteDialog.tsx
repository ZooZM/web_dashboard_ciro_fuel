import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForceCompleteOrder } from '@/features/orders/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const MIN_REASON_LENGTH = 5;
const MAX_REASON_LENGTH = 500;

/** Audited override (FR force-complete) — bypasses OTP verification; every use is
 *  permanently flagged on the order's statusHistory with the reason (backend-owned). */
export function ForceCompleteDialog({ orderId }: { orderId: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const forceComplete = useForceCompleteOrder(orderId);

  function onConfirm(): void {
    forceComplete.mutate({ reason }, { onSuccess: () => setOpen(false) });
  }

  const validReason = reason.trim().length >= MIN_REASON_LENGTH && reason.length <= MAX_REASON_LENGTH;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">{t('orders.forceComplete')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('orders.forceComplete')}</DialogTitle>
          <DialogDescription>{t('orders.forceComplete')}</DialogDescription>
        </DialogHeader>
        <Input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t('orders.reason')}
          aria-label={t('orders.reason')}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={forceComplete.isPending || !validReason}>
            {t('common.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
