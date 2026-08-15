import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function Forbidden() {
  const { t } = useTranslation();
  return (
    <div className="flex h-svh flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold">403</h1>
      <p className="text-muted-foreground">{t('errors.forbidden')}</p>
      <Link to="/" className="text-primary underline">
        {t('common.back')}
      </Link>
    </div>
  );
}
