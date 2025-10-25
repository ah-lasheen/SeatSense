import React, { useState, useEffect } from 'react';
import './RoomReservations.css';

const RoomReservations = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for now - will be replaced with real API calls
  useEffect(() => {
    const mockRooms = [
      { id: 1, name: 'Study Room A', available: true, nextAvailable: null },
      { id: 2, name: 'Study Room B', available: false, nextAvailable: '2:30 PM' },
      { id: 3, name: 'Study Room C', available: true, nextAvailable: null },
      { id: 4, name: 'Study Room D', available: false, nextAvailable: '4:15 PM' },
      { id: 5, name: 'Study Room E', available: true, nextAvailable: null },
    ];

    setTimeout(() => {
      setRooms(mockRooms);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="room-reservations">
        <h3>Room Reservations</h3>
        <div className="loading">Loading room data...</div>
      </div>
    );
  }

  const availableRooms = rooms.filter(room => room.available);
  const unavailableRooms = rooms.filter(room => !room.available);

  return (
    <div className="room-reservations">
      <h3>Room Reservations</h3>
      
      {/* Available Rooms Section */}
      {availableRooms.length > 0 && (
        <div className="room-section">
          <h4 className="section-title available">Available Now</h4>
          <div className="room-list">
            {availableRooms.map(room => (
              <div key={room.id} className="room-card available">
                <div className="room-info">
                  <h5>{room.name}</h5>
                </div>
                <button className="reserve-btn">Reserve</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unavailable Rooms Section */}
      {unavailableRooms.length > 0 && (
        <div className="room-section">
          <h4 className="section-title unavailable">Soonest Available</h4>
          <div className="room-list">
            {unavailableRooms.map(room => (
              <div key={room.id} className="room-card unavailable">
                <div className="room-info">
                  <h5>{room.name}</h5>
                  <p className="next-available">Next available: {room.nextAvailable}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomReservations;
