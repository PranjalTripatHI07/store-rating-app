const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');

// @route   GET /api/stores
// @desc    Get all stores
// @access  Public (but with user-specific data if authenticated)
router.get('/', (req, res, next) => {
  // Make authentication optional for this route
  const authMiddleware = auth.authenticate;
  authMiddleware(req, res, (err) => {
    if (err) {
      // Continue without authentication
      req.user = null;
    }
    next();
  });
}, storeController.getAllStores);

// @route   GET /api/stores/:id
// @desc    Get store by ID
// @access  Public (but with user-specific data if authenticated)
router.get('/:id', (req, res, next) => {
  // Make authentication optional for this route
  const authMiddleware = auth.authenticate;
  authMiddleware(req, res, (err) => {
    if (err) {
      // Continue without authentication
      req.user = null;
    }
    next();
  });
}, storeController.getStoreById);

// @route   GET /api/stores/owner/dashboard
// @desc    Get store owner dashboard data
// @access  Store Owner
router.get(
  '/owner/dashboard',
  auth.authenticate,
  auth.isStoreOwner,
  storeController.getStoreOwnerData
);

// The following routes require admin access
// @route   POST /api/stores
// @desc    Create a new store
// @access  Admin
router.post(
  '/',
  auth.authenticate,
  auth.isAdmin,
  validation.validateStore,
  validation.handleValidationErrors,
  storeController.createStore
);

// @route   PUT /api/stores/:id
// @desc    Update store
// @access  Admin
router.put(
  '/:id',
  auth.authenticate,
  auth.isAdmin,
  storeController.updateStore
);

// @route   DELETE /api/stores/:id
// @desc    Delete store
// @access  Admin
router.delete(
  '/:id',
  auth.authenticate,
  auth.isAdmin,
  storeController.deleteStore
);

module.exports = router; 