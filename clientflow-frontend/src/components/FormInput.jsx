import React from 'react';

const FormInput = ({ label, type = 'text', name, value, onChange, error, ...props }) => (
  <div className="mb-4">
    {label && <label className="block mb-1 font-medium" htmlFor={name}>{label}</label>}
    <input
      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default FormInput;
