import axios from '../utils/axios';
// import axios from 'axios';
export const googleAuth = async (token) => {
  try {
    const response = await axios.get(`/api/auth/oauth?code=${token}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post('/api/auth/login', credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post('/api/auth/register', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axios.post('/api/auth/logout');
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = async () => {  
  try {
    const response = await axios.post('/api/auth/delete-account');
    return response;
  } catch (error) {
    throw error;

  }
}
export const changePassword = async (passwordData) => {
  try {
    const response = await axios.post('/api/auth/change-password', passwordData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const profileUpdate = async (profileData) => {
  try {
    console.log("Profile Data:", profileData);
    
    const response = await axios.post('/api/auth/update-profile', profileData);
    return response;
  } catch (error) {
    throw error;
  }
}