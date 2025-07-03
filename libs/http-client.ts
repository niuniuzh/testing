
// --- 类型定义 ---

// 扩展 RequestInit 以包含自定义选项
export interface HttpClientRequestInit extends RequestInit {
  skipAuth?: boolean; // 可选标志，用于跳过认证
}

// 定义拦截器类型
type RequestInterceptor = (
  config: HttpClientRequestInit
) => HttpClientRequestInit | Promise<HttpClientRequestInit>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
type ErrorInterceptor = (error: any) => any;

// --- 拦截器管理器 ---

const interceptors: {
  request: RequestInterceptor[];
  response: ResponseInterceptor[];
  error: ErrorInterceptor[];
} = {
  request: [],
  response: [],
  error: [],
};

export function addRequestInterceptor(interceptor: RequestInterceptor) {
  interceptors.request.push(interceptor);
}

export function addResponseInterceptor(interceptor: ResponseInterceptor) {
  interceptors.response.push(interceptor);
}

export function addErrorInterceptor(interceptor: ErrorInterceptor) {
  interceptors.error.push(interceptor);
}

// --- 核心 HTTP 客户端 ---

/**
 * 封装的 fetch 函数，支持拦截器和泛型
 * @param url - 请求的 URL
 * @param options - 自定义的请求配置
 * @returns - 返回一个 Promise，解析为类型化的响应数据
 */
async function httpClient<T>(
  url: string,
  options: HttpClientRequestInit = {}
): Promise<T> {
  let config = options;

  // 应用请求拦截器
  for (const interceptor of interceptors.request) {
    config = await interceptor(config);
  }

  try {
    let response = await fetch(url, config);

    // 应用响应拦截器
    for (const interceptor of interceptors.response) {
      response = await interceptor(response);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 假设响应是 JSON 并解析
    return (await response.json()) as T;
  } catch (error) {
    // 应用错误拦截器
    let processedError = error;
    for (const interceptor of interceptors.error) {
      processedError = await interceptor(processedError);
    }
    throw processedError;
  }
}

// --- 便捷方法 ---

/**
 * 发起 GET 请求
 * @param url - 请求的 URL
 * @param options - 自定义的请求配置
 */
function get<T>(url: string, options?: HttpClientRequestInit) {
  return httpClient<T>(url, { ...options, method: "GET" });
}

/**
 * 发起 POST 请求
 * @param url - 请求的 URL
 * @param body - 请求体
 * @param options - 自定义的请求配置
 */
function post<T>(url: string, body: any, options?: HttpClientRequestInit) {
  return httpClient<T>(url, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: JSON.stringify(body),
  });
}

/**
 * 发起 PUT 请求
 * @param url - 请求的 URL
 * @param body - 请求体
 * @param options - 自定义的请求配置
 */
function put<T>(url: string, body: any, options?: HttpClientRequestInit) {
  return httpClient<T>(url, {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: JSON.stringify(body),
  });
}

/**
 * 发起 DELETE 请求
 * @param url - 请求的 URL
 * @param options - 自定义的请求配置
 */
function del<T>(url: string, options?: HttpClientRequestInit) {
  return httpClient<T>(url, { ...options, method: "DELETE" });
}

// 导出 http 对象，其中包含所有便捷方法
export const http = {
  get,
  post,
  put,
  delete: del,
  addRequestInterceptor,
  addResponseInterceptor,
  addErrorInterceptor,
};
