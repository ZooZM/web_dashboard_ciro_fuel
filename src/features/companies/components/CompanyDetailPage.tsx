import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCompanyDetail, useSetCompanyStatus } from '@/features/companies/hooks/useCompanies';
import { CompanyStatusBadge } from '@/features/companies/components/CompanyStatusBadge';
import { Button } from '@/components/ui/button';
import { CompanyStatus } from '@/constants/order-status';

export function CompanyDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const companyId = id ?? '';
  const { data: company, isLoading } = useCompanyDetail(companyId);
  const setStatus = useSetCompanyStatus(companyId);

  if (isLoading || !company) {
    return <p className="text-muted-foreground">{t('common.loading')}</p>;
  }

  const isActive = company.status === CompanyStatus.ACTIVE;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">{company.name}</h1>
        <CompanyStatusBadge status={company.status} />
      </div>

      <Button
        variant={isActive ? 'destructive' : 'default'}
        className="self-start"
        onClick={() => setStatus.mutate(isActive ? CompanyStatus.SUSPENDED : CompanyStatus.ACTIVE)}
        disabled={setStatus.isPending}
      >
        {isActive ? t('companies.suspend') : t('companies.activate')}
      </Button>
    </div>
  );
}
