import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteOrder } from '@/petrol_company/orders/hooks/useOrderActions';
import { useTransporters } from '@/petrol_company/companies/hooks/useTransporters';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// FR-014: routes an APPROVED order to one of the administrator's own affiliated
// transporters — the picker is sourced from the real fleet (T086a's listing endpoint),
// never a hardcoded list.
export function RouteOrderDialog({ orderId }: { orderId: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [transportCompanyId, setTransportCompanyId] = useState<string>('');
  const { data: transporters, isLoading } = useTransporters();
  const route = useRouteOrder(orderId);

  function onConfirm(): void {
    if (!transportCompanyId) return;
    route.mutate({ transportCompanyId }, { onSuccess: () => setOpen(false) });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t('orders.route')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('orders.route')}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p className="text-sm text-slate-400">{t('common.loading')}</p>
        ) : !transporters || transporters.length === 0 ? (
          <p className="text-sm text-slate-400">{t('companies.empty')}</p>
        ) : (
          <Select value={transportCompanyId} onValueChange={setTransportCompanyId}>
            <SelectTrigger>
              <SelectValue placeholder={t('orders.selectTransporter')} />
            </SelectTrigger>
            <SelectContent>
              {transporters.map((transporter) => (
                <SelectItem key={transporter._id} value={transporter._id}>
                  {transporter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={onConfirm} disabled={route.isPending || !transportCompanyId}>
            {t('common.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
