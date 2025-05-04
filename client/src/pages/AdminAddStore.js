import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createStore, getAllUsers } from '../utils/api';

const AdminAddStore = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });
  const [storeOwners, setStoreOwners] = useState([]);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { name, email, address, ownerId } = formData;

  useEffect(() => {
    const fetchStoreOwners = async () => {
      try {
        const res = await getAllUsers({ role: 'store_owner' });
        if (res.data.success) {
          setStoreOwners(res.data.users);
          if (res.data.users.length > 0) {
            setFormData(prev => ({ ...prev, ownerId: res.data.users[0].id }));
          }
        }
      } catch (err) {
        setFormError('Failed to load store owners. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreOwners();
  }, []);

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

    if (!ownerId) {
      setFormError('Please select a store owner');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createStore(formData);
      
      if (res.data.success) {
        navigate('/admin/stores');
      }
    } catch (err) {
      setFormError(
        err.response?.data?.message || 
        (err.response?.data?.errors && err.response.data.errors[0]?.msg) ||
        err.message || 
        'Failed to create store. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading store owners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Add New Store</h2>
        
        {formError && (
          <div className="alert alert-danger">
            {formError}
          </div>
        )}
        
        {storeOwners.length === 0 ? (
          <div className="alert alert-warning">
            No store owners found. Please <Link to="/admin/users/new">create a store owner</Link> first.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Store Name</label>
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
              <label htmlFor="ownerId" className="form-label">Store Owner</label>
              <select
                id="ownerId"
                name="ownerId"
                className="form-control"
                value={ownerId}
                onChange={handleChange}
                required
              >
                {storeOwners.map(owner => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex" style={{ gap: '1rem', marginTop: '1rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate('/admin/stores')}
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
                {isSubmitting ? 'Creating...' : 'Create Store'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminAddStore; 