import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../utils/api';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [deleteInProgress, setDeleteInProgress] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        if (res.data.success) {
          setUsers(res.data.users);
          setFilteredUsers(res.data.users);
        }
      } catch (err) {
        setError('Failed to load users. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...users];
    
    if (filters.name) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    if (filters.email) {
      result = result.filter(user => 
        user.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    
    if (filters.address) {
      result = result.filter(user => 
        user.address.toLowerCase().includes(filters.address.toLowerCase())
      );
    }
    
    if (filters.role) {
      result = result.filter(user => user.role === filters.role);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredUsers(result);
  }, [filters, users, sortConfig]);

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
    if (window.confirm('Are you sure you want to delete this user?')) {
      setDeleteInProgress(id);
      try {
        const res = await deleteUser(id);
        if (res.data.success) {
          setUsers(users.filter(user => user.id !== id));
        }
      } catch (err) {
        setError('Failed to delete user. Please try again.');
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

  const formatRole = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'store_owner':
        return 'Store Owner';
      case 'user':
        return 'Normal User';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>User Management</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        <h3>Filter Users</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
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
          <div className="form-group">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              name="role"
              className="form-control"
              value={filters.role}
              onChange={handleFilterChange}
            >
              <option value="">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="user">Normal User</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <Link to="/admin/users/new" className="btn">Add New User</Link>
        </div>
        
        {filteredUsers.length === 0 ? (
          <p>No users found matching your search criteria.</p>
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
                  <th onClick={() => handleSort('role')} style={{ cursor: 'pointer' }}>
                    Role{getSortIndicator('role')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>{formatRole(user.role)}</td>
                    <td>
                      <div className="flex" style={{ gap: '0.5rem' }}>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteInProgress === user.id}
                        >
                          {deleteInProgress === user.id ? 'Deleting...' : 'Delete'}
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

export default AdminUserList; 