import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Public pages
import StoreList from './pages/StoreList';
import StoreDetails from './pages/StoreDetails';

// User pages
import Profile from './pages/Profile';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUserList from './pages/AdminUserList';
import AdminStoreList from './pages/AdminStoreList';
import AdminAddUser from './pages/AdminAddUser';
import AdminAddStore from './pages/AdminAddStore';

// Store Owner pages
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stores" element={<StoreList />} />
          <Route path="/stores/:id" element={<StoreDetails />} />
          <Route path="/" element={<Navigate to="/stores" />} />

          {/* Protected Routes - User */}
          <Route element={<PrivateRoute allowedRoles={['user']} />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Protected Routes - Admin */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserList />} />
            <Route path="/admin/stores" element={<AdminStoreList />} />
            <Route path="/admin/users/new" element={<AdminAddUser />} />
            <Route path="/admin/stores/new" element={<AdminAddStore />} />
          </Route>

          {/* Protected Routes - Store Owner */}
          <Route element={<PrivateRoute allowedRoles={['store_owner']} />}>
            <Route path="/owner/dashboard" element={<StoreOwnerDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 