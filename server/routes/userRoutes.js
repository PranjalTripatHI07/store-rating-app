const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');

// All routes in this file require admin access
router.use(auth.authenticate, auth.isAdmin);

// @route   GET /api/users
// @desc    Get all users
// @access  Admin
router.get('/', userController.getAllUsers);

// @route   GET /api/users/dashboard
// @desc    Get admin dashboard data
// @access  Admin
router.get('/dashboard', userController.getDashboardData);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Admin
router.get('/:id', userController.getUserById);

// @route   POST /api/users
// @desc    Create a new user
// @access  Admin
router.post(
  '/',
  validation.validateRegistration,
  validation.handleValidationErrors,
  userController.createUser
);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Admin
router.put('/:id', userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Admin
router.delete('/:id', userController.deleteUser);

module.exports = router; 