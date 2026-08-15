import { useTranslation } from 'react-i18next';
import { useClientsList, useSetClientActive } from '@/features/clients/hooks/useClients';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CreateClientDialog } from '@/features/clients/components/CreateClientDialog';

export function ClientsPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useClientsList();
  const setActive = useSetClientActive();

  const clients = data?.items ?? [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t('clients.title')}</h1>
        <CreateClientDialog />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">{t('common.loading')}</p>
      ) : clients.length === 0 ? (
        <p className="text-muted-foreground">{t('clients.empty')}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('clients.stationLocation')}</TableHead>
              <TableHead>{t('drivers.active')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.stationLocation.address ?? '—'}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActive.mutate({ id: client.id, isActive: !client.isActive })}
                  >
                    {client.isActive ? t('drivers.active') : t('drivers.inactive')}
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
