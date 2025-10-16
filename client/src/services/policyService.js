/**
 * Policy Service
 * Handles all policy-related API calls and data processing
 */

import axios from '../utils/axios';

export const policyService = {
  /**
   * Get active leave policy
   */
  getActiveLeavePolicy: async () => {
    try {
      const response = await axios.get('/api/policies/leave/active');
      return response;
    } catch (error) {
      console.error('Error fetching active leave policy:', error);
      throw error;
    }
  },

  /**
   * Get active attendance policy
   */
  getActiveAttendancePolicy: async () => {
    try {
      const response = await axios.get('/api/policies/attendance/active');
      return response;
    } catch (error) {
      console.error('Error fetching active attendance policy:', error);
      throw error;
    }
  },

  /**
   * Get all policies (HR/Admin)
   */
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.category) queryParams.append('category', params.category);
      if (params.status) queryParams.append('status', params.status);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const response = await axios.get(`/api/policies?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching policies:', error);
      throw error;
    }
  },

  /**
   * Get policy by ID (HR/Admin)
   */
  getById: async (policyId) => {
    try {
      const response = await axios.get(`/api/policies/${policyId}`);
      return response;
    } catch (error) {
      console.error('Error fetching policy:', error);
      throw error;
    }
  },

  /**
   * Create new policy (HR/Admin)
   */
  create: async (policyData) => {
    try {
      const response = await axios.post('/api/policies', policyData);
      return response;
    } catch (error) {
      console.error('Error creating policy:', error);
      throw error;
    }
  },

  /**
   * Update policy (HR/Admin)
   */
  update: async (policyId, policyData) => {
    try {
      const response = await axios.put(`/api/policies/${policyId}`, policyData);
      return response;
    } catch (error) {
      console.error('Error updating policy:', error);
      throw error;
    }
  },

  /**
   * Update leave type quota (HR/Admin)
   */
  updateLeaveTypeQuota: async (policyId, leaveTypeData) => {
    try {
      const response = await axios.put(`/api/policies/${policyId}/leave-type`, leaveTypeData);
      return response;
    } catch (error) {
      console.error('Error updating leave type quota:', error);
      throw error;
    }
  },

  /**
   * Deactivate policy (HR/Admin)
   */
  deactivate: async (policyId) => {
    try {
      const response = await axios.put(`/api/policies/${policyId}/deactivate`);
      return response;
    } catch (error) {
      console.error('Error deactivating policy:', error);
      throw error;
    }
  },

  /**
   * Apply policy to employees (HR/Admin)
   */
  applyToEmployees: async (policyId, data) => {
    try {
      const response = await axios.post(`/api/policies/${policyId}/apply-to-employees`, data);
      return response;
    } catch (error) {
      console.error('Error applying policy to employees:', error);
      throw error;
    }
  },

  /**
   * Delete policy (HR/Admin)
   */
  delete: async (policyId) => {
    try {
      const response = await axios.delete(`/api/policies/${policyId}`);
      return response;
    } catch (error) {
      console.error('Error deleting policy:', error);
      throw error;
    }
  },

  /**
   * Get leave policy summary
   */
  getLeavePolicySummary: async () => {
    try {
      const response = await policyService.getActiveLeavePolicy();
      
      // Transform to employee-friendly format
      const summary = {
        policyTitle: response.data?.title,
        leaveTypes: response.data?.leaveTypes?.map(lt => ({
          type: lt.leaveType,
          quota: lt.annualQuota,
          canCarryForward: lt.carryForward,
          maxCarryForward: lt.maxCarryForward,
          description: lt.description,
        })) || [],
      };
      
      return summary;
    } catch (error) {
      console.error('Error fetching leave policy summary:', error);
      throw error;
    }
  },

  /**
   * Get attendance policy rules
   */
  getAttendancePolicyRules: async () => {
    try {
      const response = await policyService.getActiveAttendancePolicy();
      
      return {
        policyTitle: response.data?.title,
        rules: response.data?.attendanceRules || {},
        effectiveFrom: response.data?.effectiveFrom,
      };
    } catch (error) {
      console.error('Error fetching attendance policy rules:', error);
      throw error;
    }
  },
};
