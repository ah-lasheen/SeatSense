import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { mockApi } from '../../lib/mockApi';
import './BookingModal.css';

const BookingModal = ({ room, isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    const loadSlots = async () => {
      setIsLoading(true);
      try {
        const availableSlots = await mockApi.getAvailableSlots(room.id, selectedDate);
        setSlots(availableSlots);
      } catch (error) {
        console.error('Error loading slots:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSlots();
  }, [isOpen, selectedDate, room.id]);

  const handleConfirm = async () => {
    if (!selectedSlot) return;

    setIsBooking(true);
    try {
      await mockApi.createBooking({
        roomId: room.id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });
      
      alert(`Booking confirmed! ${room.name} on ${selectedDate} at ${selectedSlot.startTime}`);
      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const modalContent = (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-container">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <div>
              <h2 className="modal-title">Book {room.name}</h2>
              <p className="modal-subtitle">Room {room.roomNumber}</p>
            </div>
            <button onClick={onClose} className="modal-close" aria-label="Close modal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="modal-body">
            {/* Date Picker */}
            <div className="modal-section">
              <label className="modal-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Select Date</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                min={getTodayString()}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null);
                }}
                className="date-input"
              />
              <p className="date-display">{formatDate(selectedDate)}</p>
            </div>

            {/* Time Slots */}
            <div className="modal-section">
              <label className="modal-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Select Time Slot (1 hour)</span>
              </label>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="time-slots-grid">
                  {slots.map((slot) => (
                    <button
                      key={slot.startTime}
                      onClick={() => slot.available && setSelectedSlot(slot)}
                      disabled={!slot.available}
                      className={`time-slot ${
                        selectedSlot?.startTime === slot.startTime ? 'time-slot-selected' : ''
                      } ${!slot.available ? 'time-slot-disabled' : ''}`}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedSlot || isBooking}>
              {isBooking ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default BookingModal;
