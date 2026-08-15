import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from '@/features/auth/components/LoginPage';
import { syncDocumentDirection } from '@/lib/rtl/direction';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

// SC-010: automated accessibility check with 0 critical violations, in both RTL and LTR.
describe('accessibility (SC-010)', () => {
  it('LoginPage has no critical axe violations in LTR (English)', async () => {
    syncDocumentDirection('en');
    const { container } = renderWithProviders(<LoginPage />);
    const results = await axe(container);
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical).toEqual([]);
  });

  it('LoginPage has no critical axe violations in RTL (Arabic)', async () => {
    syncDocumentDirection('ar');
    const { container } = renderWithProviders(<LoginPage />);
    const results = await axe(container);
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical).toEqual([]);
  });
});
