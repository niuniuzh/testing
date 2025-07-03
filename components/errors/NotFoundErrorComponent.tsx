import React from 'react';

interface NotFoundErrorComponentProps {
  message?: string;
}

const NotFoundErrorComponent: React.FC<NotFoundErrorComponentProps> = ({ message }) => {
  return (
    <div className="text-center text-orange-500 p-4 border border-orange-500 rounded-md bg-orange-50">
      <h2 className="text-lg font-semibold">Not Found</h2>
      <p>{message || 'The requested resource could not be found.'}</p>
    </div>
  );
};

export default NotFoundErrorComponent;
