# SeatSense - Library Occupancy Tracker

A real-time library occupancy tracker that uses computer vision to detect available study spaces and integrates with library room reservation systems.

## Features

- **Real-time Video Processing**: Live video stream analysis using computer vision
- **Occupancy Detection**: Automatic detection of available vs occupied study spaces
- **Room Reservations**: Integration with library room booking systems
- **Live Updates**: Real-time data updates using WebSocket connections
- **Responsive Design**: Modern, mobile-friendly interface

## Project Structure

```
Stride/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Header.js
│   │   │   ├── VideoDisplay.js
│   │   │   ├── OccupancyCounter.js
│   │   │   └── RoomReservations.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── routes/             # API route handlers
│   │   ├── occupancy.js
│   │   ├── rooms.js
│   │   └── video.js
│   ├── server.js
│   ├── config.example.js
│   └── package.json
└── package.json            # Root package.json for scripts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for all parts of the project:

```bash
npm run install-all
```

### Development

Start both frontend and backend in development mode:

```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend API on http://localhost:5000

### Individual Services

Start only the frontend:
```bash
npm run client
```

Start only the backend:
```bash
npm run server
```

## API Endpoints

### Occupancy
- `GET /api/occupancy` - Get current occupancy data
- `POST /api/occupancy` - Update occupancy data
- `GET /api/occupancy/history` - Get occupancy history

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/available` - Get available rooms
- `GET /api/rooms/:id` - Get specific room
- `POST /api/rooms/:id/reserve` - Reserve a room
- `DELETE /api/rooms/:id/reserve` - Cancel reservation

### Video
- `GET /api/video/status` - Get video stream status
- `POST /api/video/start` - Start video stream
- `POST /api/video/stop` - Stop video stream
- `GET /api/video/analysis` - Get current frame analysis

## Future Development

### Computer Vision Integration
- Implement OpenCV for real-time video processing
- Add machine learning models for occupancy detection
- Create video stream handling for live camera feeds

### Library API Integration
- Connect to actual library reservation systems
- Implement real-time room availability updates
- Add user authentication and reservation management

### Additional Features
- Historical data visualization
- Mobile app development
- Push notifications for room availability
- Multi-library support

## Technologies Used

- **Frontend**: React, CSS3, Axios
- **Backend**: Node.js, Express, Socket.io
- **Future**: OpenCV, Machine Learning models, Database integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
