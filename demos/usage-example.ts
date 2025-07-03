import {
  httpClient,
  addRequestInterceptor,
  addResponseInterceptor,
  addErrorInterceptor,
} from "../libs/http-client";

// --- 1. 添加拦截器 ---

// 添加请求拦截器，为每个请求添加认证 Token
addRequestInterceptor(async (config) => {
  console.log("请求拦截器：添加 Token");
  const token = "mock-jwt-token"; // 这是一个模拟的 Token
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  };
  return config;
});

// 添加响应拦截器，记录响应状态
addResponseInterceptor(async (response) => {
  console.log(`响应拦截器：收到响应，状态码: ${response.status}`);
  return response;
});

// 添加错误拦截器，记录请求错误
addErrorInterceptor((error) => {
  console.error("错误拦截器：捕获到错误", error);
  return Promise.reject(error);
});

// --- 2. 发起请求 ---

// 示例：发起 GET 请求
async function getUser() {
  console.log("\n--- 发起 GET 请求 ---");
  try {
    const user = await httpClient("https://jsonplaceholder.typicode.com/users/1");
    console.log("GET 请求成功:", user);
  } catch (error) {
    console.error("GET 请求失败:", error);
  }
}

// 示例：发起 POST 请求
async function createUser() {
  console.log("\n--- 发起 POST 请求 ---");
  try {
    const newUser = {
      name: "Gemini User",
      username: "gemini",
      email: "gemini@google.com",
    };
    const createdUser = await httpClient(
      "https://jsonplaceholder.typicode.com/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      }
    );
    console.log("POST 请求成功:", createdUser);
  } catch (error) {
    console.error("POST 请求失败:", error);
  }
}

// --- 3. 运行示例 ---
generateInitialCss();
createUser();
