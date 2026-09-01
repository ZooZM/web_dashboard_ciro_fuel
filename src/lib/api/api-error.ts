import type { AxiosError } from 'axios';

export interface BackendErrorEnvelope {
  statusCode: number;
  message: string | string[];
  error: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  readonly statusCode: number;
  readonly error: string;
  readonly isAuthBoundary: boolean;
  // Feature 009: the platform's HttpExceptionFilter preserves extra fields a deliberate
  // exception body carries (e.g. TANK_CAPACITY_EXCEEDED's numbers, CARD_ALREADY_PAIRED's
  // heldByPlateNumber) rather than stripping them to the uniform envelope alone — this is
  // where a call site reads them, without every refusal needing its own ApiError subclass.
  readonly details: Readonly<Record<string, unknown>> | undefined;

  constructor(
    statusCode: number,
    message: string,
    error: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.error = error;
    // 403/404 are authorization/existence boundaries, never an auth (401) failure — FR-010.
    this.isAuthBoundary = statusCode === 403 || statusCode === 404;
    this.details = details;
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
    // leak whether a record exists.
    return new ApiError(404, NOT_FOUND_MESSAGE, 'NotFound');
  }

  if (body?.message) {
    const message = Array.isArray(body.message) ? body.message.join(' ') : body.message;
    const { statusCode: _sc, message: _m, error: _e, ...rest } = body;
    return new ApiError(
      status,
      message,
      body.error ?? 'Error',
      Object.keys(rest).length > 0 ? rest : undefined,
    );
  }

  return new ApiError(status || 500, GENERIC_MESSAGE, 'UnknownError');
}
