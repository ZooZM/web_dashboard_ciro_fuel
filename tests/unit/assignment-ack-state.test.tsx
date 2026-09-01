import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18n from '@/lib/i18n/i18n';
import { AssignedDriverCard } from '@/transport_company/orders/components/order-details/AssignedDriverCard';
import type { Order } from '@/transport_company/orders/types';

const mockContext = vi.hoisted(() => ({ order: undefined as Order | undefined }));

vi.mock('@/transport_company/orders/components/order-details/OrderDetailContext', () => ({
  useOrderDetailContext: () => ({ orderId: 'order-1', order: mockContext.order, isLoading: false }),
}));

function baseOrder(overrides: Partial<Order>): Order {
  return {
    _id: 'order-1',
    status: 'ASSIGNED_TO_DRIVER',
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
    driverSummary: { fullName: 'Test Driver', phone: '+966500000000', plateNumber: 'ABC-123' },
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
    rating: null,
    assignmentAcknowledgedAt: null,
    assignmentEscalationSmsAt: null,
    assignmentEscalationSkippedReason: null,
    assignedWhileIneligible: false,
    assignedWhileIneligibleReason: null,
    ...overrides,
  } as Order;
}

/**
 * Feature 010 T037/FR-016 (spec Acceptance Scenario US3.3): the three
 * acknowledgment states render distinctly, and an acknowledged order never
 * shows a stale "waiting" state.
 */
describe('Assignment acknowledgment state (spec 010 US3)', () => {
  beforeAll(() => void i18n.changeLanguage('en'));

  it('shows "waiting" when neither acknowledged nor escalated', () => {
    mockContext.order = baseOrder({});
    render(<AssignedDriverCard />);
    expect(screen.getByText(/waiting for the driver to acknowledge/i)).toBeInTheDocument();
  });

  it('shows the SMS-sent state, distinct from waiting, once escalated', () => {
    mockContext.order = baseOrder({
      assignmentEscalationSmsAt: new Date('2026-01-01T10:00:00Z').toISOString(),
    });
    render(<AssignedDriverCard />);
    expect(screen.getByText(/sms sent to the driver at/i)).toBeInTheDocument();
    expect(screen.queryByText(/waiting for the driver to acknowledge/i)).not.toBeInTheDocument();
  });

  it('shows the acknowledged state, even after an SMS was already sent, and never reverts to waiting', () => {
    mockContext.order = baseOrder({
      assignmentEscalationSmsAt: new Date('2026-01-01T10:00:00Z').toISOString(),
      assignmentAcknowledgedAt: new Date('2026-01-01T10:05:00Z').toISOString(),
    });
    render(<AssignedDriverCard />);
    expect(screen.getByText(/acknowledged by the driver at/i)).toBeInTheDocument();
    expect(screen.queryByText(/waiting for the driver to acknowledge/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sms sent to the driver at/i)).not.toBeInTheDocument();
  });

  it('shows the recorded reason when the driver was assigned while offline', () => {
    mockContext.order = baseOrder({
      assignedWhileIneligible: true,
      assignedWhileIneligibleReason: 'Nearest driver, expected back online shortly',
    });
    render(<AssignedDriverCard />);
    expect(screen.getByText('Nearest driver, expected back online shortly')).toBeInTheDocument();
  });
});
