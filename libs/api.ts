import { apiClient, ApiResponse } from './my-fetch';


export const getRequest = <T>(
  key: string | [string, Record<string, string | number | boolean | undefined | null>]
): Promise<ApiResponse<T>> => {
  let url: string;
  let params: Record<string, string | number | boolean | undefined | null> | undefined;

  if (Array.isArray(key)) {
    [url, params] = key;
  } else {
    url = key;
    params = undefined;
  }

  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    const fullUrl = query ? `${url}?${query}` : url;
    return apiClient.fetch<ApiResponse<T>>(fullUrl);
  }

  return apiClient.fetch<ApiResponse<T>>(url);
};


const createMutator =
  (method: 'POST' | 'PUT' | 'DELETE') =>
    <T>(url: string, { arg }: { arg: T }): Promise<ApiResponse<T>> => {
      return apiClient.fetch<ApiResponse<T>>(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      });
    };

export const postRequest = createMutator('POST');
export const putRequest = createMutator('PUT');
export const deleteRequest = createMutator('DELETE');
