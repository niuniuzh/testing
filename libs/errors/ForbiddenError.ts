import { HttpError } from './HttpError';
import { ERROR_CODES, HTTP_STATUS_CODES } from './codes';

export class ForbiddenError extends HttpError {
    constructor(message = "You do not have permission to access this resource", data?: unknown) {
        super(message, HTTP_STATUS_CODES.FORBIDDEN, ERROR_CODES.FORBIDDEN_ERROR, data);
        this.name = 'ForbiddenError';
    }
}
