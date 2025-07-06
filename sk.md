# 服务端 Fetch 封装重构思路

## 1. 现有代码分析

原始文件 `@testing/libs/server/server-fetch.ts` 中的代码如下：

```typescript
import fetch from 'node-fetch';

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
```

这段代码存在以下几个可以改进的点：

1.  **功能过于简单**:
    *   只支持 `GET` 请求。
    *   无法自定义请求头 (`headers`)、请求体 (`body`) 或其他 `fetch` 选项。
    *   不支持 Next.js 特有的缓存策略（如 `revalidate`, `tags`）。

2.  **类型支持不足**:
    *   `res.json()` 的返回值是 `Promise<any>`，这意味着在调用 `fetcher` 后，我们丢失了数据的类型信息，无法利用 TypeScript 的类型检查优势。
    *   没有使用泛型来动态指定返回值的类型。

3.  **错误处理缺失**:
    *   如果 `fetch` 请求失败（例如，网络错误），Promise 会被 reject，但没有统一的捕获和处理机制。
    *   如果服务器返回非 2xx 的 HTTP 状态码（如 404, 500），`res.json()` 可能会成功也可能会失败，但代码逻辑上并不会认为这是一个错误，这通常不符合预期。

4.  **依赖和环境**:
    *   显式依赖 `node-fetch`。在现代的 Next.js（或 Node.js 18+）环境中，`fetch` 已经是全局可用的 API。直接使用全局 `fetch` 可以更好地与 Next.js 的缓存和请求优化集成，并减少不必要的依赖。

5.  **命名和扩展性**:
    *   `fetcher` 这个名字虽然通用，但可以更具体，比如 `serverFetch`，以明确其在服务端运行的上下文。
    *   当前的函数签名不利于扩展，例如，如果想加入 `POST` 方法，就需要重写整个函数或再写一个新函数。

## 2. 重构目标

基于以上分析，我计划进行以下重构：

1.  **创建核心的 `serverFetch` 函数**:
    *   移除 `node-fetch` 依赖，使用全局 `fetch`。
    *   使用 TypeScript 泛型 `<T>` 来定义期望的响应数据类型，函数将返回 `Promise<T>`。
    *   接受标准的 `RequestInit` 选项作为第二个参数（包括 `method`, `headers`, `body` 等），并兼容 Next.js 的扩展选项 `next`。

2.  **实现健壮的错误处理**:
    *   创建一个自定义的 `HttpError` 类，用于封装失败的 HTTP 请求信息（如 `status` 和从响应体中解析的 `payload`）。
    *   在 `serverFetch` 中，检查 `response.ok` 属性。如果为 `false`，则尝试解析响应体作为错误信息，并抛出 `HttpError` 实例。这使得调用方可以通过 `try...catch` 块清晰地处理业务逻辑错误。

3.  **提升易用性**:
    *   在核心函数的基础上，封装一组便捷的辅助方法，如 `api.get<T>()`, `api.post<T>()`, `api.put<T>()`, `api.delete<T>()`。
    *   这些方法将预设 `method` 并处理 `body` 的 `JSON.stringify`，让常规的 CRUD 操作调用起来更简洁、更具可读性。

4.  **提供清晰的类型定义**:
    *   为 `serverFetch` 的选项 `ServerFetchOptions` 提供明确的 TypeScript 接口。

通过以上步骤，重构后的模块将变得类型安全、功能强大、易于使用且易于扩展，能更好地适应企业级 Next.js 项目的需求。
