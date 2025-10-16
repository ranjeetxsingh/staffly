/**
 * Attendance Service
 * Handles all attendance-related API calls and data processing
 */

import axios from '../utils/axios';

export const attendanceService = {
  /**
   * Check in
   */
  checkIn: async () => {
    try {
      const response = await axios.post('/api/attendance/check-in');
      return response;
    } catch (error) {
      console.error('Error during check-in:', error);
      throw error;
    }
  },

  /**
   * Check out
   */
  checkOut: async () => {
    try {
      const response = await axios.post('/api/attendance/check-out');
      return response;
    } catch (error) {
      console.error('Error during check-out:', error);
      throw error;
    }
  },

  /**
   * Get my attendance records
   */
  getMyAttendance: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.month) queryParams.append('month', params.month);
      if (params.year) queryParams.append('year', params.year);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const response = await axios.get(`/api/attendance/my-attendance?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  },

  /**
   * Get attendance by employee (HR/Admin)
   */
  getByEmployee: async (employeeId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.month) queryParams.append('month', params.month);
      if (params.year) queryParams.append('year', params.year);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const response = await axios.get(
        `/api/attendance/employee/${employeeId}?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching employee attendance:', error);
      throw error;
    }
  },

  /**
   * Get all attendance (HR/Admin)
   */
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.month) queryParams.append('month', params.month);
      if (params.year) queryParams.append('year', params.year);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      
      const response = await axios.get(`/api/attendance/all?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching all attendance:', error);
      throw error;
    }
  },

  /**
   * Get today's summary (HR/Admin)
   */
  getTodaySummary: async () => {
    try {
      const response = await axios.get('/api/attendance/today-summary');
      return response;
    } catch (error) {
      console.error('Error fetching today\'s summary:', error);
      throw error;
    }
  },

  /**
   * Get monthly report (HR/Admin)
   */
  getMonthlyReport: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.month) queryParams.append('month', params.month);
      if (params.year) queryParams.append('year', params.year);
      if (params.department) queryParams.append('department', params.department);
      
      const response = await axios.get(`/api/attendance/monthly-report?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching monthly report:', error);
      throw error;
    }
  },

  /**
   * Update attendance status (HR/Admin)
   */
  updateStatus: async (attendanceId, data) => {
    try {
      const response = await axios.put(`/api/attendance/${attendanceId}/status`, data);
      return response;
    } catch (error) {
      console.error('Error updating attendance status:', error);
      throw error;
    }
  },

  /**
   * Get attendance statistics
   */
  getStats: async (params = {}) => {
    try {
      const currentMonth = params.month || new Date().getMonth() + 1;
      const currentYear = params.year || new Date().getFullYear();
      
      const response = await attendanceService.getMyAttendance({ month: currentMonth, year: currentYear });
      return response;
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      throw error;
    }
  },
};
