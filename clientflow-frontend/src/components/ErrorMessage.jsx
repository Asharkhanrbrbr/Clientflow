import React from 'react';

const ErrorMessage = ({ error, className = '' }) => (
  error ? <div className={`bg-red-100 text-red-700 px-4 py-2 rounded mb-4 ${className}`}>{error}</div> : null
);

export default ErrorMessage;
