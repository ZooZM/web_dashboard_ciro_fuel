import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCompaniesList } from '@/transport_company/companies/hooks/useCompanies';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CompanyStatusBadge } from '@/transport_company/companies/components/CompanyStatusBadge';

export function CompaniesListPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useCompaniesList();

  const companies = data?.items ?? [];

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t('companies.title')}</h1>
        <Button asChild>
          <Link to="/companies/new">{t('companies.onboard')}</Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">{t('common.loading')}</p>
      ) : companies.length === 0 ? (
        <p className="text-muted-foreground">{t('companies.empty')}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('companies.name')}</TableHead>
              <TableHead>{t('companies.status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <Link to={`/companies/${company.id}`} className="hover:underline">
                    {company.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <CompanyStatusBadge status={company.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
