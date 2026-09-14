import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { CompanyType, OrderStatusBucket } from '@/constants/order-status';

/**
 * spec 017 (operator dashboard) T031/US1 — the operator's home screen in one
 * request.
 *
 * Mirrors `src/modules/platform/dto/platform-overview.dto.ts`. Two things about
 * this shape are load-bearing on the screen:
 *
 *  - **`period` and `pointInTime` are bounded differently** (FR-002). Changing
 *    the date range moves the first and must leave the second alone — a company
 *    that exists, exists.
 *  - **There is no trend field, at any level** (FR-009). The platform computes
 *    no period-over-period comparison, so the six trend captions the mock
 *    rendered were fabricated. They are removed rather than recomputed here.
 */
export type PeriodFigureBasis = 'RAISED_IN_PERIOD' | 'DELIVERED_IN_PERIOD';

export interface PlatformOverview {
  period: {
    from: string;
    to: string;
    /** FR-005 — whether the range was defaulted to the current calendar month. */
    isDefault: boolean;
    /** Orders RAISED in the period, every state. */
    orderCount: number;
    /** DELIVERED orders only. */
    orderValue: number;
    /** DELIVERED orders only. */
    litresMoved: number;
    /**
     * FR-001a — the three figures above do NOT share one basis, and the
     * platform says so rather than leaving it to be inferred. Rendered as a
     * caption so an operator comparing the order count against the trading
     * volume is not looking at what appears to be a contradiction.
     */
    basis: {
      orderCount: PeriodFigureBasis;
      orderValue: PeriodFigureBasis;
      litresMoved: PeriodFigureBasis;
    };
  };
  /** NOT bounded by the period (FR-002). */
  pointInTime: {
    fuelCompanies: number;
    transportCompanies: number;
    stations: number;
  };
  breakdown: {
    byCompanyType: { type: CompanyType; count: number }[];
    /** All six buckets, including zeros, summing to `period.orderCount` (FR-006). */
    byOrderBucket: { bucket: OrderStatusBucket; count: number }[];
  };
}

export interface PlatformOverviewParams {
  from?: string;
  to?: string;
}

export async function getPlatformOverview(
  params: PlatformOverviewParams = {},
): Promise<PlatformOverview> {
  const { data } = await apiClient.get<PlatformOverview>(apiRoutes.platform.overview, {
    params,
  });
  return data;
}

/**
 * spec 017 T070a/FR-026 — order volume for a PAGE of transport companies.
 *
 * One call for the whole page, never one per row (FR-026b). The column sits on
 * every row of a list the operator opens constantly; a request per row would be
 * an N+1 over the platform's whole order collection.
 */
export interface TransportCompanyVolumes {
  from: string;
  to: string;
  isDefault: boolean;
  items: { companyId: string; orderCount: number }[];
}

export async function getTransportCompanyVolumes(params: {
  companyIds: string[];
  from?: string;
  to?: string;
}): Promise<TransportCompanyVolumes> {
  const { data } = await apiClient.get<TransportCompanyVolumes>(
    apiRoutes.platform.transportCompanyVolumes,
    {
      params: {
        companyIds: params.companyIds.join(','),
        ...(params.from ? { from: params.from } : {}),
        ...(params.to ? { to: params.to } : {}),
      },
    },
  );
  return data;
}
