const cors = require('cors');
const morgan = require('morgan');

// CORS Middleware
const corsMiddleware = cors({
  origin: ['http://localhost:3000', 'http://localhost:19006'], // Expo dev server
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Logging Middleware
const loggingMiddleware = morgan('combined');

// JSON Parser Middleware
const jsonMiddleware = (req, res, next) => {
  // Built-in Express JSON parser with size limit
  return require('express').json({ limit: '10mb' })(req, res, next);
};

// URL Encoded Middleware
const urlencodedMiddleware = (req, res, next) => {
  return require('express').urlencoded({ extended: true, limit: '10mb' })(req, res, next);
};

// Authentication Middleware (contoh untuk JWT)
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    // Uncomment when you have JWT setup
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    
    // For now, just pass through
    next();
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Error Handling Middleware
const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Default error
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Rate Limiting Middleware
const rateLimitMiddleware = (windowMs = 15 * 60 * 1000, max = 100) => {
  const rateLimit = require('express-rate-limit');
  
  return rateLimit({
    windowMs, // 15 minutes default
    max, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Request ID Middleware (untuk tracking requests)
const requestIdMiddleware = (req, res, next) => {
  req.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  res.setHeader('X-Request-ID', req.id);
  next();
};

module.exports = {
  corsMiddleware,
  loggingMiddleware,
  jsonMiddleware,
  urlencodedMiddleware,
  authMiddleware,
  errorMiddleware,
  rateLimitMiddleware,
  requestIdMiddleware
};