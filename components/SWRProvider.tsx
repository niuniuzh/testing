'use client';

import { SWRConfig } from 'swr';
import { getRequest } from '@/libs/api';
import { AuthenticationError, ForbiddenError } from '@/libs/errors'; // Import ForbiddenError
import { useGlobalError } from './GlobalErrorDisplay';

const fetcher = async (url: string) => {
  const res = await getRequest<{user:string}>(url);
  return res;
};

export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  const { setError } = useGlobalError();

  return (
    <SWRConfig
      value={{
        fetcher,
        onError: (error, key) => {
          console.error(`SWR Global Error for key '${key}':`, error);
          setError(error); // Set the global error

          // Handle specific errors globally
          if (error instanceof AuthenticationError) {
            alert('Authentication failed! You would be redirected to login.');
          } else if (error instanceof ForbiddenError) {
            alert('Access Denied: You do not have permission to perform this action.');
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};