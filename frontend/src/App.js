import React from 'react';
import './App.css';
import VideoDisplay from './components/VideoDisplay';
import OccupancyCounter from './components/OccupancyCounter';
import RoomReservations from './components/RoomReservations';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
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
}

export default App;
