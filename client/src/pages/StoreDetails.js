import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStoreById, submitRating } from '../utils/api';
import AuthContext from '../context/AuthContext';
import StarRating from '../components/StarRating';

const StoreDetails = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  
  const { isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await getStoreById(id);
        if (res.data.success) {
          setStore(res.data.store);
        }
      } catch (err) {
        setError('Failed to load store details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [id]);

  const handleRatingChange = async (rating) => {
    if (!isAuthenticated || user.role !== 'user') {
      return;
    }

    setSubmittingRating(true);
    try {
      const res = await submitRating({ storeId: id, rating });
      if (res.data.success) {
        // Update the store's rating in the UI
        setStore(prevStore => ({
          ...prevStore,
          userRating: rating
        }));
      }
    } catch (err) {
      setError('Failed to submit rating. Please try again.');
      console.error(err);
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading store details...</p>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          {error || 'Store not found'}
        </div>
        <Link to="/stores" className="btn">Back to Stores</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>{store.name}</h1>
        
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3>Store Information</h3>
            <p><strong>Email:</strong> {store.email}</p>
            <p><strong>Address:</strong> {store.address}</p>
            
            <div style={{ marginTop: '2rem' }}>
              <h3>Overall Rating</h3>
              <div className="flex items-center">
                <StarRating rating={store.averageRating || 0} readOnly={true} />
                <span style={{ marginLeft: '1rem' }}>
                  {store.averageRating 
                    ? `${parseFloat(store.averageRating).toFixed(1)} / 5.0 (${store.ratingCount} ratings)` 
                    : 'No ratings yet'}
                </span>
              </div>
            </div>
          </div>
          
          {isAuthenticated && user.role === 'user' && (
            <div>
              <div className="card">
                <h3>Your Rating</h3>
                {submittingRating ? (
                  <p>Submitting your rating...</p>
                ) : (
                  <div>
                    <StarRating 
                      rating={store.userRating || 0} 
                      onRatingChange={handleRatingChange} 
                    />
                    <p style={{ marginTop: '0.5rem' }}>
                      {store.userRating 
                        ? 'Click on the stars to modify your rating' 
                        : 'Click on the stars to rate this store'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <Link to="/stores" className="btn">Back to Stores</Link>
        </div>
      </div>
    </div>
  );
};

export default StoreDetails; 