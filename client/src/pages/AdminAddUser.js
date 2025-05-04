import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../utils/api';

const AdminAddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user'
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, address, role } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormError('');
    
    // Client-side validation
    if (name.length < 20 || name.length > 60) {
      setFormError('Name must be between 20 and 60 characters');
      return;
    }

    if (address.length > 400) {
      setFormError('Address can be max 400 characters');
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setFormError('Password must be between 8 and 16 characters');
      return;
    }

    // Check for uppercase letter and special character
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    
    if (!hasUpperCase || !hasSpecialChar) {
      setFormError('Password must include at least one uppercase letter and one special character');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createUser(formData);
      
      if (res.data.success) {
        navigate('/admin/users');
      }
    } catch (err) {
      setFormError(
        err.response?.data?.message || 
        (err.response?.data?.errors && err.response.data.errors[0]?.msg) ||
        err.message || 
        'Failed to create user. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Add New User</h2>
        
        {formError && (
          <div className="alert alert-danger">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={name}
              onChange={handleChange}
              required
              minLength="20"
              maxLength="60"
            />
            <small>Must be between 20 and 60 characters</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={password}
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
            <label htmlFor="address" className="form-label">Address</label>
            <textarea
              id="address"
              name="address"
              className="form-control"
              value={address}
              onChange={handleChange}
              required
              maxLength="400"
              rows="3"
            ></textarea>
            <small>Maximum 400 characters</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              name="role"
              className="form-control"
              value={role}
              onChange={handleChange}
              required
            >
              <option value="user">Normal User</option>
              <option value="admin">Administrator</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
          
          <div className="flex" style={{ gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/admin/users')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn" 
              style={{ flex: 1 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddUser; 