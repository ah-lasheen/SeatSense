import React from 'react';
import './StatusIndicator.css';

const StatusIndicator = ({ status }) => {
  const statusConfig = {
    empty: {
      label: 'Available',
      className: 'status-available',
    },
    occupied: {
      label: 'Occupied',
      className: 'status-occupied',
    },
    bags: {
      label: 'Bags Only',
      className: 'status-bags',
    },
  };

  const config = statusConfig[status] || statusConfig.empty;

  return (
    <div className="status-indicator">
      <div className={`status-dot ${config.className}`} />
      <span className="status-label">{config.label}</span>
    </div>
  );
};

export default StatusIndicator;
