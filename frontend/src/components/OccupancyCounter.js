import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './OccupancyCounter.css';

const API = import.meta?.env?.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function OccupancyCounter() {
  const [rooms, setRooms] = useState({});

  useEffect(() => {
    // initial pull
    axios.get(`${API}/api/occupancy`).then(r => setRooms(r.data.rooms || {})).catch(() => {});

    // live
    const socket = io(API, { transports: ['websocket'] });
    socket.on('occupancy:update', (msg) => {
      setRooms(prev => ({ ...prev, [msg.roomId]: { occupied: msg.occupied, ts: msg.ts, source: msg.source }}));
    });
    return () => socket.close();
  }, []);

  const entries = Object.entries(rooms);
  return (
    <div className="occupancy-container">
      <div className="occupancy-header">
        <h3>Current Occupancy</h3>
      </div>
      <div className="occupancy-grid">
        {entries.length === 0 && <div className="room-card">No data yet</div>}
        {entries.map(([id, r]) => (
          <div className="room-card" key={id}>
            <div className="room-title">{id}</div>
            <div className={`status-pill ${r.occupied ? 'occupied' : 'available'}`}>
              {r.occupied ? 'Occupied' : 'Available'}
            </div>
            <div className="room-meta">
              Updated {Math.max(0, Math.floor(Date.now()/1000 - (r.ts/1000)))}s ago • source: {r.source}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
