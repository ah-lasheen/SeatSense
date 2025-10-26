// Mock API for room booking system

// Mock data
const rooms = [
  {
    id: '1',
    name: 'Test Study Room',
    roomNumber: '301A',
    capacity: 6,
    status: 'empty',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Thompson Study Room B',
    roomNumber: '301B',
    capacity: 4,
    status: 'occupied',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Thompson Study Room C',
    roomNumber: '302A',
    capacity: 8,
    status: 'bags',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Main Library Study Room 1',
    roomNumber: '101',
    capacity: 6,
    status: 'empty',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Main Library Study Room 2',
    roomNumber: '102',
    capacity: 4,
    status: 'empty',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Science & Engineering Library A',
    roomNumber: '201',
    capacity: 10,
    status: 'occupied',
    lastUpdated: new Date().toISOString(),
  },
];

const mockUser = {
  id: 'user-1',
  name: 'Brutus Buckeye',
  email: 'buckeye.1@osu.edu',
};

const mockBookings = [
  {
    id: 'booking-1',
    roomId: '2',
    roomName: 'Thompson Study Room B',
    roomNumber: '301B',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '15:00',
    status: 'upcoming',
  },
];

// Mock API functions
export const mockApi = {
  getRooms: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    return rooms.map(room => {
      // Check if any booking for this room is active right now
      const isCurrentlyOccupied = mockBookings.some(booking => {
        if (booking.roomId !== room.id) return false;
        if (booking.status === 'cancelled') return false;
        if (booking.date !== today) return false;

        // Parse start/end times (HH:MM)
        const [sh, sm] = booking.startTime.split(':').map(Number);
        const [eh, em] = booking.endTime.split(':').map(Number);

        const start = new Date();
        start.setHours(sh, sm, 0, 0);
        const end = new Date();
        end.setHours(eh, em, 0, 0);

        return now >= start && now < end;
      });

      const computedStatus = isCurrentlyOccupied ? 'occupied' : room.status;

      return {
        ...room,
        status: computedStatus,
        lastUpdated: new Date().toISOString(),
      };
    });
  },

  getRoom: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return rooms.find(room => room.id === id);
  },

  getAvailableSlots: async (roomId, date) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const slots = [];
    for (let hour = 9; hour < 22; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      // Check if slot is already booked
      const isBooked = mockBookings.some(
        booking =>
          booking.roomId === roomId &&
          booking.date === date &&
          booking.startTime === startTime &&
          booking.status !== 'cancelled'
      );
      
      slots.push({
        startTime,
        endTime,
        available: !isBooked,
      });
    }
    
    return slots;
  },

  createBooking: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const room = rooms.find(r => r.id === data.roomId);
    if (!room) throw new Error('Room not found');
    
    const newBooking = {
      id: `booking-${Date.now()}`,
      roomId: data.roomId,
      roomName: room.name,
      roomNumber: room.roomNumber,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      status: 'upcoming',
    };
    
    mockBookings.push(newBooking);
    return newBooking;
  },

  getMyBookings: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockBookings;
  },

  cancelBooking: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const booking = mockBookings.find(b => b.id === id);
    if (booking) {
      booking.status = 'cancelled';
    }
  },

  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockUser;
  },
};
