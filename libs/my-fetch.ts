import { deepmerge } from "deepmerge-ts";
import {
  AuthenticationError,
  ForbiddenError,
  HTTP_STATUS_CODES,
  HttpError,
  NotFoundError,
  ServerError,
  ServiceUnavailableError,
  ValidationError,
} from "./errors";


export type BeforeRequestHook = (
  options: MyFetchRequestOptions
) => Promise<void> | void;

export type AfterResponseHook = (response: Response) => Promise<void> | void;

export interface FetchHooks {
  beforeRequest?: BeforeRequestHook[];
  afterResponse?: AfterResponseHook[];
}

export interface MyFetchOptions extends RequestInit {
  hooks?: FetchHooks;
}

export interface MyFetchRequestOptions extends MyFetchOptions {
  url: RequestInfo;
}

export interface ApiClientInstance {
  fetch: <T = any>(url: RequestInfo, options?: MyFetchOptions) => Promise<T>;
  addHook(type: 'beforeRequest', hook: BeforeRequestHook): void;
  addHook(type: 'afterResponse', hook: AfterResponseHook): void;
}

export type ApiResponse<T = any> = { code: number; message: string; data: T };


const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    switch (response.status) {
      case HTTP_STATUS_CODES.UNAUTHORIZED:
        throw new AuthenticationError("Authorization failed", errorData);
      case HTTP_STATUS_CODES.FORBIDDEN:
        throw new ForbiddenError("Access denied", errorData);
      case HTTP_STATUS_CODES.NOT_FOUND:
        throw new NotFoundError("Resource not found", errorData);
      case HTTP_STATUS_CODES.BAD_REQUEST:
      case HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY:
        throw new ValidationError("Validation failed", errorData);
      case HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR:
        throw new ServerError("Internal server error", errorData);
      case HTTP_STATUS_CODES.SERVICE_UNAVAILABLE:
        throw new ServiceUnavailableError("Service unavailable", errorData);
      default:
        throw new HttpError(
          `HTTP Error: ${response.status}`,
          response.status,
          "GENERIC_HTTP_ERROR",
          errorData
        );
    }
  }
  return response;
};


export const createApiClient = (
  defaultOptions: MyFetchOptions = {}
): ApiClientInstance => {
  const instanceConfig = { ...defaultOptions };

  const fetcher = async <T = any>(
    url: RequestInfo,
    perRequestOptions: MyFetchOptions = {}
  ): Promise<T> => {
    const mergedOptions: MyFetchRequestOptions = deepmerge(
      instanceConfig,
      { url, ...perRequestOptions }
    );

    const { hooks = {}, ...fetchOptions } = mergedOptions;

    if (hooks.beforeRequest) {
      for (const hook of hooks.beforeRequest) {
        await hook(mergedOptions);
      }
    }

    const rawResponse = await fetch(mergedOptions.url, fetchOptions);

    if (hooks.afterResponse) {
      for (const hook of hooks.afterResponse) {
        await hook(rawResponse.clone());
      }
    }

    const response = await handleResponse(rawResponse);

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      // JSON 响应
      if (response.status === 204) return undefined as T; // No Content
      try {
        return (await response.json()) as T;
      } catch (error) {
        console.error("apiClient: Failed to parse JSON response.", error);
        throw new Error("Invalid JSON response from server.");
      }
    } else {
      // 其他类型（如 text/plain）
      const text = await response.text();
      if (!text) return undefined as T;
      return text as T;
    }
  };

  const addHook = (
    type: keyof FetchHooks,
    hook: BeforeRequestHook | AfterResponseHook
  ): void => {
    if (!instanceConfig.hooks) {
      instanceConfig.hooks = {};
    }
    if (type === 'beforeRequest') {
      if (!instanceConfig.hooks.beforeRequest) instanceConfig.hooks.beforeRequest = [];
      instanceConfig.hooks.beforeRequest.push(hook as BeforeRequestHook);
    } else if (type === 'afterResponse') {
      if (!instanceConfig.hooks.afterResponse) instanceConfig.hooks.afterResponse = [];
      instanceConfig.hooks.afterResponse.push(hook as AfterResponseHook);
    }
  };

  return { fetch: fetcher, addHook };
};

export const apiClient = createApiClient();

