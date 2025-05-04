import React, { useState, useEffect } from 'react';
import { getStoreOwnerData } from '../utils/api';
import StarRating from '../components/StarRating';

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stores: [],
    ratingUsers: [],
    overallAverageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getStoreOwnerData();
        if (res.data.success) {
          setDashboardData(res.data.data);
        }
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Group ratings by store
  const ratingsByStore = dashboardData.ratingUsers.reduce((acc, rating) => {
    if (!acc[rating.storeId]) {
      acc[rating.storeId] = [];
    }
    acc[rating.storeId].push(rating);
    return acc;
  }, {});

  return (
    <div className="container">
      <h1>Store Owner Dashboard</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        <h3>Your Overall Rating</h3>
        <div className="flex items-center">
          <StarRating rating={dashboardData.overallAverageRating} readOnly={true} />
          <span style={{ marginLeft: '1rem' }}>
            {dashboardData.overallAverageRating.toFixed(1)} / 5.0
          </span>
        </div>
      </div>
      
      <h2 style={{ marginTop: '2rem' }}>Your Stores</h2>
      
      {dashboardData.stores.length === 0 ? (
        <div className="card">
          <p>You don't have any stores assigned to you yet.</p>
        </div>
      ) : (
        dashboardData.stores.map(store => (
          <div className="card" key={store.id} style={{ marginBottom: '1rem' }}>
            <h3>{store.name}</h3>
            <p><strong>Email:</strong> {store.email}</p>
            <p><strong>Address:</strong> {store.address}</p>
            
            <div style={{ marginTop: '1rem' }}>
              <h4>Store Rating</h4>
              <div className="flex items-center">
                <StarRating rating={parseFloat(store.averageRating) || 0} readOnly={true} />
                <span style={{ marginLeft: '1rem' }}>
                  {store.averageRating 
                    ? `${parseFloat(store.averageRating).toFixed(1)} / 5.0 (${store.ratingCount} ratings)` 
                    : 'No ratings yet'}
                </span>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <h4>Recent Ratings</h4>
              {!ratingsByStore[store.id] || ratingsByStore[store.id].length === 0 ? (
                <p>No ratings submitted yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Rating</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ratingsByStore[store.id].map(rating => (
                        <tr key={rating.id}>
                          <td>{rating.User.name}</td>
                          <td>{rating.User.email}</td>
                          <td>
                            <StarRating rating={rating.rating} readOnly={true} size="sm" />
                          </td>
                          <td>{new Date(rating.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StoreOwnerDashboard; 