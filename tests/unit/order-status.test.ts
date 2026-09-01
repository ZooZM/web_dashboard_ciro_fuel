import { describe, expect, it } from 'vitest';
import {
  OrderStatus,
  isKnownOrderStatus,
  orderStatusLabelKey,
  orderStatusTone,
  isAssignableOrderStatus,
  isTrackableOrderStatus,
  isTerminalOrderStatus,
  ORDER_STATUS_LABEL_KEY,
  ORDER_STATUS_TONE,
  ORDER_STATUS_UNKNOWN_LABEL_KEY,
} from '@/constants/order-status';
import en from '@/lib/i18n/en.json';
import ar from '@/lib/i18n/ar.json';

// Feature 009 T021/FR-010/FR-011/SC-006: the dashboard had 8 of the platform's 12 stages.
// These assertions are written to fail loudly if that regresses — each walks the full set of
// twelve rather than sampling a few, since a partial vocabulary is exactly the defect this
// feature repairs.
const ALL_STATUSES = Object.values(OrderStatus);

describe('OrderStatus vocabulary (FR-010)', () => {
  it('has exactly the platform\'s twelve values', () => {
    expect(ALL_STATUSES).toHaveLength(12);
    expect(new Set(ALL_STATUSES).size).toBe(12); // no duplicates
  });

  it('includes the four the dashboard was missing before this feature', () => {
    expect(ALL_STATUSES).toEqual(
      expect.arrayContaining([
        'AWAITING_ROUTING',
        'ROUTED_TO_TRANSPORT',
        'ASSIGNED_TO_DRIVER',
        'LOADING',
      ]),
    );
  });

  it('recognises every platform value', () => {
    for (const status of ALL_STATUSES) {
      expect(isKnownOrderStatus(status)).toBe(true);
    }
  });

  it('does not recognise a value the platform has never sent', () => {
    expect(isKnownOrderStatus('SOME_FUTURE_STATUS')).toBe(false);
  });
});

describe('label/tone mappings are total over all twelve values (FR-011)', () => {
  it('ORDER_STATUS_LABEL_KEY has an entry for every status, and no extras', () => {
    expect(Object.keys(ORDER_STATUS_LABEL_KEY).sort()).toEqual([...ALL_STATUSES].sort());
  });

  it('ORDER_STATUS_TONE has an entry for every status, and no extras', () => {
    expect(Object.keys(ORDER_STATUS_TONE).sort()).toEqual([...ALL_STATUSES].sort());
  });

  it('every known status resolves to its own key, not the unknown fallback', () => {
    for (const status of ALL_STATUSES) {
      expect(orderStatusLabelKey(status)).not.toBe(ORDER_STATUS_UNKNOWN_LABEL_KEY);
      expect(orderStatusTone(status)).not.toBe('unknown');
    }
  });

  it('an unrecognised value renders as explicit unknown, never blank, never a neighbour', () => {
    expect(orderStatusLabelKey('SOME_FUTURE_STATUS')).toBe(ORDER_STATUS_UNKNOWN_LABEL_KEY);
    expect(orderStatusTone('SOME_FUTURE_STATUS')).toBe('unknown');
  });

  it('every label key resolves to a real, non-empty string in both locales', () => {
    for (const status of ALL_STATUSES) {
      const key = ORDER_STATUS_LABEL_KEY[status]; // e.g. "orderStatus.LOADING"
      const [, leaf] = key.split('.');
      expect((en.orderStatus as Record<string, string>)[leaf]).toBeTruthy();
      expect((ar.orderStatus as Record<string, string>)[leaf]).toBeTruthy();
    }
    expect(en.orderStatus.unknown).toBeTruthy();
    expect(ar.orderStatus.unknown).toBeTruthy();
  });
});

describe('derived predicates (FR-009/FR-017/data-model.md §1.2)', () => {
  it('exactly one status is assignable', () => {
    const assignable = ALL_STATUSES.filter(isAssignableOrderStatus);
    expect(assignable).toEqual(['ROUTED_TO_TRANSPORT']);
  });

  it('trackable mirrors the platform\'s order:watch rule exactly: IN_TRANSIT and UNLOADING only', () => {
    const trackable = ALL_STATUSES.filter(isTrackableOrderStatus);
    expect(trackable.sort()).toEqual(['IN_TRANSIT', 'UNLOADING'].sort());
  });

  it('LOADING is explicitly not trackable — it is the stage the dashboard could not previously express', () => {
    expect(isTrackableOrderStatus('LOADING')).toBe(false);
  });

  it('terminal states are exactly DELIVERED, REJECTED, CANCELLED', () => {
    const terminal = ALL_STATUSES.filter(isTerminalOrderStatus);
    expect(terminal.sort()).toEqual(['CANCELLED', 'DELIVERED', 'REJECTED'].sort());
  });
});
