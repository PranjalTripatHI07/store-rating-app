const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  validation.validateRegistration,
  validation.handleValidationErrors,
  authController.register
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth.authenticate, authController.getProfile);

// @route   PUT /api/auth/update-password
// @desc    Update user password
// @access  Private
router.put(
  '/update-password',
  auth.authenticate,
  validation.validatePasswordUpdate,
  validation.handleValidationErrors,
  authController.updatePassword
);

module.exports = router; 