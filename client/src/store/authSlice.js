import { createSlice } from '@reduxjs/toolkit';


const token = localStorage.getItem('authToken');
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const initialState = {
  isAuthenticated: !!token,
  user: user,
  token: token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Keep localStorage in sync
      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
    updateUserProfile: (state, action) => {
      // Support both full user object and partial profile updates
      if (action.payload.email) {
        // Full user object
        state.user = {
          ...state.user,
          ...action.payload,
        };
      } else {
        // Partial profile update
        state.user = {
          ...state.user,
          profile: {
            ...state.user?.profile,
            ...action.payload,
          },
        };
      }
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  }
});

export const { login, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
