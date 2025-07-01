import { ZodError, z } from 'zod';

// --- Mock Token Management ---

let accessToken = 'mock-access-token-initial';
let refreshToken = 'mock-refresh-token-initial';
let tokenExpiresAt = Date.now() + 1000 * 5; // Token expires in 5 seconds for testing

const getAccessToken = () => accessToken;
const getRefreshToken = () => refreshToken;

const setTokens = (newAccessToken: string, newRefreshToken: string) => {
  accessToken = newAccessToken;
  refreshToken = newRefreshToken;
  tokenExpiresAt = Date.now() + 1000 * 5; // Reset expiration
  console.log('Tokens refreshed:', { accessToken, refreshToken });
};

// Simulates a call to the token refresh endpoint
const refreshTokenApi = async (currentRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  console.log('Attempting to refresh token with:', currentRefreshToken);
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (currentRefreshToken === 'mock-refresh-token-initial') {
        const newAccessToken = `mock-access-token-refreshed-${Date.now()}`;
        const newRefreshToken = `mock-refresh-token-refreshed-${Date.now()}`;
        resolve({ accessToken: newAccessToken, refreshToken: newRefreshToken });
      } else {
        reject(new Error('Invalid refresh token'));
      }
    }, 500);
  });
};

// --- Token Refresh Logic ---

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

const handleRefreshToken = async () => {
  if (isRefreshing) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const currentRefreshToken = getRefreshToken();
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshTokenApi(currentRefreshToken);
      setTokens(newAccessToken, newRefreshToken);
    } catch (error) { 
      console.error('Token refresh failed. Logging out.', error);
      // In a real app, you would redirect to the login page here.
      accessToken = '';
      refreshToken = '';
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};


// --- Core HTTP Client ---

// Define a generic type for the API response
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Define the options for the custom fetch function
interface FetchOptions<T> extends RequestInit {
  schema?: z.ZodSchema<T>;
}

// Create a custom error class for HTTP errors
export class HttpError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any, message?: string) {
    super(message || 'An HTTP error occurred');
    this.status = status;
    this.data = data;
    this.name = 'HttpError';
  }
}

/**
 * A wrapper around the native fetch function that provides a consistent API for making HTTP requests.
 * It includes features like default headers, error handling, and response parsing.
 *
 * @template T The expected type of the response data.
 * @param {string} url The URL to send the request to.
 * @param {FetchOptions<T>} [options] The options for the request, including any custom settings.
 * @returns {Promise<T>} A promise that resolves with the response data.
 * @throws {HttpError} If the request fails or the response is not in the expected format.
 */
export async function http<T>(
  url: string,
  options?: FetchOptions<T>,
  isRetry = false
): Promise<T> {
  const { schema, ...fetchOptions } = options || {};

  // Set default headers and add the authorization token
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = getAccessToken();
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      ...defaultHeaders,
      ...fetchOptions.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Check for expired token
      if (response.status === 401 && !isRetry) {
        console.log('Token expired, attempting to refresh...');
        await handleRefreshToken();
        console.log('Retrying original request...');
        return http<T>(url, options, true); // Retry the request
      }

      throw new HttpError(
        response.status,
        errorData,
        `HTTP error! status: ${response.status}`
      );
    }

    const data: T = await response.json();

    if (schema) {
      const validation = schema.safeParse(data);
      if (!validation.success) {
        throw new ZodError(validation.error.errors);
      }
      return validation.data;
    }

    return data;
  } catch (error) {
    if (error instanceof HttpError || error instanceof ZodError) {
      throw error;
    }
    // Handle network errors or other unexpected issues
    throw new Error('Network request failed');
  }
}

// Example usage:

// 1. Simple GET request
// http<{ id: number; name: string }>('/api/users/1').then(user => console.log(user));

// 2. POST request with a body
// http('/api/users', {
//   method: 'POST',
//   body: JSON.stringify({ name: 'John Doe' }),
// }).then(response => console.log(response));

// 3. Request with Zod schema validation
// const userSchema = z.object({
//   id: z.number(),
//   name: z.string(),
// });

// http('/api/users/1', { schema: userSchema }).then(user => {
//   console.log(user.name);
// });