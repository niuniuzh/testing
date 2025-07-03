
import { NextResponse } from "next/server";
import { api } from "@/utils/api"; // 使用 tsconfig.json 中定义的路径别名

// 定义我们期望从外部 API 获取的数据类型
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

/**
 * 处理对 /api/search 的 GET 请求
 * @param request - Next.js 传入的请求对象
 */
export async function GET(request: Request) {
  try {
    // 使用我们预先配置的 api 客户端来获取外部数据
    // 由于这是一个公共的搜索接口，我们跳过认证
    const posts = await api.get<Post[]>(
      "https://jsonplaceholder.typicode.com/posts?_limit=5",
      { skipAuth: true }
    );

    // 将获取到的数据作为 JSON 响应返回
    return NextResponse.json(posts);
  } catch (error: any) {
    // 如果发生错误，返回一个 500 状态和错误信息
    console.error("API Route Error:", error.message);
    return NextResponse.json(
      { message: "获取外部数据时发生错误。" },
      { status: 500 }
    );
  }
}
