import { http } from "../libs/http-client";

// --- 0. 定义类型（可选，但推荐） ---
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

// --- 1. 添加拦截器 ---

// 请求拦截器：如果请求没有设置 skipAuth，则添加 Token
http.addRequestInterceptor(async (config) => {
  if (config.skipAuth) {
    console.log("请求拦截器：跳过 Token 添加");
    return config;
  }

  console.log("请求拦截器：添加 Token");
  const token = "mock-jwt-token";
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  };
  return config;
});

// 响应拦截器：记录响应状态
http.addResponseInterceptor(async (response) => {
  console.log(`响应拦截器：收到响应，状态码: ${response.status}`);
  return response;
});

// 错误拦截器：记录错误
http.addErrorInterceptor((error) => {
  console.error("错误拦截器：捕获到错误", error.message);
  return Promise.reject(error);
});

// --- 2. 发起请求 ---

// GET 请求（带认证）
async function getUser() {
  console.log("\n--- 发起 GET 请求 (带认证) ---");
  try {
    // 使用泛型来指定期望的返回类型
    const user = await http.get<User>(
      "https://jsonplaceholder.typicode.com/users/1"
    );
    console.log("GET 请求成功，用户:", user.name);
  } catch (error) {
    // 错误已在拦截器中处理
  }
}

// GET 请求（跳过认证）
async function getPublicPosts() {
  console.log("\n--- 发起 GET 请求 (跳过认证) ---");
  try {
    const posts = await http.get<any[]>(
      "https://jsonplaceholder.typicode.com/posts?_limit=2",
      { skipAuth: true } // 设置 skipAuth 标志
    );
    console.log("GET 请求成功，获取到", posts.length, "篇公共文章");
  } catch (error) {
    // 错误已在拦截器中处理
  }
}

// POST 请求（带认证）
async function createUser() {
  console.log("\n--- 发起 POST 请求 (带认证) ---");
  try {
    const newUser = {
      name: "Gemini Pro",
      email: "gemini.pro@google.com",
    };
    // 使用便捷的 post 方法
    const createdUser = await http.post<User>(
      "https://jsonplaceholder.typicode.com/users",
      newUser
    );
    console.log("POST 请求成功，创建用户:", createdUser.name);
  } catch (error) {
    // 错误已在拦截器中处理
  }
}

// --- 3. 运行所有示例 ---
async function runDemos() {
  await getUser();
  await getPublicPosts();
  await createUser();
}

runDemos();