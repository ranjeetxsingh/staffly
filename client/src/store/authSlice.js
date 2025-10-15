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
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
    eventParticapted: (state, action) => {
      const { eventId } = action.payload;
      state.user.participatedEvents.push(eventId);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    updateUserProfile: (state, action) => {
      state.user.profile = {
        ...state.user.profile,
        ...action.payload,
      };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  }
});

export const { login, logout, eventParticapted, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
