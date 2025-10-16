/**
 * Central Hooks Index
 * Export all custom hooks for easy imports throughout the application
 */

// Authentication hooks
export { useAuth } from './useAuth';

// Toast notifications
export { useToast, ToastProvider } from './useToast.jsx';

// Employee hooks
export {
  useMyProfile,
  useEmployees,
  useEmployee,
  useEmployeeActions,
  useEmployeeStats,
  useDepartments,
} from './useEmployee';

// Attendance hooks
export {
  useAttendance,
  useAttendanceRecords,
  useTodaySummary,
  useMonthlyReport,
} from './useAttendance';

// Leave hooks
export {
  useLeaveApplication,
  useMyLeaves,
  useLeaveBalance,
  useAllLeaves,
  usePendingLeaves,
  useLeaveActions,
  useLeave,
} from './useLeave';

// Policy hooks
export {
  useActiveLeavePolicy,
  useActiveAttendancePolicy,
  usePolicies,
  usePolicy,
  usePolicyActions,
} from './usePolicy';
