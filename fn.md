## SWR 数据请求的四种设计模式

在 SWR 中，如何优雅地定义数据请求逻辑是一个核心的设计问题。这里我们探讨四种主流的模式，涵盖了 `useSWR` (GET) 和 `useSWRMutation` (POST/PUT/DELETE) 的最佳实践。

### 模式一：独立的 GET 请求函数（`useSWR` 最佳实践）

对于 `useSWR`，其 fetcher 函数的职责很纯粹：接收一个 key，然后返回获取到的数据。当需要传递查询参数时，最佳实践是使用一个**数组**作为 key，例如 `['/api/products', { page: 1, limit: 10 }]`。

我们的 `getRequest` 函数将优雅地处理这种情况，自动将参数对象转换为 URL 查询字符串。

**实现方式：**

```typescript
// 1. 定义一个通用的 GET 请求函数，它能处理数组 key
const getRequest = <T,>([url, params]: [string, Record<string, any>]): Promise<T> => {
  const query = params ? new URLSearchParams(params).toString() : '';
  const fullUrl = query ? `${url}?${query}` : url;
  return myFetchClient.fetch<T>(fullUrl);
};

// 2. 在组件的 useSWR 钩子中，使用数组 key 传递参数
const { data, error } = useSWR<Product[]>(['/api/products', { category: 'electronics' }], getRequest);
```

- **优点**：
  - **参数清晰**：将 URL 和参数分开，代码更易读。
  - **自动依赖跟踪**：SWR 会自动检测到 `params` 对象的浅层变化，并在参数改变时重新请求数据。
  - **完全可复用**：一个 `getRequest` 函数可以服务于所有带参数和不带参数的 GET 请求。

---

### 模式二：独立的具名函数（`useSWRMutation` 常见实践）

这是 `useSWRMutation` 最直接的方法。你为每一种操作（如创建、更新）都定义一个独立的、有明确名称的异步函数。

**实现方式：**

```typescript
async function createProduct(url: string, { arg }: { arg: { name: string } }) {
  return myFetchClient.fetch(url, { method: 'POST', json: arg });
}

const { trigger } = useSWRMutation('/api/products', createProduct);
trigger({ name: '新产品' });
```

- **优点**：可读性强，易于复用，能封装复杂逻辑。
- **缺点**：当相似请求较多时，会产生一些模板代码。
- **最佳适用场景**：当 mutation 逻辑比较复杂或需要在多处复用时。

---

### 模式三：内联箭头函数（用于快速、一次性的请求）

当一个请求逻辑非常简单，并且只在一个地方使用时，可以直接在钩子中定义一个匿名的箭头函数。

**实现方式：**

```typescript
const { trigger } = useSWRMutation('/api/products',
  (url, { arg }: { arg: { name: string } }) => 
    myFetchClient.fetch(url, { method: 'POST', json: arg })
);
```

- **优点**：代码简洁，逻辑集中。
- **缺点**：无法复用。
- **最佳适用场景**：简单、一次性的请求。

---

### 模式四：通用 Mutator 工厂（`useSWRMutation` 最高效 & 可扩展的实践）

这是一种更高级的函数式模式。通过创建一个“工厂函数”来批量生成结构相似的请求函数，能极大地提升代码的可维护性和扩展性。

**实现方式：**

```typescript
// 1. 定义一个通用的工厂函数
const createMutator = 
  (method: 'POST' | 'PUT' | 'DELETE') =>
  <T>(url: string, { arg }: { arg: T }) => {
    return myFetchClient.fetch(url, { method, json: arg });
  };

// 2. 使用工厂创建具体的 mutator
const postRequest = createMutator('POST');
const { trigger } = useSWRMutation('/api/products', postRequest);

createTrigger({ name: '新产品' });
```

- **优点**：高度复用 (DRY)，扩展性强，代码一致性高。
- **缺点**：抽象层级更高，初看可能不够直观。
- **最佳适用场景**：拥有规范化 RESTful API 的应用。