import { useTranslation } from 'react-i18next';
import { useDriversList, useSetDriverActive } from '@/features/drivers/hooks/useDrivers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CreateDriverDialog } from '@/features/drivers/components/CreateDriverDialog';

export function DriversPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useDriversList();
  const setActive = useSetDriverActive();

  const drivers = data?.items ?? [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t('drivers.title')}</h1>
        <CreateDriverDialog />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">{t('common.loading')}</p>
      ) : drivers.length === 0 ? (
        <p className="text-muted-foreground">{t('drivers.empty')}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('drivers.plateNumber')}</TableHead>
              <TableHead>{t('drivers.maxCapacity')}</TableHead>
              <TableHead>{t('drivers.fuelTypes')}</TableHead>
              <TableHead>{t('drivers.active')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.truck.plateNumber}</TableCell>
                <TableCell>{driver.truck.maxCapacityLiters}</TableCell>
                <TableCell>{driver.truck.fuelTypes.join(', ')}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActive.mutate({ id: driver.id, isActive: !driver.isActive })}
                  >
                    {driver.isActive ? t('drivers.active') : t('drivers.inactive')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
