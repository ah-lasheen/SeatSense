import React, { useState, useEffect } from 'react';
import { mockApi } from '../lib/mockApi';
import RoomCard from '../components/dashboard/RoomCard';
import BookingModal from '../components/booking/BookingModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import './Dashboard.css';

const Dashboard = ({ onNavigateToLive }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRooms();
    const interval = setInterval(loadRooms, 10000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadRooms = async () => {
    try {
      const roomsData = await mockApi.getRooms();
      setRooms(roomsData);
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-content">
            <div>
              <h1 className="dashboard-title">Study Room Dashboard</h1>
              <p className="dashboard-subtitle">
                Find and book available study rooms across campus
              </p>
            </div>
            <Button 
              onClick={onNavigateToLive}
              variant="default"
              className="live-monitoring-button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
              Live Monitoring
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="dashboard-loading">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Room Grid */}
        {!isLoading && rooms && rooms.length > 0 && (
          <div className="dashboard-grid">
            {rooms.map((room) => (
              <div key={room.id} className="dashboard-grid-item">
                <RoomCard room={room} onBook={handleBookRoom} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && rooms && rooms.length === 0 && (
          <div className="dashboard-empty">
            <p>No rooms available</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
