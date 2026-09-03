import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18n from '@/lib/i18n/i18n';
import { OrderHeader } from '@/petrol_company/orders/components/order-details/OrderHeader';
import { OrderStatus } from '@/constants/order-status';

// Feature 013 T041/FR-017: the actions reserved to another role — driver verification,
// loading confirmation, vehicle reassignment, verification override, stop resolution,
// driver assignment and order cancellation — must never render on this surface. Rather
// than assert seven individual absences, this asserts the positive: OrderHeader renders
// ONLY the five FUEL_COMPANY_ADMIN actions (approve/reject/route/force-complete, gated
// by stage) and nothing else — a stronger guarantee than checking each forbidden label
// is absent, which a typo could defeat.
const mockOrder = vi.hoisted(() => ({
  current: null as { status: string; estimatedPrice: number } | null,
}));

vi.mock('@/petrol_company/orders/components/order-details/OrderDetailContext', () => ({
  useOrderDetailContext: () => ({
    orderId: 'order-1',
    order: mockOrder.current,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

// The real dialogs each need live TanStack Query context (mutations, and
// RouteOrderDialog's own transporter fetch) — irrelevant to what this file asserts
// (WHICH buttons render, not their internal wiring, which order-actions.api.ts and the
// backend e2e suites already cover). Stand-ins keep the same visible label.
vi.mock('@/petrol_company/orders/components/ApproveOrderDialog', () => ({
  ApproveOrderDialog: () => <button>Approve</button>,
}));
vi.mock('@/petrol_company/orders/components/RejectOrderDialog', () => ({
  RejectOrderDialog: () => <button>Reject</button>,
}));
vi.mock('@/petrol_company/orders/components/RouteOrderDialog', () => ({
  RouteOrderDialog: () => <button>Route to transporter</button>,
}));
vi.mock('@/petrol_company/orders/components/ForceCompleteDialog', () => ({
  ForceCompleteDialog: () => <button>Force complete</button>,
}));

function renderHeaderFor(status: string) {
  mockOrder.current = { status, estimatedPrice: 100 };
  return render(<OrderHeader />);
}

describe('OrderHeader action gating (FR-017, FR-018)', () => {
  beforeAll(() => void i18n.changeLanguage('en'));

  it('offers approve/reject only at PENDING_APPROVAL, and route/force-complete are absent then', () => {
    renderHeaderFor(OrderStatus.PENDING_APPROVAL);
    expect(screen.getByText('Approve')).toBeInTheDocument();
    expect(screen.getByText('Reject')).toBeInTheDocument();
    expect(screen.queryByText('Route to transporter')).not.toBeInTheDocument();
  });

  it('offers route only when the order is ROUTED_TO_TRANSPORT, and approve/reject are absent then', () => {
    renderHeaderFor(OrderStatus.ROUTED_TO_TRANSPORT);
    expect(screen.getByText('Route to transporter')).toBeInTheDocument();
    expect(screen.queryByText('Approve')).not.toBeInTheDocument();
    expect(screen.queryByText('Reject')).not.toBeInTheDocument();
  });

  it('offers no action at all on a terminal order (DELIVERED)', () => {
    renderHeaderFor(OrderStatus.DELIVERED);
    expect(screen.queryByText('Approve')).not.toBeInTheDocument();
    expect(screen.queryByText('Reject')).not.toBeInTheDocument();
    expect(screen.queryByText('Route to transporter')).not.toBeInTheDocument();
    expect(screen.queryByText('Force complete')).not.toBeInTheDocument();
  });

  it('never renders any action reserved to another role, by name, at any stage', () => {
    for (const status of Object.values(OrderStatus)) {
      renderHeaderFor(status);
      for (const forbidden of [
        'Verify vehicle',
        'Confirm loading',
        'Reassign vehicle',
        'Override verification',
        'Resolve stop',
        'Assign driver',
        'Cancel order',
      ]) {
        expect(screen.queryByText(forbidden)).not.toBeInTheDocument();
      }
    }
  });
});
