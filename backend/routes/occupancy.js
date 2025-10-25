const express = require('express');
const router = express.Router();

// Mock occupancy data - will be replaced with real computer vision processing
let occupancyData = {
  available: 12,
  occupied: 18,
  total: 30,
  lastUpdated: new Date().toISOString()
};

// Get current occupancy data
router.get('/', (req, res) => {
  res.json(occupancyData);
});

// Update occupancy data (for testing/development)
router.post('/', (req, res) => {
  const { available, occupied, total } = req.body;
  
  if (available !== undefined && occupied !== undefined && total !== undefined) {
    occupancyData = {
      available,
      occupied,
      total,
      lastUpdated: new Date().toISOString()
    };
    res.json({ message: 'Occupancy data updated', data: occupancyData });
  } else {
    res.status(400).json({ error: 'Missing required fields: available, occupied, total' });
  }
});

// Get occupancy history (placeholder for future implementation)
router.get('/history', (req, res) => {
  res.json({
    message: 'Occupancy history endpoint - to be implemented',
    data: []
  });
});

module.exports = router;
