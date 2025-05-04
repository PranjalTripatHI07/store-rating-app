import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getAllStores, submitRating } from '../utils/api';
import AuthContext from '../context/AuthContext';
import StarRating from '../components/StarRating';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [submittingRating, setSubmittingRating] = useState(null);

  const { isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await getAllStores();
        if (res.data.success) {
          setStores(res.data.stores);
          setFilteredStores(res.data.stores);
        }
      } catch (err) {
        setError('Failed to load stores. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    // Apply filters
    const result = stores.filter(
      store => 
        store.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        store.address.toLowerCase().includes(filters.address.toLowerCase())
    );
    setFilteredStores(result);
  }, [filters, stores]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingChange = async (storeId, rating) => {
    if (!isAuthenticated || user.role !== 'user') {
      return;
    }

    setSubmittingRating(storeId);
    try {
      const res = await submitRating({ storeId, rating });
      if (res.data.success) {
        // Update the store's rating in the UI
        setStores(prevStores => 
          prevStores.map(store => 
            store.id === storeId 
              ? { ...store, userRating: rating } 
              : store
          )
        );
      }
    } catch (err) {
      setError('Failed to submit rating. Please try again.');
      console.error(err);
    } finally {
      setSubmittingRating(null);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Store Listings</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        <h3>Filter Stores</h3>
        <div className="flex" style={{ gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="name" className="form-label">Store Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Search by name..."
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="address" className="form-label">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-control"
              value={filters.address}
              onChange={handleFilterChange}
              placeholder="Search by address..."
            />
          </div>
        </div>
      </div>
      
      {filteredStores.length === 0 ? (
        <div className="card">
          <p>No stores found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid">
          {filteredStores.map(store => (
            <div key={store.id} className="card">
              <h3>{store.name}</h3>
              <p><strong>Address:</strong> {store.address}</p>
              
              <div style={{ margin: '1rem 0' }}>
                <p><strong>Overall Rating:</strong></p>
                <StarRating 
                  rating={store.averageRating || 0} 
                  readOnly={true} 
                />
                <small>({store.ratingCount || 0} ratings)</small>
              </div>
              
              {isAuthenticated && user.role === 'user' && (
                <div style={{ margin: '1rem 0' }}>
                  <p><strong>Your Rating:</strong></p>
                  {submittingRating === store.id ? (
                    <p>Submitting...</p>
                  ) : (
                    <StarRating 
                      rating={store.userRating || 0} 
                      onRatingChange={(rating) => handleRatingChange(store.id, rating)} 
                    />
                  )}
                </div>
              )}
              
              <Link to={`/stores/${store.id}`} className="btn" style={{ marginTop: '1rem' }}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreList; 