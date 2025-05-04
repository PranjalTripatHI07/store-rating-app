const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');

// All routes in this file require authentication
router.use(auth.authenticate);

// @route   POST /api/ratings
// @desc    Submit a new rating or update existing
// @access  Normal User
router.post(
  '/',
  auth.isUser,
  validation.validateRating,
  validation.handleValidationErrors,
  ratingController.submitRating
);

// @route   GET /api/ratings/store/:storeId
// @desc    Get user's rating for a specific store
// @access  Normal User
router.get(
  '/store/:storeId',
  auth.isUser,
  ratingController.getUserRatingForStore
);

// @route   DELETE /api/ratings/:id
// @desc    Delete a rating (for user's own ratings or admin)
// @access  Normal User or Admin
router.delete(
  '/:id',
  ratingController.deleteRating
);

module.exports = router; 