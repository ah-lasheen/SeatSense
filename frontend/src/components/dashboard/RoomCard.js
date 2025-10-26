import React from 'react';
import Button from '../ui/Button';
import StatusIndicator from './StatusIndicator';
import './RoomCard.css';

const RoomCard = ({ room, onBook }) => {
  const lastUpdated = new Date(room.lastUpdated);
  const timeAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 1000 / 60);
  const timeDisplay = timeAgo < 1 ? 'Just now' : `${timeAgo}m ago`;

  return (
    <div className="room-card">
      <div className="room-card-content">
        {/* Header */}
        <div className="room-card-header">
          <h3 className="room-card-title">{room.name}</h3>
          <div className="room-card-location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Room {room.roomNumber}</span>
          </div>
        </div>

        {/* Info */}
        <div className="room-card-info">
          <div className="room-card-capacity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Capacity: {room.capacity}</span>
          </div>
          <div className="room-card-updated">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{timeDisplay}</span>
          </div>
        </div>

        {/* Status */}
        <StatusIndicator status={room.status} />

        {/* Action Button */}
        <Button
          onClick={() => onBook(room)}
          disabled={room.status !== 'empty'}
          variant={room.status === 'empty' ? 'default' : 'secondary'}
          className="room-card-button"
        >
          {room.status === 'empty' ? 'Book Room' : 'Not Available'}
        </Button>
      </div>
    </div>
  );
};

export default RoomCard;
