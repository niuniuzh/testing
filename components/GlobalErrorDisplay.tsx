'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AuthenticationError, NotFoundError, ServerError } from '@/libs/errors';
import ServerErrorComponent from './errors/ServerErrorComponent';
import NotFoundErrorComponent from './errors/NotFoundErrorComponent';
import AuthenticationErrorComponent from './errors/AuthenticationErrorComponent';

interface GlobalErrorContextType {
  error: Error | null;
  setError: (error: Error | null) => void;
}

const GlobalErrorContext = createContext<GlobalErrorContextType | undefined>(undefined);

export const GlobalErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<Error | null>(null);

  // Automatically clear the error after a few seconds, or when a new error comes in
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <GlobalErrorContext.Provider value={{ error, setError }}>
      {children}
      {error && (
        <div className="fixed bottom-4 right-4 z-50 w-80">
          {error instanceof ServerError ? (
            <ServerErrorComponent message={error.message} />
          ) : error instanceof NotFoundError ? (
            <NotFoundErrorComponent message={error.message} />
          ) : error instanceof AuthenticationError ? (
            <AuthenticationErrorComponent message={error.message} />
          ) : (
            <div className="text-center text-red-500 p-4 border border-red-500 rounded-md bg-red-50">
              <h2 className="text-lg font-semibold">An Error Occurred</h2>
              <p>{error.message || 'An unexpected error occurred.'}</p>
            </div>
          )}
          <button 
            onClick={clearError} 
            className="mt-2 w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
          >
            Dismiss
          </button>
        </div>
      )}
    </GlobalErrorContext.Provider>
  );
};

export const useGlobalError = () => {
  const context = useContext(GlobalErrorContext);
  if (context === undefined) {
    throw new Error('useGlobalError must be used within a GlobalErrorProvider');
  }
  return context;
};
