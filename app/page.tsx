
"use client"; // 将此组件标记为客户端组件

import { useState, useEffect } from "react";
import Image from "next/image";

// 定义文章的数据结构
interface Post {
  id: number;
  title: string;
  body: string;
}

export default function Home() {
  // --- State Hooks ---
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Effect Hook to Fetch Data ---
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 调用我们创建的 API 路由
        const response = await fetch("/api/search");
        if (!response.ok) {
          throw new Error("从服务器获取数据失败");
        }
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []); // 空依赖数组确保此 effect 只在组件挂载时运行一次

  // --- Render Logic ---
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-4xl">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <div className="w-full mt-8">
          <h1 className="text-2xl font-bold text-center mb-4">API 搜索结果</h1>
          
          {isLoading && <p className="text-center">加载中...</p>}
          
          {error && <p className="text-center text-red-500">错误: {error}</p>}
          
          {!isLoading && !error && (
            <ul className="list-disc list-inside space-y-4">
              {posts.map((post) => (
                <li key={post.id} className="border p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <p className="text-gray-400 mt-2">{post.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mt-8">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}

