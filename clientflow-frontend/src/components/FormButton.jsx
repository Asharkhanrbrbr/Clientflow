import React from 'react';

const FormButton = ({ children, loading, ...props }) => (
  <button
    className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? 'Loading...' : children}
  </button>
);

export default FormButton;
