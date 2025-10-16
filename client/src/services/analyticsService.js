/**
 * Analytics Service
 * Handles all analytics and reporting API calls
 */

import axios from '../utils/axios';

export const analyticsService = {
  /**
   * Get time spent analytics
   */
  getTimeSpent: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.employeeId) queryParams.append('employeeId', params.employeeId);
      if (params.department) queryParams.append('department', params.department);
      
      const response = await axios.get(`/api/analytics/time-spent?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching time spent analytics:', error);
      throw error;
    }
  },

  /**
   * Get peak hours analytics
   */
  getPeakHours: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.department) queryParams.append('department', params.department);
      
      const response = await axios.get(`/api/analytics/peak-hours?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching peak hours analytics:', error);
      throw error;
    }
  },

  /**
   * Get dashboard analytics
   */
  getDashboardAnalytics: async (params = {}) => {
    try {
      // Fetch multiple analytics endpoints in parallel
      const [timeSpentData, peakHoursData] = await Promise.all([
        analyticsService.getTimeSpent(params),
        analyticsService.getPeakHours(params),
      ]);
      
      return {
        timeSpent: timeSpentData.data,
        peakHours: peakHoursData.data,
      };
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  },

  /**
   * Get employee productivity analytics
   */
  getEmployeeProductivity: async (employeeId, params = {}) => {
    try {
      const timeSpentData = await analyticsService.getTimeSpent({ ...params, employeeId });
      return timeSpentData;
    } catch (error) {
      console.error('Error fetching employee productivity:', error);
      throw error;
    }
  },

  /**
   * Get department analytics
   */
  getDepartmentAnalytics: async (department, params = {}) => {
    try {
      const [timeSpentData, peakHoursData] = await Promise.all([
        analyticsService.getTimeSpent({ ...params, department }),
        analyticsService.getPeakHours({ ...params, department }),
      ]);
      
      return {
        timeSpent: timeSpentData.data,
        peakHours: peakHoursData.data,
        department,
      };
    } catch (error) {
      console.error('Error fetching department analytics:', error);
      throw error;
    }
  },
};
