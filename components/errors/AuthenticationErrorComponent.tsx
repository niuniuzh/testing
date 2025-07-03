import React from 'react';

interface AuthenticationErrorComponentProps {
  message?: string;
}

const AuthenticationErrorComponent: React.FC<AuthenticationErrorComponentProps> = ({ message }) => {
  return (
    <div className="text-center text-purple-500 p-4 border border-purple-500 rounded-md bg-purple-50">
      <h2 className="text-lg font-semibold">Authentication Required</h2>
      <p>{message || 'You need to be authenticated to access this resource.'}</p>
    </div>
  );
};

export default AuthenticationErrorComponent;
