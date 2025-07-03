
// 定义请求拦截器类型
type RequestInterceptor = (
  config: RequestInit
) => RequestInit | Promise<RequestInit>;

// 定义响应拦截器类型
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

// 定义错误拦截器类型
type ErrorInterceptor = (error: any) => any;

// 拦截器管理器
const interceptors: {
  request: RequestInterceptor[];
  response: ResponseInterceptor[];
  error: ErrorInterceptor[];
} = {
  request: [],
  response: [],
  error: [],
};

/**
 * 添加请求拦截器
 * @param interceptor - 请求拦截器函数
 */
export function addRequestInterceptor(interceptor: RequestInterceptor) {
  interceptors.request.push(interceptor);
}

/**
 * 添加响应拦截器
 * @param interceptor - 响应拦截器函数
 */
export function addResponseInterceptor(interceptor: ResponseInterceptor) {
  interceptors.response.push(interceptor);
}

/**
 * 添加错误拦截器
 * @param interceptor - 错误拦截器函数
 */
export function addErrorInterceptor(interceptor: ErrorInterceptor) {
  interceptors.error.push(interceptor);
}

/**
 * 封装的 fetch 函数
 * @param url - 请求的 URL
 * @param options - fetch 的配置选项
 * @returns - 返回一个 Promise，解析为响应的 JSON 数据
 */
export async function httpClient(
  url: string,
  options: RequestInit = {}
): Promise<any> {
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

    return await response.json();
  } catch (error) {
    // 应用错误拦截器
    for (const interceptor of interceptors.error) {
      error = await interceptor(error);
    }
    throw error;
  }
}
