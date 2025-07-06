import { HttpError } from './HttpError';
import { ERROR_CODES, HTTP_STATUS_CODES } from './codes';

export class NotFoundError extends HttpError {
    constructor(message = "The requested resource was not found", data?: unknown) {
        super(message, HTTP_STATUS_CODES.NOT_FOUND, ERROR_CODES.NOT_FOUND_ERROR, data);
        this.name = 'NotFoundError';
    }
}
