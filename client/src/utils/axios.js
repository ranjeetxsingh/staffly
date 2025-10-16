import axios from 'axios';

// Create axios instance with default config
const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor - Add auth token to requests
instance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors globally
instance.interceptors.response.use(
  (response) => {
    // Return the response data directly
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        
        case 403:
          // Forbidden - access denied
          console.error('Access denied:', data.message);
          break;
        
        case 404:
          console.error('Resource not found:', data.message);
          break;
        
        case 422:
          // Validation error
          console.error('Validation error:', data.errors || data.message);
          break;
        
        case 500:
          console.error('Server error:', data.message);
          break;
        
        default:
          console.error('API Error:', data.message || 'Unknown error');
      }
      
      // Return standardized error object
      return Promise.reject({
        status,
        message: data.message || 'An error occurred',
        errors: data.errors,
        data: data,
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error - no response received');
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
      });
    } else {
      // Something else happened
      console.error('Request error:', error.message);
      return Promise.reject({
        status: -1,
        message: error.message || 'Request failed',
      });
    }
  }
);

export default instance;
