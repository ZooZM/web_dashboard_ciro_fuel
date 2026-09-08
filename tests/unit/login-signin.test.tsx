import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ApiError } from '@/lib/api/api-error';

// ── mocks ─────────────────────────────────────────────────────────────────
const requestMutate = vi.fn();
const verifyMutate = vi.fn();
const navigate = vi.fn();
let locationState: Record<string, unknown> = {};

vi.mock('@/auth/hooks/useLoginCode', () => ({
  useRequestLoginCode: () => ({ mutate: requestMutate, isPending: false }),
  useVerifyLoginCode: () => ({ mutate: verifyMutate, isPending: false }),
}));
vi.mock('@/lib/toast/toast', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
  useLocation: () => ({ state: locationState, pathname: '/', search: '', hash: '', key: 'k' }),
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

import { toast } from '@/lib/toast/toast';
import { LoginPage } from '@/auth/components/LoginPage';
import { VerifyPage } from '@/auth/components/VerifyPage';

describe('spec 015 US2 — sign-in screens', () => {
  beforeEach(() => {
    requestMutate.mockReset();
    verifyMutate.mockReset();
    navigate.mockReset();
    (toast.error as ReturnType<typeof vi.fn>).mockReset();
    locationState = {};
  });

  // ── LoginPage ───────────────────────────────────────────────────────────
  it('LoginPage composes the local number to E.164 before requesting a code', () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('5X XXX XXXX'), {
      target: { value: '0512345678' },
    });
    fireEvent.submit(screen.getByRole('button', { name: /إرسال رمز التحقق/ }).closest('form')!);

    expect(requestMutate).toHaveBeenCalledTimes(1);
    expect(requestMutate.mock.calls[0][0]).toBe('+966512345678');
  });

  it('LoginPage surfaces the platform retryAfterSeconds on LOGIN_RATE_LIMITED, not a local interval', () => {
    requestMutate.mockImplementation((_phone: string, opts: { onError: (e: unknown) => void }) => {
      opts.onError(
        new ApiError(429, 'rate limited', 'LOGIN_RATE_LIMITED', undefined, {
          retryAfterSeconds: 137,
        }),
      );
    });
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('5X XXX XXXX'), {
      target: { value: '0512345678' },
    });
    fireEvent.submit(screen.getByRole('button', { name: /إرسال رمز التحقق/ }).closest('form')!);

    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('137'));
  });

  // ── VerifyPage ──────────────────────────────────────────────────────────
  it('VerifyPage renders exactly 6 code inputs', () => {
    locationState = { phone: '+966512345678', remember: true };
    render(<VerifyPage />);
    const boxes = screen.getAllByRole('textbox');
    expect(boxes).toHaveLength(6);
  });

  it('VerifyPage posts { phone, code, remember } to the verify mutation', () => {
    locationState = { phone: '+966512345678', remember: true };
    render(<VerifyPage />);
    const boxes = screen.getAllByRole('textbox');
    '123456'.split('').forEach((d, i) => fireEvent.change(boxes[i], { target: { value: d } }));
    fireEvent.submit(screen.getByRole('button', { name: /تسجيل الدخول/ }).closest('form')!);

    expect(verifyMutate).toHaveBeenCalledTimes(1);
    expect(verifyMutate.mock.calls[0][0]).toEqual({
      phone: '+966512345678',
      code: '123456',
      remember: true,
    });
  });

  it('VerifyPage shows ONE message for every refusal, with no attempt counter', () => {
    verifyMutate.mockImplementation(
      (_v: unknown, opts: { onError: (e: unknown) => void }) => {
        opts.onError(new ApiError(400, 'bad', 'LOGIN_CODE_INVALID'));
      },
    );
    locationState = { phone: '+966512345678' };
    render(<VerifyPage />);
    const boxes = screen.getAllByRole('textbox');
    '000000'.split('').forEach((d, i) => fireEvent.change(boxes[i], { target: { value: d } }));
    fireEvent.submit(screen.getByRole('button', { name: /تسجيل الدخول/ }).closest('form')!);

    const [msg] = (toast.error as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(msg).toBe('الرمز غير صحيح أو منتهي الصلاحية.');
    expect(String(msg)).not.toMatch(/\d/); // no attempt count
  });
});
