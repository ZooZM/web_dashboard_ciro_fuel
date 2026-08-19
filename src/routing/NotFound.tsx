import { useTranslation } from 'react-i18next';

export function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex h-svh flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-muted-foreground">{t('errors.notFound')}</p>
      <div onClick={()=>window.history.back()} className="text-primary underline cursor-pointer">
        {t('common.back')}
      </div>
    </div>
  );
}
