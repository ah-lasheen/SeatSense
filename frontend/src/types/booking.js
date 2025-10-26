// Type definitions for booking system
// RoomStatus: 'empty' | 'occupied' | 'bags'

// Room interface
// {
//   id: string;
//   name: string;
//   roomNumber: string;
//   capacity: number;
//   status: RoomStatus;
//   lastUpdated: string;
// }

// TimeSlot interface
// {
//   startTime: string;
//   endTime: string;
//   available: boolean;
// }

// Booking interface
// {
//   id: string;
//   roomId: string;
//   roomName: string;
//   roomNumber: string;
//   date: string;
//   startTime: string;
//   endTime: string;
//   status: 'upcoming' | 'past' | 'cancelled';
// }

// User interface
// {
//   id: string;
//   name: string;
//   email: string;
// }

export const RoomStatus = {
  EMPTY: 'empty',
  OCCUPIED: 'occupied',
  BAGS: 'bags'
};

export const BookingStatus = {
  UPCOMING: 'upcoming',
  PAST: 'past',
  CANCELLED: 'cancelled'
};
