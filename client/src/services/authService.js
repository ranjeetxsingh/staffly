import { useDispatch } from 'react-redux';
import { googleAuth, register, login, logout, deleteAccount, profileUpdate } from '../API/authAPI';
import axios from 'axios';


export const authService = {
  login: async (credentials) => {
    const response = await login(credentials);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await register(userData);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  googleLogin: async (code) => {
    try {
      const response = await googleAuth(code);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error during Google Login:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await logout();
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },
  deleteAccont: async () => {
    try {
      const response = await deleteAccount();
      return response;
    } catch (error) {
      console.log('Error during account deletion:', error);
      throw error;
    }
  },
  changePassword: async (passwordData) => {
      const response = await axios.post('/api/auth/change-password', passwordData);
      return response;
  },
  profileUpdate: async (profileData) => {
      const response = await profileUpdate(profileData);
      return response;
  },

};

