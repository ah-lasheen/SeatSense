// backend/routes/video.js
const express = require('express');
const router = express.Router();

// In-memory latest frames by room
// { roomId: { buf: Buffer, ts: number, mime: string } }
const latest = new Map();

// GET /api/video/status
router.get('/status', (_req, res) => res.json({ ok: true, rooms: [...latest.keys()], ts: Date.now() }));

// POST /api/video/frame  (multipart or base64 JSON)
router.post('/frame', express.raw({ type: '*/*', limit: '4mb' }), (req, res) => {
  // Accept either:
  // 1) multipart/form-data: field "frame" (image/jpeg or image/png)
  // 2) application/json: { roomId, image: "data:image/jpeg;base64,..." }
  // 3) image/jpeg/png directly as body with ?roomId=roomA
  const roomId = (req.query.roomId || req.header('x-room-id') || 'roomA').toString();

  if (req.is('application/json')) {
    try {
      const data = JSON.parse(req.body.toString());
      const { image } = data || {};
      if (!image || !image.startsWith('data:image/')) {
        return res.status(400).json({ ok: false, error: 'missing or bad data URL' });
      }
      const [meta, b64] = image.split(',', 2);
      const mime = meta.substring(5, meta.indexOf(';')); // image/jpeg
      const buf = Buffer.from(b64, 'base64');
      latest.set(roomId, { buf, ts: Date.now(), mime });
      req.app.get('io').emit('video:frame', { roomId, ts: Date.now() }); // optional notify
      return res.json({ ok: true });
    } catch (e) {
      return res.status(400).json({ ok: false, error: 'bad json' });
    }
  }

  // multipart/form-data or raw image
  const ct = req.headers['content-type'] || '';
  if (ct.startsWith('multipart/form-data')) {
    // naive multipart parse: rely on upstream (use multer if you want)
    return res.status(415).json({ ok: false, error: 'multipart not implemented; send JSON data URL or raw image with ?roomId=' });
  }

  // raw image body path (image/jpeg or image/png)
  if (ct.startsWith('image/')) {
    const buf = Buffer.from(req.body);
    latest.set(roomId, { buf, ts: Date.now(), mime: ct });
    req.app.get('io').emit('video:frame', { roomId, ts: Date.now() });
    return res.json({ ok: true });
  }

  return res.status(400).json({ ok: false, error: 'unsupported content-type' });
});

// GET /api/video/latest?roomId=roomA
router.get('/latest', (req, res) => {
  const roomId = (req.query.roomId || 'roomA').toString();
  const entry = latest.get(roomId);
  if (!entry) return res.status(404).json({ error: 'no frame' });
  res.set('Content-Type', entry.mime || 'image/jpeg');
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  return res.send(entry.buf);
});

module.exports = router;
