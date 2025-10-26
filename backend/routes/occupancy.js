// backend/routes/occupancy.js
const express = require('express');
const router = express.Router();
const store = require('../services/occupancyStore');

// GET /api/occupancy -> all rooms current state
router.get('/', (req, res) => {
  res.json({ rooms: store.getAll(), updatedAt: Date.now() });
});

// GET /api/occupancy/history?roomId=roomA
router.get('/history', (req, res) => {
  const { roomId } = req.query;
  res.json({ history: store.getHistory(roomId).slice(-1000) });
});

// POST /api/occupancy  { roomId, occupied, ts?, source? }
router.post('/', (req, res) => {
  const io = req.app.get('io');
  const { roomId = 'roomA', occupied, ts = Date.now(), source = 'unknown' } = req.body || {};
  if (typeof occupied !== 'boolean') {
    return res.status(400).json({ ok: false, error: 'occupied must be boolean' });
  }
  const payload = { occupied, ts, source };
  store.set(roomId, payload);
  io.emit('occupancy:update', { roomId, ...payload }); // realtime
  return res.json({ ok: true });
});

module.exports = router;
