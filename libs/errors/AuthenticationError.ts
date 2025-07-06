import { HttpError } from './HttpError';
import { ERROR_CODES, HTTP_STATUS_CODES } from './codes';

export class AuthenticationError extends HttpError {
    constructor(message = "Authentication required", data?: unknown) {
        super(message, HTTP_STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTHENTICATION_ERROR, data);
        this.name = 'AuthenticationError';
    }
}
