import { useQuery } from '@tanstack/react-query';
import * as api from '@/admin/transport_companies/api/transport-companies.api';

const QK = {
  list: ['admin', 'transport-companies'] as const,
};

/**
 * spec 017 (operator dashboard) T015/FR-025 — every transport company on the
 * platform.
 *
 * Reads `GET /companies?type=TRANSPORT`. Before this feature the platform
 * ignored `type` entirely (research R2), so this list could not have existed:
 * it would have returned the fuel companies too.
 */
export function useTransportCompaniesList() {
  return useQuery({
    queryKey: QK.list,
    queryFn: () => api.listTransportCompanies(),
  });
}
