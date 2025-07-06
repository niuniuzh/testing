## Ky vs. Fetch: A Comparison

`ky` is a modern, lightweight HTTP client that builds upon the native `fetch` API. It is designed to provide a more user-friendly and feature-rich alternative, simplifying common data-fetching tasks while maintaining a small footprint.

Below is a feature comparison between `ky` and the standard `fetch` API.

| Feature | Ky | Native Fetch API |
| :--- | :--- | :--- |
| **API Design** | **Simplified & Intuitive:** Offers a cleaner, more concise API. | **Promise-Based but Verbose:** Powerful but often requires more boilerplate code. |
| **Error Handling** | **Automatic:** Throws an `HTTPError` for non-2xx responses by default. | **Manual:** Does not treat HTTP error statuses (e.g., 404, 500) as promise rejections. You must check `response.ok`. |
| **JSON Parsing** | **Automatic:** Seamlessly parses JSON responses. | **Manual:** Requires an explicit call to `response.json()`. |
| **Retries** | **Built-in:** Automatically retries failed requests with configurable options. | **Not Supported:** Requires manual implementation. |
| **Timeouts** | **Built-in:** Supports request timeouts to prevent indefinite hangs. | **Not Supported:** Requires manual implementation using `AbortController`. |
| **Hooks** | **Supported:** Allows you to inspect and modify requests and responses at different stages (e.g., `beforeRequest`, `afterResponse`). | **Not Supported:** Lacks a built-in interception mechanism. |
| **Dependencies** | **Zero Dependencies:** Lightweight and self-contained. | **Native:** Built into modern browsers, no external library needed. |
| **Browser Support** | **Modern Targets:** Works in modern browsers, Node.js, Deno, and Bun. | **Widely Supported:** Available in all modern browsers but not Internet Explorer. |

### Key Takeaways

- **Use `ky` for Convenience:** If you want a simpler, more powerful data-fetching experience with built-in error handling, retries, and timeouts, `ky` is an excellent choice.
- **Use `fetch` for Simplicity & Control:** If you have minimal requirements or need fine-grained control without external dependencies, the native `fetch` API is a solid option.

`ky` effectively reduces boilerplate and provides robust features out-of-the-box, making it a strong contender for most modern web development projects.
