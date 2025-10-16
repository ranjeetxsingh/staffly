/**
 * Custom Hooks for Employee Management
 * Provides easy-to-use hooks for employee operations in React components
 */

import { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/employeeService';

/**
 * Hook for current user's profile
 */
export const useMyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeService.getMyProfile();
      // Response structure: { success: true, data: employee }
      setProfile(response?.data || response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeService.updateMyProfile(profileData);
      // Response structure: { success: true, data: employee }
      setProfile(response?.data || response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
};

/**
 * Hook for HR/Admin - All employees
 */
export const useEmployees = (params = {}) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchEmployees = useCallback(async (fetchParams = params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeService.getEmployees(fetchParams);
      // Response structure: { success: true, data: { employees: [...], pagination: {...} } }
      const employeesData = response?.data?.employees || response?.employees || [];
      setEmployees(employeesData);
      setPagination(response?.data?.pagination || response?.pagination || null);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch employees');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (params.autoFetch !== false) {
      fetchEmployees(params);
    }
  }, [params.page, params.department, params.status, params.search]);

  return {
    employees,
    pagination,
    loading,
    error,
    refetch: fetchEmployees,
  };
};

/**
 * Hook for single employee details
 */
export const useEmployee = (employeeId) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployee = useCallback(async () => {
    if (!employeeId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await employeeService.getEmployeeById(employeeId);
      // Response structure: { success: true, data: employee }
      setEmployee(response?.data || response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch employee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchEmployee();
  }, [employeeId]);

  return {
    employee,
    loading,
    error,
    refetch: fetchEmployee,
  };
};

/**
 * Hook for employee CRUD operations
 */
export const useEmployeeActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addEmployee = useCallback(async (employeeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeService.addEmployee(employeeData);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to add employee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEmployee = useCallback(async (employeeId, employeeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeService.updateEmployee(employeeId, employeeData);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update employee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmployee = useCallback(async (employeeId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeService.deleteEmployee(employeeId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete employee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    addEmployee,
    updateEmployee,
    deleteEmployee,
    loading,
    error,
  };
};

/**
 * Hook for employee statistics
 */
export const useEmployeeStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeService.getStats();
      // Response structure: { success: true, data: { overview: {...}, departmentBreakdown: [...], roleBreakdown: [...] } }
      setStats(response?.data || response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch employee statistics');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

/**
 * Hook for departments
 */
export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeService.getDepartments();
      // Response structure: { success: true, data: [...] }
      setDepartments(response?.data || response || []);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch departments');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartments,
  };
};
