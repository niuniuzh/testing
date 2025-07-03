
'use client';

import { useEffect } from 'react';
import '@/libs/fetch-interceptor'; // Import the interceptor to activate it

/**
 * This is a client component that doesn't render anything.
 * Its sole purpose is to ensure the fetch-interceptor is included
 * in the client-side JavaScript bundle and executed.
 */
export function GlobalFetchInterceptor() {
  useEffect(() => {
    // The import itself is enough to run the patch.
    // This useEffect hook is here to make it a clear client component
    // and to prevent tree-shaking from removing the import.
    console.log('Global fetch interceptor has been initialized.');
  }, []);

  return null; // This component does not render any UI
}
