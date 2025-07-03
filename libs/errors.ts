
// A base class for any HTTP-related error
export class HttpError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

// Specific error for authentication issues (401, 403)
export class AuthenticationError extends HttpError {
  constructor(message = "Authentication required", data: any) {
    super(message, 401, data);
    this.name = 'AuthenticationError';
  }
}

// Specific error for Not Found (404)
export class NotFoundError extends HttpError {
  constructor(message = "The requested resource was not found", data: any) {
    super(message, 404, data);
    this.name = 'NotFoundError';
  }
}

// Specific error for server-side issues (5xx)
export class ServerError extends HttpError {
  constructor(message = "An unexpected server error occurred", data: any) {
    super(message, 500, data);
    this.name = 'ServerError';
  }
}
