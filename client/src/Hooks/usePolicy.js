/**
 * Custom Hooks for Policy Management
 * Provides easy-to-use hooks for policy operations in React components
 */

import { useState, useEffect, useCallback } from 'react';
import { policyService } from '../services/policyService';

/**
 * Hook for active leave policy
 */
export const useActiveLeavePolicy = () => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPolicy = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await policyService.getActiveLeavePolicy();
      // Axios interceptor already returns response.data
      setPolicy(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch active leave policy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicy();
  }, []);

  return {
    policy,
    loading,
    error,
    refetch: fetchPolicy,
  };
};

/**
 * Hook for active attendance policy
 */
export const useActiveAttendancePolicy = () => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPolicy = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await policyService.getActiveAttendancePolicy();
      // Axios interceptor already returns response.data
      setPolicy(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch active attendance policy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicy();
  }, []);

  return {
    policy,
    loading,
    error,
    refetch: fetchPolicy,
  };
};

/**
 * Hook for all policies (HR/Admin)
 */
export const usePolicies = (params = {}) => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchPolicies = useCallback(async (fetchParams = params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await policyService.getAll(fetchParams);
      // Axios interceptor already returns response.data
      setPolicies(response.policies || response || []);
      setPagination(response.pagination || null);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch policies');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (params.autoFetch !== false) {
      fetchPolicies(params);
    }
  }, [params.category, params.status]);

  return {
    policies,
    pagination,
    loading,
    error,
    refetch: fetchPolicies,
  };
};

/**
 * Hook for single policy details
 */
export const usePolicy = (policyId) => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPolicy = useCallback(async () => {
    if (!policyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await policyService.getById(policyId);
      // Axios interceptor already returns response.data
      setPolicy(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch policy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [policyId]);

  useEffect(() => {
    fetchPolicy();
  }, [policyId]);

  return {
    policy,
    loading,
    error,
    refetch: fetchPolicy,
  };
};

/**
 * Hook for policy CRUD operations
 */
export const usePolicyActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPolicy = useCallback(async (policyData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await policyService.create(policyData);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create policy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePolicy = useCallback(async (policyId, policyData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await policyService.update(policyId, policyData);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update policy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePolicy = useCallback(async (policyId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await policyService.delete(policyId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete policy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivatePolicy = useCallback(async (policyId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await policyService.deactivate(policyId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to deactivate policy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLeaveTypeQuota = useCallback(async (policyId, leaveTypeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await policyService.updateLeaveTypeQuota(policyId, leaveTypeData);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update leave type quota');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createPolicy,
    updatePolicy,
    deletePolicy,
    deactivatePolicy,
    updateLeaveTypeQuota,
    loading,
    error,
  };
};
