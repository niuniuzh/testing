
'use client';

// 确保这段代码只在客户端执行
if (typeof window !== 'undefined') {
  // 1. 保存原始的 fetch 函数
  const originalFetch = window.fetch;

  // 2. 用我们自己的逻辑覆盖全局的 fetch
  window.fetch = async (...args) => {
    try {
      // 3. 调用原始的 fetch，并等待响应
      const response = await originalFetch(...args);
      console.log('response',response);
      // 4. 检查响应是否成功，如果不成功，则主动抛出错误
      // 这使得 .catch() 块可以捕获到 HTTP 错误 (如 404, 500)
      if (!response.ok) {
        // 尝试解析错误响应体，如果失败则使用状态文本
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: response.statusText };
        }

        const error = new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
        (error as any).response = response;
        (error as any).data = errorData;
        throw error;
      }

      // 如果响应成功，则正常返回
      return response;

    } catch (error: any) {
      // 5. 在这里实现统一的错误处理逻辑
      console.error("全局 Fetch 捕获到错误:", error.message);

      // =================================================================
      // 在这里替换成您喜欢的 UI 反馈，例如 Toast 通知
      // 例如: toast.error(`请求失败: ${error.message}`);
      // 为了演示，我暂时使用 alert
      alert(`请求遇到问题: ${error.message}`);
      // =================================================================

      // 6. 重新抛出错误，以确保页面上任何单独的 .catch() 逻辑仍然可以执行
      throw error;
    }
  };
}
