// backend/routes/rooms.js
const express = require('express');
const router = express.Router();

const rooms = [
  { id: 'roomA', name: 'Library Study Room A', capacity: 4, location: 'Floor 1' },
  { id: 'roomB', name: 'Library Study Room B', capacity: 6, location: 'Floor 1' },
];

router.get('/', (_req, res) => res.json({ rooms }));
router.get('/:id', (req, res) => {
  const r = rooms.find(x => x.id === req.params.id);
  if (!r) return res.status(404).json({ error: 'not found' });
  res.json(r);
});
router.post('/:id/reserve', (_req, res) => res.json({ ok: true })); // stub
router.delete('/:id/reserve', (_req, res) => res.json({ ok: true })); // stub

module.exports = router;
