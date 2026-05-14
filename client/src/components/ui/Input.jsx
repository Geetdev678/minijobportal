// Input component
import React from 'react';

const Input = ({ label, error, ...props }) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <input {...props} />
      {error && <span>{error}</span>}
    </div>
  );
};

export default Input;