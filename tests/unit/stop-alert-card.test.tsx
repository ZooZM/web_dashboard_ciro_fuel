import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18n from '@/lib/i18n/i18n';
import { StopAlertCard } from '@/transport_company/orders/components/order-details/StopAlertCard';
import { StopOrigin, StopReason } from '@/constants/stop-events';
import type { Order, StopEvent } from '@/transport_company/orders/types';

const mockContext = vi.hoisted(() => ({ order: undefined as Order | undefined }));

vi.mock('@/transport_company/orders/components/order-details/OrderDetailContext', () => ({
  useOrderDetailContext: () => ({ orderId: 'order-1', order: mockContext.order, isLoading: false }),
}));

vi.mock('@/transport_company/orders/hooks/useStopAlert', () => ({
  useResolveStop: () => ({ mutate: vi.fn(), isPending: false }),
}));

function stop(overrides: Partial<StopEvent>): StopEvent {
  return {
    _id: 'stop-1',
    origin: StopOrigin.DETECTED,
    detectedAt: new Date('2026-08-28T09:00:00Z').toISOString(),
    location: null,
    reason: null,
    reasonText: null,
    reasonGivenAt: null,
    expectedDurationMinutes: null,
    suppressedUntil: null,
    escalatedAt: null,
    resolvedAt: null,
    resolvedBy: null,
    ...overrides,
  };
}

function orderWith(stopEvents: StopEvent[]): Order {
  return {
    _id: 'order-1',
    status: 'IN_TRANSIT',
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
    vehicleVerified: true,
    etaMinutes: null,
    driverLocation: null,
    deliveredAt: null,
    rating: null,
    assignmentAcknowledgedAt: null,
    assignmentEscalationSmsAt: null,
    assignmentEscalationSkippedReason: null,
    assignedWhileIneligible: false,
    assignedWhileIneligibleReason: null,
    stopEvents,
  } as Order;
}

/**
 * spec 011 T050 (FR-011, FR-013, US4.2): the four states an administrator
 * has to be able to tell apart at a glance, and the one case that must show
 * nothing at all.
 *
 * The states are derived from three nullable timestamps rather than stored,
 * so the ordering of those checks IS the behaviour — an escalated stop that
 * read as merely "waiting", or a declared stop that read as "handled",
 * would be a plausible-looking card that misinforms the person acting on it.
 */
describe('StopAlertCard (spec 011 US4)', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('en');
  });

  it('renders no card at all for an order with no stop events (FR-013)', () => {
    mockContext.order = orderWith([]);
    const { container } = render(<StopAlertCard />);
    // Not an empty state, not a "no alerts" placeholder — nothing. A
    // permanent reassuring panel is what makes a real alert easy to miss.
    expect(container).toBeEmptyDOMElement();
  });

  it('shows a detected, unanswered stop as awaiting the driver', () => {
    mockContext.order = orderWith([stop({})]);
    render(<StopAlertCard />);
    expect(screen.getByText(i18n.t('stopAlert.state.waiting'))).toBeTruthy();
  });

  it('shows an escalated stop as a non-response, distinctly from waiting', () => {
    mockContext.order = orderWith([stop({ escalatedAt: new Date().toISOString() })]);
    render(<StopAlertCard />);
    expect(screen.getByText(i18n.t('stopAlert.state.escalated'))).toBeTruthy();
    expect(screen.queryByText(i18n.t('stopAlert.state.waiting'))).toBeNull();
    expect(screen.getByText(i18n.t('stopAlert.noResponse'))).toBeTruthy();
  });

  it('shows an answered stop with the driver’s own words (US4.2)', () => {
    mockContext.order = orderWith([
      stop({
        reason: StopReason.OTHER,
        reasonText: 'Police checkpoint on the ring road',
        reasonGivenAt: new Date().toISOString(),
        resolvedAt: new Date().toISOString(),
      }),
    ]);
    render(<StopAlertCard />);
    // The verbatim text is the only part an administrator can actually act
    // on — a generic "the driver gave a reason" would discard it.
    expect(screen.getByText(/Police checkpoint on the ring road/)).toBeTruthy();
  });

  it('shows a declared stop as planned, not as one the driver had to be asked about', () => {
    mockContext.order = orderWith([
      stop({
        origin: StopOrigin.DECLARED,
        reason: StopReason.REST_OR_PRAYER,
        reasonGivenAt: new Date().toISOString(),
        resolvedAt: new Date().toISOString(),
        expectedDurationMinutes: 20,
      }),
    ]);
    render(<StopAlertCard />);
    // FR-008c: visibly distinct from a detected stop. A declaration is
    // resolved at creation, so the naive `resolvedAt` check would render it
    // as "handled" and lose the fact that the driver volunteered it.
    expect(screen.getByText(i18n.t('stopAlert.state.declared'))).toBeTruthy();
    expect(screen.queryByText(i18n.t('stopAlert.state.resolved'))).toBeNull();
    expect(screen.getByText(i18n.t('stopAlert.reason.REST_OR_PRAYER'))).toBeTruthy();
  });

  it('feature 013 US5a: shows a BLOCKED report with the driver’s reason and NOT the awaiting-answer treatment', () => {
    mockContext.order = orderWith([
      stop({
        origin: StopOrigin.BLOCKED,
        reason: StopReason.ROAD_CLOSURE,
        reasonText: 'Bridge closed, no diversion signposted',
        reasonGivenAt: new Date().toISOString(),
        escalatedAt: new Date().toISOString(),
        resolvedAt: null,
      }),
    ]);
    render(<StopAlertCard />);
    // Distinct from "asked and said nothing" (escalated) and from "said in
    // advance" (declared) — FR-039a's distinguishability.
    expect(screen.getByText(i18n.t('stopAlert.state.blocked'))).toBeTruthy();
    expect(screen.queryByText(i18n.t('stopAlert.state.waiting'))).toBeNull();
    expect(screen.queryByText(i18n.t('stopAlert.state.answered'))).toBeNull();
    expect(screen.queryByText(i18n.t('stopAlert.noResponse'))).toBeNull();
    // The driver's stated reason is shown directly.
    expect(screen.getByText(i18n.t('stopAlert.reason.ROAD_CLOSURE'))).toBeTruthy();
    expect(screen.getByText(/Bridge closed, no diversion signposted/)).toBeTruthy();
    // Still resolvable via the existing control.
    expect(screen.getByText(i18n.t('stopAlert.markHandled'))).toBeTruthy();
  });

  it('shows a handled detected stop as resolved, with no action left on it', () => {
    mockContext.order = orderWith([
      stop({ escalatedAt: new Date().toISOString(), resolvedAt: new Date().toISOString(), resolvedBy: 'admin-1' }),
    ]);
    render(<StopAlertCard />);
    expect(screen.getByText(i18n.t('stopAlert.state.resolved'))).toBeTruthy();
    expect(screen.queryByText(i18n.t('stopAlert.markHandled'))).toBeNull();
  });

  it('renders every stop on a delivery, newest first', () => {
    mockContext.order = orderWith([
      stop({
        _id: 'old',
        detectedAt: new Date('2026-08-28T08:00:00Z').toISOString(),
        reason: StopReason.TRAFFIC,
        reasonGivenAt: new Date().toISOString(),
        resolvedAt: new Date().toISOString(),
      }),
      stop({ _id: 'new', detectedAt: new Date('2026-08-28T10:00:00Z').toISOString() }),
    ]);
    render(<StopAlertCard />);
    const states = screen.getAllByText(
      new RegExp(`${i18n.t('stopAlert.state.waiting')}|${i18n.t('stopAlert.state.resolved')}`),
    );
    // FR-015: a driver who stops twice gets two separate records, and the
    // current one is the one they need to see first.
    expect(states[0].textContent).toBe(i18n.t('stopAlert.state.waiting'));
    expect(states).toHaveLength(2);
  });
});
