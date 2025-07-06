import { apiClient } from './my-fetch';


export interface ApiResponse {
  message: string;
  data?: any;
}


export const getRequest = <T,>(key: string | [string, Record<string, any>]): Promise<T> => {
  const [url, params] = Array.isArray(key) ? key : [key, null];
  
  if (params) {
    const query = new URLSearchParams(params).toString();
    const fullUrl = `${url}?${query}`;
    return apiClient.fetch<T>(fullUrl);
  }
  
  return apiClient.fetch<T>(url);
};


const createMutator = 
  (method: 'POST' | 'PUT' | 'DELETE') => 
  <T, R = ApiResponse>(url: string, { arg }: { arg: T }): Promise<R> => {
    return apiClient.fetch<R>(url, {
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
