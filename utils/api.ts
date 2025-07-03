
import { http } from "../libs/http-client";

// --- 在这里集中配置拦截器 ---

/**
 * 请求拦截器：
 * 1. 如果请求没有设置 skipAuth，则从某处（例如 localStorage）获取并注入 Token。
 * 2. 添加通用的请求头，例如 'X-Requested-With'。
 */
http.addRequestInterceptor(async (config) => {
  // 添加一个通用的请求头，以表明这是一个 AJAX 请求
  config.headers = {
    ...config.headers,
    "X-Requested-With": "XMLHttpRequest",
  };

  if (config.skipAuth) {
    console.log("API Client: 请求跳过认证");
    return config;
  }

  // 在真实应用中，您会从 localStorage、cookie 或内存中获取 Token
  const token = "your-secret-jwt-token-from-storage";
  console.log("API Client: 注入认证 Token");

  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  };

  return config;
});

/**
 * 响应拦截器：
 * 1. 检查 401 未授权错误，如果发生，可能会触发登出或刷新 Token 的逻辑。
 * 2. 统一处理其他类型的 HTTP 错误。
 */
http.addResponseInterceptor(async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      console.error("API Client: 捕获到 401 未授权错误，需要重新登录");
      // 在这里可以实现跳转到登录页的逻辑
      // window.location.href = '/login';
    }
    // 让错误继续传递到下一个拦截器或 catch 块
    return Promise.reject(response);
  }
  return response;
});

/**
 * 错误拦截器：
 * 1. 记录所有网络请求相关的错误。
 * 2. 可以向错误监控服务（如 Sentry）发送报告。
 */
http.addErrorInterceptor((error) => {
  console.error("API Client: 捕获到严重错误", error.message);
  // 在这里可以添加错误上报逻辑
  // Sentry.captureException(error);
  return Promise.reject(error);
});

// --- 导出已配置的客户端 ---

/**
 * 导出一个已配置好所有拦截器的 http 客户端实例。
 * 项目中的所有其他部分都应该从这里导入，而不是从原始的 'http-client' 导入。
 */
export const api = http;
