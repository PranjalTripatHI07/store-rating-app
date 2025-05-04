// Validation functions for forms

// Validate name (20-60 characters)
export const validateName = (name) => {
  if (!name || name.length < 20 || name.length > 60) {
    return 'Name must be between 20 and 60 characters';
  }
  return null;
};

// Validate email
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !regex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

// Validate password (8-16 chars, uppercase, special char)
export const validatePassword = (password) => {
  if (!password || password.length < 8 || password.length > 16) {
    return 'Password must be between 8 and 16 characters';
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  
  if (!hasUpperCase || !hasSpecialChar) {
    return 'Password must include at least one uppercase letter and one special character';
  }
  
  return null;
};

// Validate address (max 400 chars)
export const validateAddress = (address) => {
  if (!address) {
    return 'Address is required';
  }
  
  if (address.length > 400) {
    return 'Address can be max 400 characters';
  }
  
  return null;
};

// Validate rating (1-5)
export const validateRating = (rating) => {
  if (!rating || rating < 1 || rating > 5) {
    return 'Rating must be between 1 and 5';
  }
  return null;
};

// Validate form data
export const validateForm = (data, fields) => {
  const errors = {};
  
  fields.forEach(field => {
    switch (field) {
      case 'name':
        const nameError = validateName(data.name);
        if (nameError) errors.name = nameError;
        break;
      case 'email':
        const emailError = validateEmail(data.email);
        if (emailError) errors.email = emailError;
        break;
      case 'password':
        const passwordError = validatePassword(data.password);
        if (passwordError) errors.password = passwordError;
        break;
      case 'address':
        const addressError = validateAddress(data.address);
        if (addressError) errors.address = addressError;
        break;
      case 'rating':
        const ratingError = validateRating(data.rating);
        if (ratingError) errors.rating = ratingError;
        break;
      default:
        break;
    }
  });
  
  return errors;
}; 