/**
 * Central Services Index
 * Export all service wrappers for easy imports throughout the application
 */

export { authService } from './authService';
export { employeeService } from './employeeService';
export { attendanceService } from './attendanceService';
export { leaveService } from './leaveService';
export { policyService } from './policyService';
export { analyticsService } from './analyticsService';

// Keep complaintService if it exists
export { default as complaintService } from './complaintService';
