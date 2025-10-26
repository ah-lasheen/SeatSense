// backend/config.js
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  SNAPSHOT_URL: process.env.SNAPSHOT_URL || 'http://10.11.81.246:5055/snapshot', // Jetson snapshot
};
