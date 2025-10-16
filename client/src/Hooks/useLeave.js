/**
 * Custom Hooks for Leave Management
 * Provides easy-to-use hooks for leave operations in React components
 */

import { useState, useEffect, useCallback } from 'react';
import { leaveService } from '../services/leaveService';

/**
 * Hook for applying for leave
 */
export const useLeaveApplication = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const applyLeave = useCallback(async (leaveData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await leaveService.applyLeave(leaveData);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to apply for leave');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    applyLeave,
    loading,
    error,
    success,
  };
};

/**
 * Hook for fetching user's leaves
 */
export const useMyLeaves = (params = {}) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchLeaves = useCallback(async (fetchParams = params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaveService.getMyLeaves(fetchParams);
      // Backend returns: { success: true, data: [...] } - direct array
      // After axios interceptor: { success: true, data: [...] }
      const leavesArray = response?.data || [];
      setLeaves(Array.isArray(leavesArray) ? leavesArray : []);
      setPagination(response?.pagination || null);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch leaves');
      setLeaves([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (params.autoFetch !== false) {
      fetchLeaves(params);
    }
  }, [params.status, params.year]);

  return {
    leaves,
    pagination,
    loading,
    error,
    refetch: fetchLeaves,
  };
};

/**
 * Hook for fetching leave balance
 */
export const useLeaveBalance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaveService.getBalance();
      // Axios interceptor already returns response.data
      setBalance(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch leave balance');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, []);

  return {
    balance,
    loading,
    error,
    refetch: fetchBalance,
  };
};

/**
 * Hook for HR/Admin - All leaves
 */
export const useAllLeaves = (params = {}) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchLeaves = useCallback(async (fetchParams = params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaveService.getAll(fetchParams);
      // Backend returns: { success: true, data: { leaves: [...], pagination: {...} } }
      const leavesArray = response?.data?.leaves || response?.leaves || [];
      setLeaves(Array.isArray(leavesArray) ? leavesArray : []);
      setPagination(response?.data?.pagination || response?.pagination || null);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch all leaves');
      setLeaves([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves(params);
  }, [params.status, params.department, params.page]);

  return {
    leaves,
    pagination,
    loading,
    error,
    refetch: fetchLeaves,
  };
};

/**
 * Hook for HR/Admin - Pending leaves
 */
export const usePendingLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPendingLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaveService.getPending();
      // Backend returns: { success: true, data: [...] } - direct array
      const leavesArray = response?.data || [];
      setLeaves(Array.isArray(leavesArray) ? leavesArray : []);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch pending leaves');
      setLeaves([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  return {
    leaves,
    loading,
    error,
    refetch: fetchPendingLeaves,
  };
};

/**
 * Hook for leave actions (approve/reject/cancel)
 */
export const useLeaveActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const approve = useCallback(async (leaveId, data = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaveService.approve(leaveId, data);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to approve leave');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reject = useCallback(async (leaveId, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaveService.reject(leaveId, data);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to reject leave');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(async (leaveId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaveService.cancel(leaveId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to cancel leave');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    approve,
    reject,
    cancel,
    loading,
    error,
  };
};

/**
 * Comprehensive Leave Hook - combines all leave operations
 */
export const useLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const response = await leaveService.getMyLeaves();
      // Backend returns: { success: true, data: [...] } - direct array
      const leavesArray = response?.data || [];
      setLeaves(Array.isArray(leavesArray) ? leavesArray : []);
      return response;
    } catch (err) {
      setError(err.message);
      setLeaves([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPendingLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const response = await leaveService.getPending();
      // Backend returns: { success: true, data: [...] } - direct array
      const leavesArray = response?.data || [];
      setLeaves(Array.isArray(leavesArray) ? leavesArray : []);
      return response;
    } catch (err) {
      setError(err.message);
      setLeaves([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const response = await leaveService.getAll();
      // Backend returns: { success: true, data: { leaves: [...], pagination: {...} } }
      const leavesArray = response?.data?.leaves || response?.leaves || [];
      setLeaves(Array.isArray(leavesArray) ? leavesArray : []);
      return response;
    } catch (err) {
      setError(err.message);
      setLeaves([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const applyLeave = useCallback(async (leaveData) => {
    setLoading(true);
    try {
      const response = await leaveService.applyLeave(leaveData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveLeave = useCallback(async (leaveId, data) => {
    setLoading(true);
    try {
      const response = await leaveService.approve(leaveId, data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectLeave = useCallback(async (leaveId, data) => {
    setLoading(true);
    try {
      const response = await leaveService.reject(leaveId, data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    leaves,
    loading,
    error,
    fetchMyLeaves,
    fetchPendingLeaves,
    fetchAllLeaves,
    applyLeave,
    approveLeave,
    rejectLeave,
  };
};
