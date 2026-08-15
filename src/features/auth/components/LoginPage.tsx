import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { t } = useTranslation();
  const loginMutation = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit((values) => {
    loginMutation.mutate(values);
  });

  return (
    <div className="flex h-svh w-full items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm flex flex-col gap-4 rounded-lg border p-6">
        <h1 className="text-xl font-semibold text-center">{t('auth.login.title')}</h1>

        <FormField form={form} name="email" label={t('auth.login.email')}>
          {({ id }) => <Input id={id} type="email" autoComplete="email" {...form.register('email')} />}
        </FormField>

        <FormField form={form} name="password" label={t('auth.login.password')}>
          {({ id }) => (
            <Input id={id} type="password" autoComplete="current-password" {...form.register('password')} />
          )}
        </FormField>

        {loginMutation.isError ? (
          <p className="text-sm text-destructive" role="alert">
            {t('auth.login.invalidCredentials')}
          </p>
        ) : null}

        <Button type="submit" disabled={loginMutation.isPending}>
          {t('auth.login.submit')}
        </Button>
      </form>
    </div>
  );
}
