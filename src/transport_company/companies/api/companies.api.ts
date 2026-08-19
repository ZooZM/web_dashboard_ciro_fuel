import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import { CompanyStatus } from '@/constants/order-status';
import type { Company, OnboardCompanyInput, OnboardCompanyResult } from '@/transport_company/companies/types';

interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
}

export async function listCompanies(page = 1): Promise<Paginated<Company>> {
  const { data } = await apiClient.get<Paginated<Company>>(apiRoutes.companies.list, {
    params: { page },
  });
  return data;
}

export async function getCompany(id: string): Promise<Company> {
  const { data } = await apiClient.get<Company>(apiRoutes.companies.detail(id));
  return data;
}

/** FR-015a: company + initial Company Admin are created atomically by the backend in a
 *  single multipart request — the client never composes this as two calls. */
export async function onboardCompany(input: OnboardCompanyInput): Promise<OnboardCompanyResult> {
  const formData = new FormData();
  formData.append('name', input.name);
  formData.append('commercialRegister', input.commercialRegister);
  formData.append('admin[email]', input.admin.email);
  formData.append('admin[fullName]', input.admin.fullName);
  formData.append('admin[phone]', input.admin.phone);
  formData.append('admin[password]', input.admin.password);

  const { data } = await apiClient.post<OnboardCompanyResult>(apiRoutes.companies.create, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function setCompanyStatus(id: string, status: CompanyStatus): Promise<Company> {
  const { data } = await apiClient.patch<Company>(apiRoutes.companies.status(id), { status });
  return data;
}
