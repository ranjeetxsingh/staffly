/**
 * Leave Service
 * Handles all leave-related API calls and data processing
 */

import axios from '../utils/axios';

export const leaveService = {
  /**
   * Apply for leave
   */
  applyLeave: async (leaveData) => {
    try {
      const response = await axios.post('/api/leaves/apply', leaveData);
      return response;
    } catch (error) {
      console.error('Error applying for leave:', error);
      throw error;
    }
  },

  /**
   * Get my leave applications
   */
  getMyLeaves: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.status) queryParams.append('status', params.status);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.year) queryParams.append('year', params.year);
      
      const response = await axios.get(`/api/leaves/my-leaves?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching leaves:', error);
      throw error;
    }
  },

  /**
   * Get leave balance
   */
  getBalance: async () => {
    try {
      const response = await axios.get('/api/leaves/balance');
      return response;
    } catch (error) {
      console.error('Error fetching leave balance:', error);
      throw error;
    }
  },

  /**
   * Get all leave applications (HR/Admin)
   */
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.status) queryParams.append('status', params.status);
      if (params.department) queryParams.append('department', params.department);
      if (params.leaveType) queryParams.append('leaveType', params.leaveType);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const response = await axios.get(`/api/leaves/all?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching all leaves:', error);
      throw error;
    }
  },

  /**
   * Get pending leave applications (HR/Admin)
   */
  getPending: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const response = await axios.get(`/api/leaves/pending?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching pending leaves:', error);
      throw error;
    }
  },

  /**
   * Approve leave (HR/Admin)
   */
  approve: async (leaveId, data = {}) => {
    try {
      const response = await axios.put(`/api/leaves/${leaveId}/approve`, data);
      return response;
    } catch (error) {
      console.error('Error approving leave:', error);
      throw error;
    }
  },

  /**
   * Reject leave (HR/Admin)
   */
  reject: async (leaveId, data) => {
    try {
      const response = await axios.put(`/api/leaves/${leaveId}/reject`, data);
      return response;
    } catch (error) {
      console.error('Error rejecting leave:', error);
      throw error;
    }
  },

  /**
   * Cancel leave
   */
  cancel: async (leaveId) => {
    try {
      const response = await axios.delete(`/api/leaves/${leaveId}/cancel`);
      return response;
    } catch (error) {
      console.error('Error cancelling leave:', error);
      throw error;
    }
  },

  /**
   * Add comment to leave
   */
  addComment: async (leaveId, data) => {
    try {
      const response = await axios.post(`/api/leaves/${leaveId}/comment`, data);
      return response;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  /**
   * Get leave statistics (HR/Admin)
   */
  getStatistics: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.department) queryParams.append('department', params.department);
      
      const response = await axios.get(`/api/leaves/statistics?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching leave statistics:', error);
      throw error;
    }
  },

  /**
   * Get leave types
   */
  getLeaveTypes: async () => {
    try {
      // This will be fetched from the active leave policy
      const response = await axios.get('/api/policies/leave/active');
      return response.data?.leaveTypes || [];
    } catch (error) {
      console.error('Error fetching leave types:', error);
      throw error;
    }
  },
};
