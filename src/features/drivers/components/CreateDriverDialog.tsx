import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useCreateDriver } from '@/features/drivers/hooks/useDrivers';
import { FUEL_TYPES, FuelType } from '@/constants/order-status';
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

const createDriverSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  password: z.string().min(8),
  plateNumber: z.string().min(1),
  maxCapacityLiters: z.string().refine((v) => Number(v) > 0, 'Must be a positive number'),
});

type FormValues = z.infer<typeof createDriverSchema>;

export function CreateDriverDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
  const createDriver = useCreateDriver();
  const form = useForm<FormValues>({ resolver: zodResolver(createDriverSchema) });

  function toggleFuelType(type: FuelType): void {
    setFuelTypes((prev) => (prev.includes(type) ? prev.filter((f) => f !== type) : [...prev, type]));
  }

  const onSubmit = form.handleSubmit((values) => {
    createDriver.mutate(
      {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        truck: {
          plateNumber: values.plateNumber,
          maxCapacityLiters: Number(values.maxCapacityLiters),
          fuelTypes,
        },
      },
      { onSuccess: () => setOpen(false) },
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t('drivers.add')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('drivers.add')}</DialogTitle>
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
          <FormField form={form} name="plateNumber" label={t('drivers.plateNumber')}>
            {({ id }) => <Input id={id} {...form.register('plateNumber')} />}
          </FormField>
          <FormField form={form} name="maxCapacityLiters" label={t('drivers.maxCapacity')}>
            {({ id }) => <Input id={id} type="number" {...form.register('maxCapacityLiters')} />}
          </FormField>

          <div>
            <p className="mb-1 text-sm font-medium">{t('drivers.fuelTypes')}</p>
            <div className="flex flex-wrap gap-2">
              {FUEL_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={fuelTypes.includes(type)}
                  onClick={() => toggleFuelType(type)}
                  className={
                    fuelTypes.includes(type)
                      ? 'rounded-md border border-primary bg-primary/10 px-2 py-1 text-xs'
                      : 'rounded-md border px-2 py-1 text-xs'
                  }
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={createDriver.isPending || fuelTypes.length === 0}>
              {t('common.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
