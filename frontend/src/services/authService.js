import apiClient from './api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Response with token and user info
 */
export const registerUser = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

/**
 * Login a user
 * @param {Object} credentials - Username and password
 * @returns {Promise} - Response with token and user info
 */
export const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

/**
 * Logout - clear local storage
 */
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export default {
  registerUser,
  loginUser,
  logoutUser,
};