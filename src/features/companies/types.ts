import type { CompanyStatus } from '@/constants/order-status';

export interface Company {
  id: string;
  name: string;
  status: CompanyStatus;
  commercialRegisterFileId: string;
  createdAt: string;
}

export interface OnboardCompanyAdminInput {
  email: string;
  fullName: string;
  phone: string;
  password: string;
}

export interface OnboardCompanyInput {
  name: string;
  commercialRegister: File;
  admin: OnboardCompanyAdminInput;
}

export interface OnboardCompanyResult {
  company: Company;
  admin: { id: string; email: string; fullName: string };
}
