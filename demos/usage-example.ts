

import { api } from "../utils/api"; // 导入预先配置好的 api 客户端

// --- 定义类型 ---
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

// --- 发起请求（现在拦截器已在 api.ts 中全局配置） ---

// GET 请求（自动使用认证）
async function getUser() {
  console.log("\n--- Demo: 发起 GET 请求 ---");
  try {
    const user = await api.get<User>(
      "https://jsonplaceholder.typicode.com/users/1",{skipAuth:true}
    );
    console.log("Demo: GET 请求成功，用户:", user.name);
  } catch (error) {
    // 错误已在全局拦截器中处理
  }
}

// POST 请求（跳过认证）
async function submitGuestData() {
  console.log("\n--- Demo: 发起 POST 请求 (跳过认证) ---");
  try {
    const guestData = { title: "Guest Post", body: "This is a public post." };
    const result = await api.post<any>(
      "https://jsonplaceholder.typicode.com/posts",
      guestData,
      { skipAuth: true } // 仍然可以覆盖默认行为
    );
    console.log("Demo: POST 请求成功，结果:", result);
  } catch (error) {
    // 错误已在全局拦截器中处理
  }
}

// --- 运行所有示例 ---
async function runDemos() {
  await getUser();
  await submitGuestData();
}

runDemos();

