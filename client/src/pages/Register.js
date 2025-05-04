import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../utils/api';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isAuthenticated, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const { name, email, password, address } = formData;

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
      const res = await apiRegister(formData);
      
      if (res.data.success) {
        register(res.data.user, res.data.token);
        navigate('/stores');
      }
    } catch (err) {
      setFormError(
        err.response?.data?.message || 
        (err.response?.data?.errors && err.response.data.errors[0]?.msg) ||
        err.message || 
        'Registration failed. Please try again.'
      );
      setError(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 className="text-center">Register</h2>
        
        {(formError || error) && (
          <div className="alert alert-danger">
            {formError || error}
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
          
          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p className="text-center" style={{ marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 