import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { queryClient } from '@/app/query-client';

// Feature 013 T037/FR-050/SC-010: "No screen MUST refresh while its browser tab is
// hidden." `queryClient`'s `refetchIntervalInBackground: false` (query-client.ts) is a
// single global setting every per-screen `refetchInterval` inherits — this test proves
// the setting actually does what it claims, against the real `queryClient` instance every
// screen in this feature will use, not a reconstructed one.
function setVisibility(state: DocumentVisibilityState): void {
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
}

describe('queryClient — no refetch while the tab is hidden (FR-050, SC-010)', () => {
  let fetchCount = 0;
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);

  beforeEach(() => {
    fetchCount = 0;
    queryClient.clear();
  });

  afterEach(() => {
    setVisibility('visible');
    queryClient.clear();
  });

  it('a query with refetchInterval does not refetch while the tab is hidden', async () => {
    setVisibility('hidden');

    const { unmount } = renderHook(
      () =>
        useQuery({
          queryKey: ['hidden-tab-probe'],
          queryFn: () => {
            fetchCount += 1;
            return Promise.resolve('ok');
          },
          refetchInterval: 20,
        }),
      { wrapper },
    );

    // The initial mount fetch always fires (a screen just opened needs its first paint) —
    // what SC-010 forbids is the RECURRING background poll while hidden.
    await waitFor(() => expect(fetchCount).toBeGreaterThanOrEqual(1));
    const countAfterInitialFetch = fetchCount;

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(fetchCount).toBe(countAfterInitialFetch);

    unmount();
  });

  it('resumes refetching once the tab becomes visible again', async () => {
    setVisibility('hidden');

    const { unmount } = renderHook(
      () =>
        useQuery({
          queryKey: ['hidden-tab-probe-resume'],
          queryFn: () => {
            fetchCount += 1;
            return Promise.resolve('ok');
          },
          refetchInterval: 20,
        }),
      { wrapper },
    );

    await waitFor(() => expect(fetchCount).toBeGreaterThanOrEqual(1));
    const countWhileHidden = fetchCount;

    setVisibility('visible');
    await waitFor(() => expect(fetchCount).toBeGreaterThan(countWhileHidden));

    unmount();
  });
});
