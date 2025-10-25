const express = require('express');
const router = express.Router();

// Mock room data - will be replaced with real library API integration
let rooms = [
  { id: 1, name: 'Study Room A', capacity: 4, available: true, nextAvailable: null, location: 'Floor 1' },
  { id: 2, name: 'Study Room B', capacity: 6, available: false, nextAvailable: '2:30 PM', location: 'Floor 1' },
  { id: 3, name: 'Quiet Zone', capacity: 8, available: true, nextAvailable: null, location: 'Floor 2' },
  { id: 4, name: 'Group Study', capacity: 12, available: false, nextAvailable: '4:15 PM', location: 'Floor 2' },
  { id: 5, name: 'Computer Lab', capacity: 20, available: true, nextAvailable: null, location: 'Floor 3' },
];

// Get all rooms
router.get('/', (req, res) => {
  res.json(rooms);
});

// Get available rooms
router.get('/available', (req, res) => {
  const availableRooms = rooms.filter(room => room.available);
  res.json(availableRooms);
});

// Get room by ID
router.get('/:id', (req, res) => {
  const room = rooms.find(r => r.id === parseInt(req.params.id));
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json(room);
});

// Reserve a room
router.post('/:id/reserve', (req, res) => {
  const roomId = parseInt(req.params.id);
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  if (!room.available) {
    return res.status(400).json({ error: 'Room is not available' });
  }
  
  // Mock reservation logic
  room.available = false;
  room.nextAvailable = '5:00 PM'; // Mock next available time
  
  res.json({ 
    message: 'Room reserved successfully', 
    room: room,
    reservationId: `RES-${Date.now()}`
  });
});

// Cancel reservation
router.delete('/:id/reserve', (req, res) => {
  const roomId = parseInt(req.params.id);
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  room.available = true;
  room.nextAvailable = null;
  
  res.json({ message: 'Reservation cancelled successfully', room: room });
});

module.exports = router;
