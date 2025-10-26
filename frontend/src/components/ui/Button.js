import React from 'react';
import './Button.css';

const Button = ({ children, onClick, disabled, variant = 'default', className = '', ...props }) => {
  const baseClass = 'button';
  const variantClass = `button-${variant}`;
  const disabledClass = disabled ? 'button-disabled' : '';
  
  return (
    <button
      className={`${baseClass} ${variantClass} ${disabledClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
