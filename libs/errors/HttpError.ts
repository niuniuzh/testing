import { ErrorCode } from './codes';

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

export function isHttpError(error: unknown): error is HttpError {
    return error instanceof HttpError;
}
