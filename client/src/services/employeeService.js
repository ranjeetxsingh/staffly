/**
 * Employee Service
 * Handles all employee-related API calls and data processing
 */

import axios from '../utils/axios';

export const employeeService = {
  /**
   * Get current user's profile
   */
  getMyProfile: async () => {
    try {
      const response = await axios.get('/api/employees/me');
      return response;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  /**
   * Update current user's profile
   */
  updateMyProfile: async (profileData) => {
    try {
      const response = await axios.put('/api/employees/me', profileData);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Get all employees (HR/Admin)
   */
  getEmployees: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.department) queryParams.append('department', params.department);
      if (params.designation) queryParams.append('designation', params.designation);
      if (params.status) queryParams.append('status', params.status);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const response = await axios.get(`/api/employees?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  /**
   * Get employee by ID (HR/Admin)
   */
  getEmployeeById: async (employeeId) => {
    try {
      const response = await axios.get(`/api/employees/${employeeId}`);
      return response;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  },

  /**
   * Add new employee (HR/Admin)
   */
  addEmployee: async (employeeData) => {
    try {
      const response = await axios.post('/api/employees', employeeData);
      return response;
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  },

  /**
   * Update employee (HR/Admin)
   */
  updateEmployee: async (employeeId, employeeData) => {
    try {
      const response = await axios.put(`/api/employees/${employeeId}`, employeeData);
      return response;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  /**
   * Delete employee (HR/Admin)
   */
  deleteEmployee: async (employeeId) => {
    try {
      const response = await axios.delete(`/api/employees/${employeeId}`);
      return response;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  },

  /**
   * Get employee statistics (HR/Admin)
   */
  getStats: async () => {
    try {
      const response = await axios.get('/api/employees/stats/overview');
      return response;
    } catch (error) {
      console.error('Error fetching employee stats:', error);
      throw error;
    }
  },

  /**
   * Get departments list (HR/Admin)
   */
  getDepartments: async () => {
    try {
      const response = await axios.get('/api/employees/departments/list');
      return response;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  /**
   * Get employees by department (HR/Admin)
   */
  getByDepartment: async (department, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const response = await axios.get(
        `/api/employees/department/${department}?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching employees by department:', error);
      throw error;
    }
  },

  /**
   * Reinitialize leave balances (HR/Admin)
   */
  reinitializeLeaves: async (employeeId, data = {}) => {
    try {
      const response = await axios.post(`/api/employees/${employeeId}/initialize-leaves`, data);
      return response;
    } catch (error) {
      console.error('Error reinitializing leave balances:', error);
      throw error;
    }
  },

  /**
   * Update leave balance (HR/Admin)
   */
  updateLeaveBalance: async (employeeId, leaveBalanceData) => {
    try {
      const response = await axios.put(`/api/employees/${employeeId}/leave-balance`, leaveBalanceData);
      return response;
    } catch (error) {
      console.error('Error updating leave balance:', error);
      throw error;
    }
  },

  /**
   * Upload employee profile picture
   */
  uploadProfilePicture: async (employeeId, file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await axios.post(`/api/employees/${employeeId}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  },

  /**
   * Export employees data to CSV (HR/Admin)
   */
  exportEmployees: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.department) queryParams.append('department', params.department);
      if (params.status) queryParams.append('status', params.status);
      
      const response = await axios.get(`/api/employees/export?${queryParams.toString()}`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      console.error('Error exporting employees:', error);
      throw error;
    }
  },
};
