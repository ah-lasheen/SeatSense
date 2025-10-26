// backend/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const { Server } = require('socket.io');

// IMPORTANT: use ./config (not config.example.js) in real runs.
// Fallbacks ensure it still works if you haven't created config.js yet.
let config = {};
try {
  config = require('./config'); // create this from config.example.js
} catch (_) {
  config = require('./config.example.js');
}

const PORT = config.PORT || process.env.PORT || 5000;

// Allow CORS_ORIGIN as array or comma-separated string.
// Defaults to CRA dev origins.
const rawOrigins =
  config.CORS_ORIGIN ||
  process.env.CORS_ORIGIN ||
  'http://localhost:3000,http://127.0.0.1:3000';

const ALLOWED_ORIGINS = Array.isArray(rawOrigins)
  ? rawOrigins
  : String(rawOrigins)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

const app = express();
const server = http.createServer(app);

// --- Socket.IO with explicit CORS ---
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'], // Firefox-friendly
});
app.set('io', io);

// --- Middleware ---
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.options('*', cors({ origin: ALLOWED_ORIGINS, credentials: true })); // preflight
app.use(express.json({ limit: '2mb' })); // bump to 2mb to allow small JPEG posts
app.use(morgan('dev'));

// --- Health ---
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// --- Routes ---
app.use('/api/occupancy', require('./routes/occupancy'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/video', require('./routes/video')); // includes /status, /frame, /latest

// --- Errors ---
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// --- Sockets ---
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('disconnect', () => console.log('socket disconnected', socket.id));
});

// --- Boot ---
// server.listen(PORT, () =>
//   console.log(`Backend listening on http://localhost:${PORT} (CORS: ${ALLOWED_ORIGINS.join(', ')})`)
// );
server.listen(PORT, '0.0.0.0', () =>
 console.log(`Backend listening on http://0.0.0.0:${PORT} (CORS: ${ALLOWED_ORIGINS.join(', ')})`)
);
module.exports = { app, io, server };
