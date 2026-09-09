import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useApproveOrder } from '@/petrol_company/orders/hooks/useOrderActions';
import { apiErrorMessage } from '@/lib/api/api-error';
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

export function ApproveOrderDialog({ orderId, estimatedPrice }: { orderId: string; estimatedPrice: number }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [finalPrice, setFinalPrice] = useState(String(estimatedPrice));
  const approve = useApproveOrder(orderId);

  function onConfirm(): void {
    const parsed = Number(finalPrice);
    approve.mutate(
      { finalPrice: Number.isFinite(parsed) && parsed > 0 ? parsed : undefined },
      {
        onSuccess: () => setOpen(false),
        // There was no onError at all: approval could be refused for a reason the
        // platform states precisely — a CREDIT order over the client's remaining credit,
        // a fuel company past its commission ceiling, no warehouse for the grade, an
        // unset or ambiguous transport price — and every one of them failed silently,
        // leaving the dialog open with nothing said. The message names the one thing
        // that has to change, so it is shown as-is.
        onError: (err) =>
          toast.error(apiErrorMessage(err, t('errors.generic'))),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t('orders.approve')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('orders.approve')}</DialogTitle>
        </DialogHeader>
        <Input
          type="number"
          value={finalPrice}
          onChange={(e) => setFinalPrice(e.target.value)}
          aria-label={t('orders.finalPrice')}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={onConfirm} disabled={approve.isPending}>
            {t('common.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
