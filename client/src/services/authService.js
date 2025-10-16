/**
 * Auth Service
 * Handles all authentication-related API calls and local storage management
 */

import axios from '../utils/axios';

export const authService = {
  /**
   * Register new user
   */
  register: async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      
      // Store token if provided
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      
      // Store token and user data
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  /**
   * Google OAuth login
   */
  googleLogin: async (code) => {
    try {
      const response = await axios.get(`/api/auth/oauth?code=${code}`);
      
      // Store token and user data
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Error during Google Login:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      const response = await axios.post('/api/auth/logout');
      
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      return response;
    } catch (error) {
      // Clear local storage even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      console.error('Error during logout:', error);
      throw error;
    }
  },

  /**
   * Get current user from API
   */
  getCurrentUser: async () => {
    try {
      const response = await axios.get('/api/auth/me');
      
      // Update stored user data
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  /**
   * Change password
   */
  changePassword: async (passwordData) => {
    try {
      const response = await axios.post('/api/auth/change-password', passwordData);
      return response;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  /**
   * Update profile
   */
  updateProfile: async (profileData) => {
    try {
      const response = await axios.post('/api/auth/update-profile', profileData);
      
      // Update stored user data
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Delete user account
   */
  deleteAccount: async () => {
    try {
      const response = await axios.post('/api/auth/delete-account');
      
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      return response;
    } catch (error) {
      console.error('Error during account deletion:', error);
      throw error;
    }
  },

  /**
   * Get users for leaderboard
   */
  getUserForLeaderboard: async () => {
    try {
      const response = await axios.get('/api/auth/userForLeaderBoard');
      return response;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get auth token
   */
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },
};


