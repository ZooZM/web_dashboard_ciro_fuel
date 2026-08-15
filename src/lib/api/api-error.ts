import type { AxiosError } from 'axios';

export interface BackendErrorEnvelope {
  statusCode: number;
  message: string | string[];
  error: string;
}

export class ApiError extends Error {
  readonly statusCode: number;
  readonly error: string;
  readonly isAuthBoundary: boolean;

  constructor(statusCode: number, message: string, error: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.error = error;
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
    // leak whether a record exists.
    return new ApiError(404, NOT_FOUND_MESSAGE, 'NotFound');
  }

  if (body?.message) {
    const message = Array.isArray(body.message) ? body.message.join(' ') : body.message;
    return new ApiError(status, message, body.error ?? 'Error');
  }

  return new ApiError(status || 500, GENERIC_MESSAGE, 'UnknownError');
}
