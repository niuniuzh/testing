import { HttpError } from './HttpError';
import { ERROR_CODES, HTTP_STATUS_CODES } from './codes';

export class ServerError extends HttpError {
    constructor(message = "An unexpected server error occurred", data?: unknown) {
        super(message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_SERVER_ERROR, data);
        this.name = 'ServerError';
    }
}
