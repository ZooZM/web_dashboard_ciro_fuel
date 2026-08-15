import { useTranslation } from 'react-i18next';
import { CompanyStatus } from '@/constants/order-status';
import { cn } from '@/lib/utils';

export function CompanyStatusBadge({ status }: { status: CompanyStatus }) {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
        status === CompanyStatus.ACTIVE
          ? 'bg-green-500/15 text-green-700 dark:text-green-400'
          : 'bg-red-500/15 text-red-700 dark:text-red-400',
      )}
    >
      {status === CompanyStatus.ACTIVE ? t('companies.active') : t('companies.suspended')}
    </span>
  );
}
