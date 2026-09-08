import { describe, expect, it } from 'vitest';
import { toApiError, ApiError } from '@/lib/api/api-error';

function axios404(body: unknown) {
  return { response: { status: 404, data: body } } as never;
}

describe('404 handling keeps tenant isolation but passes declared codes through', () => {
  it('flattens an ordinary resource 404, body and all', () => {
    // FR-002/FR-019: "no such order" and "someone else's order" must read identically.
    const err = toApiError(axios404({ message: 'Order not found', error: 'Not Found', statusCode: 404 }));

    expect(err).toBeInstanceOf(ApiError);
    expect(err.error).toBe('NotFound');
    expect(err.message).not.toContain('Order');
  });

  it('preserves a platform ErrorCode the screen is meant to act on', () => {
    // Without this the sign-in screen could never distinguish "this number belongs to no
    // administrator" from any other 404, and would show "resource could not be found" to
    // someone who simply mistyped their own mobile number.
    const err = toApiError(
      axios404({
        error: 'PHONE_NOT_REGISTERED',
        message: 'No active administrator account is registered with this mobile number',
        statusCode: 404,
      }),
    );

    expect(err.error).toBe('PHONE_NOT_REGISTERED');
    expect(err.statusCode).toBe(404);
    expect(err.message).toContain('administrator');
  });

  it('does not treat a Title Case or lowercase body error as a declared code', () => {
    for (const error of ['Not Found', 'notFound', 'not_found']) {
      expect(toApiError(axios404({ error, message: 'x', statusCode: 404 })).error).toBe('NotFound');
    }
  });
});
