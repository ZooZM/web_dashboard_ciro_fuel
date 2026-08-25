import { useSyncExternalStore } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

const MOBILE_MAX = 599;
const TABLET_MAX = 1024;

function getBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w <= MOBILE_MAX) return 'mobile';
  if (w <= TABLET_MAX) return 'tablet';
  return 'desktop';
}

let current = getBreakpoint();
const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    const next = getBreakpoint();
    if (next !== current) {
      current = next;
      listeners.forEach((l) => l());
    }
  });
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): Breakpoint {
  return current;
}

export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore(subscribe, getSnapshot);
}
