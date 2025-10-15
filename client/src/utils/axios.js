import axios from 'axios';

const instance = axios.create({
  // baseURL: import.meta.env.VITE_SERVER_URL,
  baseURL: 'http://localhost:8080',
  withCredentials: true, // Important for sending cookies
});

export default instance;
