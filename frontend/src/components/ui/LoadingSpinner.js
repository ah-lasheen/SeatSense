import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md' }) => {
  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner loading-spinner-${size}`} />
    </div>
  );
};

export default LoadingSpinner;
