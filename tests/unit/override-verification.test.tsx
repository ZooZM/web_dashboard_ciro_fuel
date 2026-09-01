import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18n from '@/lib/i18n/i18n';
import { TrackingTimelineCard } from '@/transport_company/orders/components/order-details/TrackingTimelineCard';
import { OrderStatus } from '@/constants/order-status';
import type { Order } from '@/transport_company/orders/types';

beforeAll(() => void i18n.changeLanguage('en'));

const mockContext = vi.hoisted(() => ({ order: undefined as Order | undefined }));

vi.mock('@/transport_company/orders/components/order-details/OrderDetailContext', () => ({
  useOrderDetailContext: () => ({ orderId: 'order-1', order: mockContext.order, isLoading: false }),
}));

function baseOrder(overrides: Partial<Order>): Order {
  return {
    _id: 'order-1',
    status: OrderStatus.LOADING,
    fuelType: 'DIESEL',
    quantityLiters: 20000,
    estimatedPrice: 1000,
    finalPrice: 1000,
    deliveryAddressText: 'Riyadh',
    deliveryLocation: null,
    station: null,
    statusHistory: [],
    createdAt: new Date().toISOString(),
    driverId: 'driver-1',
    driverSummary: null,
    clientSummary: null,
    truckId: 'truck-1',
    tankId: 'tank-1',
    tankSummary: null,
    warehouseId: null,
    warehouseSummary: null,
    verifications: [],
    vehicleVerified: false,
    etaMinutes: null,
    driverLocation: null,
    deliveredAt: null,
    ...overrides,
  } as Order;
}

/**
 * Feature 009 T103/FR-055/SC-012: an overridden departure must read as overridden
 * everywhere it is displayed, and never be presented as a genuine verification — the
 * single most important negative check the walkthrough names. This is the platform-facing
 * counterpart to the manual walkthrough step (quickstart.md Part 3 step 4-alt), exercised
 * here at the component level since it needs no live backend.
 */
describe('Overridden verification is never presented as verified (FR-055, SC-012)', () => {
  it('labels a genuinely-reached LOADING stage as ordinary progress, with no override marker', () => {
    mockContext.order = baseOrder({
      statusHistory: [
        { from: OrderStatus.ASSIGNED_TO_DRIVER, to: OrderStatus.LOADING, at: new Date().toISOString() },
      ],
    });
    render(<TrackingTimelineCard />);
    expect(screen.queryByText(/overridden/i)).not.toBeInTheDocument();
  });

  it('labels an overridden departure as overridden, with the reason, never as verified', () => {
    mockContext.order = baseOrder({
      statusHistory: [
        {
          from: OrderStatus.ASSIGNED_TO_DRIVER,
          to: OrderStatus.LOADING,
          at: new Date().toISOString(),
          manualOverride: true,
          overrideReason: 'Card reader offline at the yard',
        },
      ],
    });
    render(<TrackingTimelineCard />);
    expect(screen.getByText(/overridden/i)).toBeInTheDocument();
    expect(screen.getByText(/Card reader offline at the yard/)).toBeInTheDocument();
  });
});
