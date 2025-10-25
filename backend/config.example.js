module.exports = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration (for future use)
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'stride_library',
    user: process.env.DB_USER || 'your_username',
    password: process.env.DB_PASSWORD || 'your_password'
  },
  
  // Library API Configuration (for future integration)
  libraryApi: {
    url: process.env.LIBRARY_API_URL || 'https://api.library.edu',
    key: process.env.LIBRARY_API_KEY || 'your_api_key'
  },
  
  // Computer Vision Configuration
  computerVision: {
    opencvPath: process.env.OPENCV_PATH || '/usr/local/lib/python3.8/site-packages/cv2',
    modelPath: process.env.MODEL_PATH || './models/occupancy_detection.pb'
  },
  
  // Socket.io Configuration
  socket: {
    corsOrigin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000'
  }
};
