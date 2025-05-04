const { body, validationResult } = require('express-validator');

// Validate registration input
exports.validateRegistration = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please include a valid email'),
  
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('Password must include at least one uppercase letter and one special character'),
  
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address can be max 400 characters')
];

// Validate store input
exports.validateStore = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please include a valid email'),
  
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address can be max 400 characters'),
  
  body('ownerId')
    .isNumeric()
    .withMessage('Owner ID must be a number')
];

// Validate rating input
exports.validateRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
];

// Validate password update
exports.validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('Password must include at least one uppercase letter and one special character')
];

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
}; 