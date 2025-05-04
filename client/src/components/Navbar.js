import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </>
      );
    }

    // Links based on user role
    const roleLinks = {
      admin: (
        <>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/stores">Stores</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
        </>
      ),
      user: (
        <>
          <li><Link to="/stores">Stores</Link></li>
        </>
      ),
      store_owner: (
        <>
          <li><Link to="/owner/dashboard">Dashboard</Link></li>
        </>
      )
    };

    return (
      <>
        {user && roleLinks[user.role]}
        <li><Link to="/profile">Profile</Link></li>
        <li><button onClick={handleLogout} className="btn btn-sm">Logout</button></li>
      </>
    );
  };

  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="navbar-brand">
          <Link to="/">Store Rating</Link>
        </h1>
        <ul className="navbar-nav">
          {renderLinks()}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 