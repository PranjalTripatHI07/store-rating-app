import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllStores, deleteStore } from '../utils/api';

const AdminStoreList = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [deleteInProgress, setDeleteInProgress] = useState(null);

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
    let result = [...stores];
    
    if (filters.name) {
      result = result.filter(store => 
        store.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    if (filters.email) {
      result = result.filter(store => 
        store.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    
    if (filters.address) {
      result = result.filter(store => 
        store.address.toLowerCase().includes(filters.address.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      // Special case for averageRating which might be null
      if (sortConfig.key === 'averageRating') {
        const ratingA = parseFloat(a.averageRating) || 0;
        const ratingB = parseFloat(b.averageRating) || 0;
        return sortConfig.direction === 'asc' 
          ? ratingA - ratingB 
          : ratingB - ratingA;
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredStores(result);
  }, [filters, stores, sortConfig]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: 
        sortConfig.key === key && sortConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      setDeleteInProgress(id);
      try {
        const res = await deleteStore(id);
        if (res.data.success) {
          setStores(stores.filter(store => store.id !== id));
        }
      } catch (err) {
        setError('Failed to delete store. Please try again.');
        console.error(err);
      } finally {
        setDeleteInProgress(null);
      }
    }
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
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
      <h1>Store Management</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        <h3>Filter Stores</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Filter by name..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              className="form-control"
              value={filters.email}
              onChange={handleFilterChange}
              placeholder="Filter by email..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="address" className="form-label">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-control"
              value={filters.address}
              onChange={handleFilterChange}
              placeholder="Filter by address..."
            />
          </div>
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <Link to="/admin/stores/new" className="btn">Add New Store</Link>
        </div>
        
        {filteredStores.length === 0 ? (
          <p>No stores found matching your search criteria.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    Name{getSortIndicator('name')}
                  </th>
                  <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                    Email{getSortIndicator('email')}
                  </th>
                  <th onClick={() => handleSort('address')} style={{ cursor: 'pointer' }}>
                    Address{getSortIndicator('address')}
                  </th>
                  <th onClick={() => handleSort('averageRating')} style={{ cursor: 'pointer' }}>
                    Rating{getSortIndicator('averageRating')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map(store => (
                  <tr key={store.id}>
                    <td>{store.name}</td>
                    <td>{store.email}</td>
                    <td>{store.address}</td>
                    <td>
                      {store.averageRating 
                        ? `${parseFloat(store.averageRating).toFixed(1)} / 5.0 (${store.ratingCount} ratings)` 
                        : 'No ratings yet'}
                    </td>
                    <td>
                      <div className="flex" style={{ gap: '0.5rem' }}>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(store.id)}
                          disabled={deleteInProgress === store.id}
                        >
                          {deleteInProgress === store.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStoreList; 