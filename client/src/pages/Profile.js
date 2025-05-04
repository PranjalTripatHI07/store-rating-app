import React, { useState, useContext } from 'react';
import { updatePassword } from '../utils/api';
import AuthContext from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentPassword, newPassword, confirmPassword } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
    setSuccessMessage('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    
    // Validation
    if (newPassword !== confirmPassword) {
      setFormError('New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 16) {
      setFormError('Password must be between 8 and 16 characters');
      return;
    }

    // Check for uppercase letter and special character
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*]/.test(newPassword);
    
    if (!hasUpperCase || !hasSpecialChar) {
      setFormError('Password must include at least one uppercase letter and one special character');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await updatePassword({
        currentPassword,
        newPassword
      });
      
      if (res.data.success) {
        setSuccessMessage('Password updated successfully');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      setFormError(
        err.response?.data?.message || 
        (err.response?.data?.errors && err.response.data.errors[0]?.msg) ||
        err.message || 
        'Failed to update password. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Your Profile</h2>
        
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Account Information</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Role:</strong> {user.role === 'admin' ? 'Administrator' : user.role === 'store_owner' ? 'Store Owner' : 'Normal User'}</p>
        </div>
        
        <div className="card">
          <h3>Update Password</h3>
          
          {formError && (
            <div className="alert alert-danger">
              {formError}
            </div>
          )}
          
          {successMessage && (
            <div className="alert alert-success">
              {successMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword" className="form-label">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                className="form-control"
                value={currentPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="form-control"
                value={newPassword}
                onChange={handleChange}
                required
                minLength="8"
                maxLength="16"
              />
              <small>
                8-16 characters, must include at least one uppercase letter and one special character
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn" 
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile; 