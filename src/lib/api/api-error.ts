import type { AxiosError } from 'axios';

export interface BackendErrorEnvelope {
  statusCode: number;
  message: string | string[];
  error: string;
  // Feature 013 T026: carried on SESSION_REVOKED (spec 006) so the app can state the
  // SPECIFIC reason a session ended (e.g. `COMPANY_SUSPENDED`) rather than a generic
  // message — the platform's own SessionRevocationCause value. Optional: most errors
  // carry no cause at all.
  cause?: string;
  // spec 015 — carried on `LOGIN_RATE_LIMITED` (429). The dashboard states the wait
  // using THIS value, never a locally invented interval (FR-047).
  retryAfterSeconds?: number;
  // spec 015 — carried on `CHALLENGE_REQUIRED` (400). The client solves and resubmits;
  // the user is never asked to do anything (FR-023 / dashboard-integration §5).
  challenge?: { seed: string; difficultyBits: number };
}

export class ApiError extends Error {
  readonly statusCode: number;
  readonly error: string;
  readonly cause?: string;
  readonly retryAfterSeconds?: number;
  readonly challenge?: { seed: string; difficultyBits: number };
  readonly isAuthBoundary: boolean;

  constructor(
    statusCode: number,
    message: string,
    error: string,
    cause?: string,
    extra?: Pick<BackendErrorEnvelope, 'retryAfterSeconds' | 'challenge'>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.error = error;
    this.cause = cause;
    this.retryAfterSeconds = extra?.retryAfterSeconds;
    this.challenge = extra?.challenge;
    // 403/404 are authorization/existence boundaries, never an auth (401) failure — FR-010.
    this.isAuthBoundary = statusCode === 403 || statusCode === 404;
  }
}

const GENERIC_MESSAGE = 'Something went wrong. Please try again.';
const NOT_FOUND_MESSAGE = 'The requested resource could not be found.';

export function toApiError(error: unknown): ApiError {
  const axiosError = error as AxiosError<BackendErrorEnvelope>;
  const status = axiosError.response?.status ?? 0;
  const body = axiosError.response?.data;

  if (status === 404) {
    // FR-002/FR-019: cross-tenant and not-found are indistinguishable by design — never
    // leak whether a record exists. A RESOURCE 404 is therefore flattened to one message
    // here, discarding whatever the body said.
    //
    // The exception is a 404 the platform raised deliberately with one of its OWN
    // `ErrorCode` values, which are SCREAMING_SNAKE_CASE by convention — those are a
    // stated outcome the screen is meant to act on (PHONE_NOT_REGISTERED), not an
    // existence leak. Nest's default envelope puts Title Case in this field ("Not Found"),
    // so the two are told apart by shape and a plain 404 still flattens.
    const declared = typeof body?.error === 'string' && /^[A-Z][A-Z0-9_]*$/.test(body.error);
    if (!declared) {
      return new ApiError(404, NOT_FOUND_MESSAGE, 'NotFound');
    }
  }

  if (body?.message) {
    const message = Array.isArray(body.message) ? body.message.join(' ') : body.message;
    return new ApiError(status, message, body.error ?? 'Error', body.cause, {
      retryAfterSeconds: body.retryAfterSeconds,
      challenge: body.challenge,
    });
  }

  return new ApiError(status || 500, GENERIC_MESSAGE, 'UnknownError');
}
