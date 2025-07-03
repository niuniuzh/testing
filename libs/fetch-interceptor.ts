'use client';

import { HttpError, AuthenticationError, NotFoundError, ServerError } from './errors';

if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Throw specific errors based on status code
        switch (response.status) {
          case 401:
          case 403:
            throw new AuthenticationError("Authorization failed", errorData);
          case 404:
            throw new NotFoundError("Resource not found", errorData);
          case 500:
          case 502:
          case 503:
            throw new ServerError("Server error occurred", errorData);
          default:
            throw new HttpError(`HTTP Error: ${response.status}`, response.status, errorData);
        }
      }

      return response;

    } catch (error: any) {
      // This global handler can be used for logging or generic UI feedback
      console.error("Global Fetch Interceptor caught:", error.name, error.message);

      // Example: Show a toast notification for any kind of error
      // toast.error(`Request Failed: ${error.message}`);

      // Re-throw the error so that component-level .catch() and SWR's onError can handle it
      throw error;
    }
  };
}