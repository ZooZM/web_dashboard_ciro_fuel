// `erasableSyntaxOnly` forbids runtime `enum` — this object+type pattern gives the same
// call-site syntax (e.g. `OrderStatus.APPROVED`) while remaining fully erasable.
export const OrderStatus = {
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  IN_TRANSIT: 'IN_TRANSIT',
  UNLOADING: 'UNLOADING',
  DELIVERED: 'DELIVERED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const CompanyStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;

export type CompanyStatus = (typeof CompanyStatus)[keyof typeof CompanyStatus];

export const FuelType = {
  OCTANE_91: '91',
  OCTANE_95: '95',
  OCTANE_98: '98',
  DIESEL: 'DIESEL',
} as const;

export type FuelType = (typeof FuelType)[keyof typeof FuelType];

export const FUEL_TYPES: readonly FuelType[] = [
  FuelType.OCTANE_91,
  FuelType.OCTANE_95,
  FuelType.OCTANE_98,
  FuelType.DIESEL,
];

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export const DEFAULT_LANGUAGE: Language = 'ar';

export function directionForLanguage(language: Language): Direction {
  return language === 'ar' ? 'rtl' : 'ltr';
}
