import { HttpError } from './HttpError';
import { ERROR_CODES, HTTP_STATUS_CODES } from './codes';

export class ServiceUnavailableError extends HttpError {
    constructor(message = "The service is temporarily unavailable", data?: unknown) {
        super(message, HTTP_STATUS_CODES.SERVICE_UNAVAILABLE, ERROR_CODES.SERVICE_UNAVAILABLE, data);
        this.name = 'ServiceUnavailableError';
    }
}
