// backend/server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const morgan = require('morgan');
const { PORT, CORS_ORIGIN } = require('./config.example.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: CORS_ORIGIN, methods: ['GET','POST'] }});
app.set('io', io);

// middleware
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// health
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// routes
app.use('/api/occupancy', require('./routes/occupancy'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/video', require('./routes/video'));
// app.use('/api/video', require('./routes/video'));

// errors
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// socket events (optional)
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('disconnect', () => console.log('socket disconnected', socket.id));
});

// boot
server.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));

module.exports = { app, io };
