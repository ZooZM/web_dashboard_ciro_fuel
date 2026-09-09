import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from '@/lib/i18n/i18n';
import { Topbar } from '@/components/layout/Topbar';
import { useLanguageStore } from '@/stores/language.store';

// `i18n-rtl.test.tsx` already proves the STORE works — it calls
// `useLanguageStore.getState().setLanguage()` directly and checks i18next and <html dir>.
// What nothing covered is whether any UI actually calls it, and the answer was no: the
// Topbar's two language buttons were markup with no onClick at all, and the "selected"
// ring was hardcoded onto Arabic. The machinery was tested; the wiring was not. These
// assertions go through the button a user actually clicks.
function openLanguageMenu() {
  // `useSessionIdentity` issues a company lookup; retries off so an unmocked fetch
  // settles instead of hanging the test.
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Topbar />
      </MemoryRouter>
    </QueryClientProvider>,
  );
  // The account dropdown (its trigger is a div, so go through the avatar — the click
  // bubbles to the handler), then the language submenu inside it.
  fireEvent.click(screen.getByAltText('Avatar'));
  fireEvent.click(screen.getByRole('button', { name: /اللغة/ }));
}

afterEach(() => {
  useLanguageStore.getState().setLanguage('ar');
});

describe('Topbar language switch', () => {
  it('switches to English when the English option is clicked', () => {
    useLanguageStore.getState().setLanguage('ar');

    openLanguageMenu();
    fireEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(useLanguageStore.getState().language).toBe('en');
    expect(i18n.language).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('switches back to Arabic, restoring RTL', () => {
    useLanguageStore.getState().setLanguage('en');

    openLanguageMenu();
    fireEvent.click(screen.getByRole('button', { name: 'اللغة العربية' }));

    expect(useLanguageStore.getState().language).toBe('ar');
    expect(i18n.language).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('marks the ACTIVE language as pressed, rather than always Arabic', () => {
    useLanguageStore.getState().setLanguage('en');

    openLanguageMenu();

    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'اللغة العربية' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});
