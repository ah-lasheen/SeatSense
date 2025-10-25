import React from 'react';
import './VideoDisplay.css';

const VideoDisplay = () => {
  return (
    <div className="video-container">
      <div className="video-placeholder">
        <div className="video-icon"></div>
        <h3>Live Video Feed</h3>
        <p>Video stream will appear here once connected</p>
        <div className="video-controls">
          <button className="connect-btn">Connect Camera</button>
        </div>
      </div>
    </div>
  );
};

export default VideoDisplay;
