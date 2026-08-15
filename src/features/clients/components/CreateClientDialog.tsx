import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useCreateClient } from '@/features/clients/hooks/useClients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const createClientSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  password: z.string().min(8),
  address: z.string().min(2),
  lat: z.string().refine((v) => Number.isFinite(Number(v)), 'Must be a number'),
  lng: z.string().refine((v) => Number.isFinite(Number(v)), 'Must be a number'),
});

type FormValues = z.infer<typeof createClientSchema>;

export function CreateClientDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const createClient = useCreateClient();
  const form = useForm<FormValues>({ resolver: zodResolver(createClientSchema) });

  const onSubmit = form.handleSubmit((values) => {
    createClient.mutate(
      {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        stationLocation: { lat: Number(values.lat), lng: Number(values.lng), address: values.address },
      },
      { onSuccess: () => setOpen(false) },
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t('clients.add')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('clients.add')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <FormField form={form} name="fullName" label={t('common.fullName')}>
            {({ id }) => <Input id={id} {...form.register('fullName')} />}
          </FormField>
          <FormField form={form} name="email" label={t('auth.login.email')}>
            {({ id }) => <Input id={id} type="email" {...form.register('email')} />}
          </FormField>
          <FormField form={form} name="phone" label={t('companies.adminPhone')}>
            {({ id }) => <Input id={id} {...form.register('phone')} />}
          </FormField>
          <FormField form={form} name="password" label={t('auth.login.password')}>
            {({ id }) => <Input id={id} type="password" {...form.register('password')} />}
          </FormField>
          <FormField form={form} name="address" label={t('clients.stationLocation')}>
            {({ id }) => <Input id={id} {...form.register('address')} />}
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField form={form} name="lat" label={t('clients.latitude')}>
              {({ id }) => <Input id={id} type="number" step="any" {...form.register('lat')} />}
            </FormField>
            <FormField form={form} name="lng" label={t('clients.longitude')}>
              {({ id }) => <Input id={id} type="number" step="any" {...form.register('lng')} />}
            </FormField>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={createClient.isPending}>
              {t('common.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
