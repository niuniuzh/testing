// libs/errors/codes.ts

/**
 * A structured set of HTTP status codes for consistency.
 */
export const HTTP_STATUS_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422, // Often used for validation errors
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * A structured set of error codes to identify specific error scenarios.
 * This provides a more robust way to check for errors than just the class name.
 */
export const ERROR_CODES = {
  // --- Client Errors (400-499) ---
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR', // 401
  FORBIDDEN_ERROR: 'FORBIDDEN_ERROR',           // 403
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',           // 404
  VALIDATION_ERROR: 'VALIDATION_ERROR',         // 422, 400

  // --- Server Errors (500-599) ---
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR', // 500
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',     // 503

  // --- Generic Catch-All ---
  GENERIC_HTTP_ERROR: 'GENERIC_HTTP_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

/**
 * The base class for all custom HTTP errors.
 * It includes the HTTP status, a specific error code, and any response data.
 */
export class HttpError extends Error {
  status: number;
  code: ErrorCode;
  data?: unknown;
  cause?: Error;

  constructor(message: string, status: number, code: ErrorCode, data?: unknown, cause?: Error) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.data = data;
    this.cause = cause;
  }
}

// 类型守卫
export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}

// --- Specific Error Classes ---

export class AuthenticationError extends HttpError {
  constructor(message = "Authentication required", data: any) {
    super(message, HTTP_STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTHENTICATION_ERROR, data);
    this.name = 'AuthenticationError';
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "You do not have permission to access this resource", data: any) {
    super(message, HTTP_STATUS_CODES.FORBIDDEN, ERROR_CODES.FORBIDDEN_ERROR, data);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "The requested resource was not found", data: any) {
    super(message, HTTP_STATUS_CODES.NOT_FOUND, ERROR_CODES.NOT_FOUND_ERROR, data);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends HttpError {
  constructor(message = "Input validation failed", data?: unknown, status: number = HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY) {
    super(message, status, ERROR_CODES.VALIDATION_ERROR, data);
    this.name = 'ValidationError';
  }
}

export class ServerError extends HttpError {
  constructor(message = "An unexpected server error occurred", data: any) {
    super(message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_SERVER_ERROR, data);
    this.name = 'ServerError';
  }
}

export class ServiceUnavailableError extends HttpError {
  constructor(message = "The service is temporarily unavailable", data: any) {
    super(message, HTTP_STATUS_CODES.SERVICE_UNAVAILABLE, ERROR_CODES.SERVICE_UNAVAILABLE, data);
    this.name = 'ServiceUnavailableError';
  }
}