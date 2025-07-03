import { NextResponse } from "next/server";

// --- 模拟数据库和查询 ---

// 1. 定义数据结构和模拟数据
interface Product {
  id: string;
  name: string;
  category: string;
}

const mockProducts: Product[] = [
  { id: "p1", name: "Laptop Pro", category: "Electronics" },
  { id: "p2", name: "Wireless Mouse", category: "Electronics" },
  { id: "p3", name: "Coffee Mug", category: "Kitchenware" },
  { id: "p4", name: "Standing Desk", category: "Furniture" },
];

// 2. 模拟数据库查询函数
const searchProductsInDB = async (
  query: string | null
): Promise<Product[]> => {
  // 模拟 300ms 的数据库延迟
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 模拟一个可预测的失败场景，用于测试
  if (query === "fail") {
    throw new Error("数据库连接超时");
  }

  // 如果没有查询参数，返回所有产品
  if (!query) {
    return mockProducts;
  }

  // 如果有查询参数，则过滤产品名称
  const lowerCaseQuery = query.toLowerCase();
  const results = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(lowerCaseQuery)
  );

  return results;
};

// --- API 路由处理程序 ---

/**
 * 处理对 /api/search 的 GET 请求
 * @param request - Next.js 传入的请求对象
 * - ?q=laptop  -> 成功，返回匹配项
 * - ?q=fail    -> 失败，返回 500 错误
 * - (无参数)    -> 成功，返回所有项目
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  try {
    console.log(`API Route: 正在数据库中搜索 '${query || "all"}'...`);
    const results = await searchProductsInDB(query);

    if (results.length === 0) {
      return NextResponse.json(
        { message: `未找到与 '${query}' 相关的产品。` },
        { status: 404 }
      );
    }

    // 成功：返回查询结果
    return NextResponse.json(results);

  } catch (error: any) {
    // 失败：记录错误并返回 500 状态
    console.error("API Route 数据库错误:", error.message);
    return NextResponse.json(
      { message: "查询数据库时发生内部错误。", error: error.message },
      { status: 500 }
    );
  }
}