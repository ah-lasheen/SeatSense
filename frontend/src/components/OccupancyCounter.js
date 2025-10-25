import React, { useState, useEffect } from 'react';
import './OccupancyCounter.css';

const OccupancyCounter = () => {
  const [occupancyData, setOccupancyData] = useState({
    available: 0,
    occupied: 0,
    total: 0
  });

  // Mock data for now - will be replaced with real API calls
  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setOccupancyData({
        available: Math.floor(Math.random() * 20) + 5,
        occupied: Math.floor(Math.random() * 15) + 10,
        total: 30
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="occupancy-counter">
      <h3>Study Space Occupancy</h3>
      <div className="counter-grid">
        <div className="counter-item available">
          <div className="counter-number">{occupancyData.available}</div>
          <div className="counter-label">Available</div>
        </div>
        <div className="counter-item occupied">
          <div className="counter-number">{occupancyData.occupied}</div>
          <div className="counter-label">Occupied</div>
        </div>
        <div className="counter-item total">
          <div className="counter-number">{occupancyData.total}</div>
          <div className="counter-label">Total Spaces</div>
        </div>
      </div>
      <div className="occupancy-bar">
        <div 
          className="occupancy-fill"
          style={{ 
            width: `${(occupancyData.occupied / occupancyData.total) * 100}%` 
          }}
        ></div>
      </div>
    </div>
  );
};

export default OccupancyCounter;
