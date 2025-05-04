import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getProfile = () => api.get('/auth/profile');
export const updatePassword = (passwordData) => api.put('/auth/update-password', passwordData);

// User APIs (admin)
export const getAllUsers = (filters = {}) => api.get('/users', { params: filters });
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getDashboardData = () => api.get('/users/dashboard');

// Store APIs
export const getAllStores = (filters = {}) => api.get('/stores', { params: filters });
export const getStoreById = (id) => api.get(`/stores/${id}`);
export const createStore = (storeData) => api.post('/stores', storeData);
export const updateStore = (id, storeData) => api.put(`/stores/${id}`, storeData);
export const deleteStore = (id) => api.delete(`/stores/${id}`);
export const getStoreOwnerData = () => api.get('/stores/owner/dashboard');

// Rating APIs
export const submitRating = (ratingData) => api.post('/ratings', ratingData);
export const getUserRatingForStore = (storeId) => api.get(`/ratings/store/${storeId}`);
export const deleteRating = (id) => api.delete(`/ratings/${id}`);

export default api; 