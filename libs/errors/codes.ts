// libs/errors/codes.ts

export const HTTP_STATUS_CODES = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422, // Often used for validation errors
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
} as const;

export const ERROR_CODES = {
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR', // 401
    FORBIDDEN_ERROR: 'FORBIDDEN_ERROR',           // 403
    NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',           // 404
    VALIDATION_ERROR: 'VALIDATION_ERROR',         // 422, 400
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR', // 500
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',     // 503
    GENERIC_HTTP_ERROR: 'GENERIC_HTTP_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
