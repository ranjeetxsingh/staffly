/**
 * Custom Hooks for Attendance Management
 * Provides easy-to-use hooks for attendance operations in React components
 */

import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '../services/attendanceService';

/**
 * Hook for managing check-in/check-out
 */
export const useAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);

  const checkIn = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceService.checkIn();
      // Axios interceptor already returns response.data
      setTodayAttendance(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to check in');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceService.checkOut();
      // Axios interceptor already returns response.data
      setTodayAttendance(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to check out');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    checkIn,
    checkOut,
    todayAttendance,
    loading,
    error,
  };
};

/**
 * Hook for fetching attendance records
 */
export const useAttendanceRecords = (params = {}) => {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(async (fetchParams = params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceService.getMyAttendance(fetchParams);
      // Backend returns: { success: true, data: { records: [...], stats: {...} } }
      // After axios interceptor: we get the whole response
      const recordsData = response?.data?.records || response?.records || [];
      const statsData = response?.data?.stats || response?.stats || null;
      
      setRecords(recordsData);
      setStats(statsData);
      return recordsData;
    } catch (err) {
      setError(err.message || 'Failed to fetch attendance records');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (params.autoFetch !== false) {
      fetchRecords(params);
    }
  }, [params.month, params.year]);

  return {
    records,
    stats,
    loading,
    error,
    refetch: fetchRecords,
  };
};

/**
 * Hook for HR/Admin - Today's Summary
 */
export const useTodaySummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceService.getTodaySummary();
      // Backend returns: { success: true, data: { records: [...], present: ..., absent: ... } }
      // After axios interceptor: we get the whole response
      const summaryData = response?.data || response;
      setSummary(summaryData);
      return summaryData;
    } catch (err) {
      setError(err.message || 'Failed to fetch today\'s summary');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, []);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
  };
};

/**
 * Hook for HR/Admin - Monthly Report
 */
export const useMonthlyReport = (params = {}) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = useCallback(async (fetchParams = params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceService.getMonthlyReport(fetchParams);
      // Axios interceptor already returns response.data
      setReport(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch monthly report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport(params);
  }, [params.month, params.year, params.department]);

  return {
    report,
    loading,
    error,
    refetch: fetchReport,
  };
};
