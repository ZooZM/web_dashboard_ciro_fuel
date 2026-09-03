import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18n from '@/lib/i18n/i18n';
import { SupportInboxPage } from '@/petrol_company/support/components/SupportInboxPage';

// Feature 013 T129/FR-096: a support request's message body is rendered as plain JSX
// text — React escapes text-node content by default, so a markup payload can never
// become live DOM. This is the positive assertion that it actually is rendered as text
// (never `dangerouslySetInnerHTML`), not merely an assumption about React's default.
beforeAll(() => void i18n.changeLanguage('en'));

const MALICIOUS_MESSAGE = '<script>window.__xss = true;</script><img src=x onerror="window.__xss2 = true">';

vi.mock('@/petrol_company/support/hooks/useSupportRequests', () => ({
  useSupportRequests: () => ({
    data: [
      {
        _id: 'req-1',
        companyId: 'company-a',
        clientId: 'owner-1',
        orderId: null,
        topic: 'OTHER',
        message: MALICIOUS_MESSAGE,
        state: 'SUBMITTED',
        acknowledgedAt: null,
        acknowledgedBy: null,
        createdAt: new Date().toISOString(),
      },
    ],
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
  useAcknowledgeSupportRequest: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

describe('Support inbox never renders a message body as markup (FR-096)', () => {
  it('shows the payload as literal text and never executes it', () => {
    const { container } = render(<SupportInboxPage />);

    // The literal string is visible as text content.
    expect(screen.getByText(MALICIOUS_MESSAGE)).toBeInTheDocument();

    // No <script> element was actually inserted into the DOM, and the payload never ran.
    expect(container.querySelector('script')).toBeNull();
    expect((window as unknown as { __xss?: boolean }).__xss).toBeUndefined();
    expect((window as unknown as { __xss2?: boolean }).__xss2).toBeUndefined();
  });
});
