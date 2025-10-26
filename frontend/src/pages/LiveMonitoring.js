import React from 'react';
import VideoDisplay from '../components/VideoDisplay';
import OccupancyCounter from '../components/OccupancyCounter';
import RoomReservations from '../components/RoomReservations';
import Header from '../components/Header';
import './LiveMonitoring.css';

const LiveMonitoring = ({ onBack }) => {
  return (
    <div className="live-monitoring">
      <Header />
      <div className="live-monitoring-nav">
        <button onClick={onBack} className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Dashboard
        </button>
      </div>
      <main className="live-monitoring-content">
        <div className="video-section">
          <VideoDisplay />
          <OccupancyCounter />
        </div>
        <div className="reservations-section">
          <RoomReservations />
        </div>
      </main>
    </div>
  );
};

export default LiveMonitoring;
