import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRejectOrder } from '@/petrol_company/orders/hooks/useOrderActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const MIN_REASON_LENGTH = 5;

export function RejectOrderDialog({ orderId }: { orderId: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const reject = useRejectOrder(orderId);

  function onConfirm(): void {
    reject.mutate({ reason }, { onSuccess: () => setOpen(false) });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">{t('orders.reject')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('orders.reject')}</DialogTitle>
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
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={reject.isPending || reason.trim().length < MIN_REASON_LENGTH}
          >
            {t('common.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
