// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); // Simple wrapper for async functions to catch errors
const User = require('../models/User');
const config = require('../config');

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);

      // Attach user to the request object (without password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Middleware for admin routes
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

// Middleware for artist routes
const artist = (req, res, next) => {
  if (req.user && (req.user.isArtist || req.user.isAdmin)) { // Admins can also act as artists
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an artist');
  }
};


module.exports = { protect, admin, artist };

// Helper to handle async errors in controllers (can be placed in utils or a separate file)
// utils/asyncHandler.js (or directly in authMiddleware as done here)
// This is a simple version, for more robust error handling, consider 'express-async-handler' package
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}