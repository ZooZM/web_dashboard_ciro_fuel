import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useOnboardCompany } from '@/features/companies/hooks/useCompanies';
import { toast } from '@/lib/toast/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/ui/form';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];

const onboardSchema = z.object({
  name: z.string().min(2),
  adminEmail: z.string().email(),
  adminFullName: z.string().min(2),
  adminPhone: z.string().min(6),
  adminPassword: z.string().min(8),
});

type FormValues = z.infer<typeof onboardSchema>;

/** FR-015a: onboarding creates the company AND its initial Company Admin atomically in one
 *  backend call; the dashboard composes the request but the atomicity guarantee is owned
 *  by the backend transaction, not asserted here (Constitution V). */
export function OnboardCompanyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onboard = useOnboardCompany();
  const form = useForm<FormValues>({ resolver: zodResolver(onboardSchema) });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const selected = e.target.files?.[0] ?? null;
    if (selected && !ALLOWED_MIME_TYPES.includes(selected.type)) {
      setFileError(t('companies.fileTypeError'));
      setFile(null);
      return;
    }
    if (selected && selected.size > MAX_FILE_SIZE_BYTES) {
      setFileError(t('companies.fileSizeError'));
      setFile(null);
      return;
    }
    setFileError(null);
    setFile(selected);
  }

  const onSubmit = form.handleSubmit((values) => {
    if (!file) {
      setFileError(t('companies.fileRequired'));
      return;
    }
    onboard.mutate(
      {
        name: values.name,
        commercialRegister: file,
        admin: {
          email: values.adminEmail,
          fullName: values.adminFullName,
          phone: values.adminPhone,
          password: values.adminPassword,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('companies.onboardSuccess'));
          navigate('/companies');
        },
      },
    );
  });

  return (
    <div className="max-w-lg">
      <h1 className="mb-4 text-xl font-semibold">{t('companies.onboard')}</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <FormField form={form} name="name" label={t('companies.name')}>
          {({ id }) => <Input id={id} {...form.register('name')} />}
        </FormField>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="commercial-register">{t('companies.commercialRegister')}</Label>
          <Input
            id="commercial-register"
            type="file"
            accept={ALLOWED_MIME_TYPES.join(',')}
            onChange={onFileChange}
          />
          {fileError ? (
            <p className="text-sm text-destructive" role="alert">
              {fileError}
            </p>
          ) : null}
        </div>

        <FormField form={form} name="adminFullName" label={t('companies.adminFullName')}>
          {({ id }) => <Input id={id} {...form.register('adminFullName')} />}
        </FormField>
        <FormField form={form} name="adminEmail" label={t('companies.adminEmail')}>
          {({ id }) => <Input id={id} type="email" {...form.register('adminEmail')} />}
        </FormField>
        <FormField form={form} name="adminPhone" label={t('companies.adminPhone')}>
          {({ id }) => <Input id={id} {...form.register('adminPhone')} />}
        </FormField>
        <FormField form={form} name="adminPassword" label={t('companies.adminPassword')}>
          {({ id }) => <Input id={id} type="password" {...form.register('adminPassword')} />}
        </FormField>

        <Button type="submit" disabled={onboard.isPending} className="self-start">
          {t('common.submit')}
        </Button>
      </form>
    </div>
  );
}
