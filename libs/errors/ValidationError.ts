import { HttpError } from './HttpError';
import { ERROR_CODES, HTTP_STATUS_CODES } from './codes';

export class ValidationError extends HttpError {
    constructor(
        message = "Input validation failed",
        data?: unknown,
        status: number = HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY
    ) {
        super(message, status, ERROR_CODES.VALIDATION_ERROR, data);
        this.name = 'ValidationError';
    }
}
