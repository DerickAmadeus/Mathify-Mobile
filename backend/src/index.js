const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const {
  corsMiddleware,
  loggingMiddleware,
  jsonMiddleware,
  urlencodedMiddleware,
  authMiddleware,
  errorMiddleware,
  rateLimitMiddleware,
  requestIdMiddleware
} = require('./middleware/middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Apply middleware in order
app.use(requestIdMiddleware);       // Request ID tracking
app.use(corsMiddleware);            // CORS
app.use(loggingMiddleware);         // Logging
app.use(rateLimitMiddleware());     // Rate limiting
app.use(jsonMiddleware);            // JSON parser
app.use(urlencodedMiddleware);      // URL encoded parser

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is healthy!',
    timestamp: new Date().toISOString(),
    requestId: req.id
  });
});

// Protected route example (dengan auth middleware)
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ 
    success: true, 
    message: 'This is a protected route',
    user: req.user 
  });
});

// Routes (tambahkan routes lain di sini)
app.use('/api/users', require('./routes/users'));
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/calculator', require('./routes/calculatorRoutes'));
// app.use('/api/quiz', require('./routes/quizRoutes'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware (harus di paling akhir)
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
