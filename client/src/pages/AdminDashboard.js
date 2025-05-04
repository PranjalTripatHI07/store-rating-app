import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../utils/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getDashboardData();
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

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card text-center">
          <h3>Total Users</h3>
          <p className="dashboard-number">{dashboardData.totalUsers}</p>
          <Link to="/admin/users" className="btn">Manage Users</Link>
        </div>
        
        <div className="card text-center">
          <h3>Total Stores</h3>
          <p className="dashboard-number">{dashboardData.totalStores}</p>
          <Link to="/admin/stores" className="btn">Manage Stores</Link>
        </div>
        
        <div className="card text-center">
          <h3>Total Ratings</h3>
          <p className="dashboard-number">{dashboardData.totalRatings}</p>
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>Quick Actions</h2>
        <div className="flex" style={{ gap: '1rem', marginTop: '1rem' }}>
          <Link to="/admin/users/new" className="btn">Add New User</Link>
          <Link to="/admin/stores/new" className="btn">Add New Store</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 