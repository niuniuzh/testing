'use client';

import { SWRConfig } from 'swr';
import { AuthenticationError } from '@/libs/errors';

/**
 * The default fetcher for SWR.
 * It uses the globally patched `fetch` function, so it automatically gets
 * all our custom error handling and interceptor logic.
 * It expects the response to be JSON and parses it.
 */
const fetcher = async (url: string) => {
  const res = await fetch(url);
  // The global interceptor already throws our custom errors for non-ok responses,
  // so we don't need to check for `res.ok` here.
  return res.json();
};

/**
 * This component provides a global SWR configuration.
 * - Sets the default fetcher to our global, patched fetch.
 * - Implements global error handling, such as redirecting on auth errors.
 */
export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        onError: (error, key) => {
          console.error(`SWR Global Error for key '${key}':`, error);

          // Example: If an auth error occurs anywhere, redirect to login
          if (error instanceof AuthenticationError) {
            alert('Authentication failed! You would be redirected to login.');
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};