import React from 'react';

interface ServerErrorComponentProps {
  message?: string;
}

const ServerErrorComponent: React.FC<ServerErrorComponentProps> = ({ message }) => {
  return (
    <div className="text-center text-red-500 p-4 border border-red-500 rounded-md bg-red-50">
      <h2 className="text-lg font-semibold">Server Error</h2>
      <p>{message || 'An unexpected server error occurred. Please try again later.'}</p>
    </div>
  );
};

export default ServerErrorComponent;
