const express = require('express');
const multer  = require('multer');

const router = express.Router();

const latest = new Map();

// Multer for multipart/form-data uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// GET /api/video/status?roomId=roomA
router.get('/status', (req, res) => {
  const roomId = (req.query.roomId || 'roomA').toString();
  const entry = latest.get(roomId);
  res.json({
    ok: true,
    roomId,
    hasFrame: !!entry,
    ts: entry?.ts ?? null,
    mime: entry?.mime ?? null,
  });
});

// POST /api/video/frame
// Accepts:
//  1) multipart/form-data with field "frame" (preferred; used by your worker)
//  2) raw image body with Content-Type image/jpeg|image/png
//  3) JSON data URL { image: "data:image/jpeg;base64,..." }
router.post('/frame', upload.single('frame'), (req, res) => {
  const roomId = (req.query.roomId || req.header('x-room-id') || 'roomA').toString();

  // 1) multipart path (worker sends this)
  if (req.file) {
    const mime = req.file.mimetype;
    if (mime !== 'image/jpeg' && mime !== 'image/png') {
      return res.status(415).json({ ok: false, error: 'JPEG/PNG only' });
    }
    latest.set(roomId, { buf: req.file.buffer, ts: Date.now(), mime });
    req.app.get('io')?.emit('video:frame', { roomId, ts: Date.now() });
    return res.json({ ok: true });
  }

  // 2) raw image body path
  const ct = req.headers['content-type'] || '';
  if (ct.startsWith('image/')) {
    const buf = Buffer.from(req.body);
    latest.set(roomId, { buf, ts: Date.now(), mime: ct });
    req.app.get('io')?.emit('video:frame', { roomId, ts: Date.now() });
    return res.json({ ok: true });
  }

  // 3) JSON data URL
  if (req.is('application/json')) {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const image = data?.image;
      if (!image || !image.startsWith('data:image/')) {
        return res.status(400).json({ ok: false, error: 'missing or bad data URL' });
      }
      const [meta, b64] = image.split(',', 2);
      const mime = meta.substring(5, meta.indexOf(';')); // e.g. image/jpeg
      const buf = Buffer.from(b64, 'base64');
      latest.set(roomId, { buf, ts: Date.now(), mime });
      req.app.get('io')?.emit('video:frame', { roomId, ts: Date.now() });
      return res.json({ ok: true });
    } catch {
      return res.status(400).json({ ok: false, error: 'bad json' });
    }
  }

  return res.status(400).json({ ok: false, error: 'unsupported content-type' });
});

// GET /api/video/latest?roomId=roomA
router.get('/latest', (req, res) => {
  const roomId = (req.query.roomId || 'roomA').toString();
  const entry = latest.get(roomId);
  if (!entry) return res.status(204).end(); // no frame yet
  res.set('Content-Type', entry.mime || 'image/jpeg');
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.send(entry.buf);
});

module.exports = router;
