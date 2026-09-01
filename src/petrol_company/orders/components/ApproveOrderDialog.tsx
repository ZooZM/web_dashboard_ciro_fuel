import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApproveOrder } from '@/petrol_company/orders/hooks/useOrderActions';
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
      { onSuccess: () => setOpen(false) },
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
