import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../services/authService";
import { login as loginAction, logout as logoutAction, updateUserProfile } from "../store/authSlice";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const token = useSelector((state) => state.auth?.token);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  // Login with email and password
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      
      // Dispatch Redux action to update global state
      dispatch(loginAction({
        user: response.user,
        token: response.token,
      }));
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Register new user
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      
      // Dispatch Redux action to update global state
      if (response.token && response.user) {
        dispatch(loginAction({
          user: response.user,
          token: response.token,
        }));
      }
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Google OAuth login
  const loginWithGoogle = useCallback(async (code) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.googleLogin(code);
      
      // Dispatch Redux action to update global state
      dispatch(loginAction({
        user: response.user,
        token: response.token,
      }));
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Google login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Logout user
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
      
      // Dispatch Redux action to clear global state
      dispatch(logoutAction());
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Logout failed";
      setError(errorMessage);
      // Still logout from Redux even if API fails
      dispatch(logoutAction());
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.updateProfile(profileData);
      
      // Dispatch Redux action to update user profile in global state
      if (response.user) {
        dispatch(updateUserProfile(response.user));
      }
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Update failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.changePassword({
        currentPassword,
        newPassword,
      });
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Password change failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get current user
  const getCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getCurrentUser();
      
      // Update Redux state with fresh user data
      if (response.user) {
        dispatch(updateUserProfile(response.user));
      }
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch user";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Delete account
  const deleteAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.deleteAccount();
      
      // Logout after account deletion
      dispatch(logoutAction());
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete account";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Get stored user from localStorage
  const getStoredUser = useCallback(() => {
    return authService.getStoredUser();
  }, []);

  return {
    // State
    user,
    token,
    loading,
    error,
    isAuthenticated,
    
    // Methods
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile,
    changePassword,
    getCurrentUser,
    deleteAccount,
    getStoredUser,
  };
};
