import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useCreateDriver } from '@/transport_company/drivers/hooks/useDrivers';
import { isSaudiMobile, normalizeSaudiMobile } from '@/lib/auth/phone';
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

// `phone` is validated here and not merely on the server because `CreateUserDto` refuses
// anything without the country prefix: a locally-formatted number (0551234567) passed a
// `min(6)` check, reached the API and came back as an unattributed 400, leaving the
// operator to guess which of four fields the server disliked.
//
// It used to mirror the platform's `E164_PATTERN`, which is deliberately country-agnostic
// — correct for the server, wrong for a Saudi-only fleet, since `+12025550123` satisfied
// it and would have become a driver's record. `isSaudiMobile` also ACCEPTS `05…`, the form
// printed on the driver's own documents, which the old pattern refused outright; the
// normalisation to E.164 happens at submit rather than as a schema `.transform`, which
// would split the schema's input and output types and break `useForm`'s typing.
const createDriverSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().refine(isSaudiMobile, { message: '+9665XXXXXXXX' }),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof createDriverSchema>;

/**
 * Feature 009 Phase 6: no vehicle fields here any more — a driver is created with
 * identity + credentials only (`CreateUserDto`). A truck and tank are chosen at
 * assignment time (see the assignment flow), never stored on the driver.
 */
export function CreateDriverDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const createDriver = useCreateDriver();
  const form = useForm<FormValues>({ resolver: zodResolver(createDriverSchema) });

  const onSubmit = form.handleSubmit((values) => {
    // Unreachable — the schema already refused anything `normalizeSaudiMobile` rejects.
    // It is here to narrow the value, never a non-null assertion.
    const phone = normalizeSaudiMobile(values.phone);
    if (!phone) return;
    createDriver.mutate({ ...values, phone }, { onSuccess: () => setOpen(false) });
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={createDriver.isPending}>
              {t('common.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
