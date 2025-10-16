# API Service Layer Documentation

## Overview

This document describes the complete API service layer architecture for the HRMS Staffly application. The service layer provides a clean, modular interface between the frontend and backend APIs.

## Architecture

```
client/src/
├── API/                    # Raw API calls using Axios
│   ├── index.js           # Central export for all API modules
│   ├── authAPI.js         # Authentication endpoints
│   ├── employeeAPI.js     # Employee management endpoints
│   ├── attendanceAPI.js   # Attendance tracking endpoints
│   ├── leaveAPI.js        # Leave management endpoints
│   ├── policyAPI.js       # Policy management endpoints
│   └── analyticsAPI.js    # Analytics and reporting endpoints
│
├── services/              # Service wrappers with error handling
│   ├── index.js          # Central export for all services
│   ├── authService.js
│   ├── employeeService.js
│   ├── attendanceService.js
│   ├── leaveService.js
│   ├── policyService.js
│   └── analyticsService.js
│
├── Hooks/                 # React hooks for components
│   ├── useAuth.js        # Authentication hooks
│   ├── useEmployee.js    # Employee management hooks
│   ├── useAttendance.js  # Attendance hooks
│   ├── useLeave.js       # Leave management hooks
│   └── usePolicy.js      # Policy hooks
│
└── utils/
    └── axios.js          # Configured Axios instance with interceptors
```

## Core Features

### 1. Axios Instance (`utils/axios.js`)

**Features:**
- Automatic token attachment to requests
- Response interceptor for error handling
- Automatic redirect on 401 (Unauthorized)
- Standardized error format
- Request timeout (15 seconds)

**Usage:**
```javascript
import axios from '../utils/axios';
const response = await axios.get('/api/endpoint');
```

### 2. API Modules

#### Authentication API (`API/authAPI.js`)

**Endpoints:**
- `register(userData)` - Register new user
- `login(credentials)` - User login
- `googleAuth(code)` - OAuth login
- `logout()` - User logout
- `getCurrentUser()` - Get current user profile
- `changePassword(passwordData)` - Change password
- `updateProfile(profileData)` - Update user profile
- `deleteAccount()` - Delete user account
- `getUserForLeaderboard()` - Get leaderboard data
- `isAuthenticated()` - Check auth status
- `getStoredUser()` - Get user from localStorage
- `getAuthToken()` - Get auth token

**Example:**
```javascript
import { login, getCurrentUser } from '../API/authAPI';

const handleLogin = async (credentials) => {
  try {
    const response = await login(credentials);
    // Token is automatically stored in localStorage
    console.log('User:', response.user);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

#### Employee API (`API/employeeAPI.js`)

**Endpoints:**
- `getMyProfile()` - Get current user's profile
- `updateMyProfile(profileData)` - Update own profile
- `getEmployees(params)` - Get all employees (HR/Admin)
- `getEmployeeById(id)` - Get employee by ID (HR/Admin)
- `addEmployee(data)` - Add new employee (HR/Admin)
- `updateEmployee(id, data)` - Update employee (HR/Admin)
- `deleteEmployee(id)` - Delete employee (HR/Admin)
- `getEmployeeStats()` - Get statistics (HR/Admin)
- `getDepartments()` - Get departments list (HR/Admin)
- `getEmployeesByDepartment(dept, params)` - Filter by department (HR/Admin)
- `reinitializeLeaveBalances(id, data)` - Reset leave balances (HR/Admin)

**Query Parameters:**
```javascript
{
  page: 1,              // Page number
  limit: 50,            // Items per page
  search: 'john',       // Search query
  department: 'IT',     // Filter by department
  designation: 'Dev',   // Filter by designation
  status: 'active',     // Filter by status
  sortBy: 'name',       // Sort field
  sortOrder: 'asc'      // Sort order
}
```

#### Attendance API (`API/attendanceAPI.js`)

**Endpoints:**
- `checkIn()` - Check in for the day
- `checkOut()` - Check out
- `getMyAttendance(params)` - Get own attendance records
- `getAttendanceByEmployee(id, params)` - Get employee attendance (HR/Admin)
- `getAllAttendance(params)` - Get all records (HR/Admin)
- `getTodaySummary()` - Get today's summary (HR/Admin)
- `getMonthlyReport(params)` - Get monthly report (HR/Admin)
- `updateAttendanceStatus(id, data)` - Update status (HR/Admin)

**Query Parameters:**
```javascript
{
  month: 10,           // Month (1-12)
  year: 2025,          // Year
  page: 1,             // Page number
  limit: 50,           // Items per page
  status: 'present',   // Filter by status
  department: 'IT'     // Filter by department
}
```

#### Leave API (`API/leaveAPI.js`)

**Endpoints:**
- `applyLeave(data)` - Apply for leave
- `getMyLeaves(params)` - Get own leave applications
- `getLeaveBalance()` - Get leave balance
- `getAllLeaves(params)` - Get all leaves (HR/Admin)
- `getPendingLeaves(params)` - Get pending leaves (HR/Admin)
- `approveLeave(id, data)` - Approve leave (HR/Admin)
- `rejectLeave(id, data)` - Reject leave (HR/Admin)
- `cancelLeave(id)` - Cancel leave application
- `addLeaveComment(id, data)` - Add comment to leave
- `getLeaveStatistics(params)` - Get statistics (HR/Admin)
- `getLeaveTypes()` - Get available leave types

**Leave Application Example:**
```javascript
import { applyLeave } from '../API/leaveAPI';

const data = {
  leaveType: 'casual',
  fromDate: '2025-10-20',
  toDate: '2025-10-22',
  reason: 'Personal work',
  halfDay: 'morning' // Optional
};

const response = await applyLeave(data);
```

#### Policy API (`API/policyAPI.js`)

**Endpoints:**
- `getActiveLeavePolicy()` - Get active leave policy
- `getActiveAttendancePolicy()` - Get active attendance policy
- `getPolicies(params)` - Get all policies (HR/Admin)
- `getPolicyById(id)` - Get policy by ID (HR/Admin)
- `addPolicy(data)` - Create new policy (HR/Admin)
- `updatePolicy(id, data)` - Update policy (HR/Admin)
- `updateLeaveTypeQuota(id, data)` - Update leave quota (HR/Admin)
- `deactivatePolicy(id)` - Deactivate policy (HR/Admin)
- `applyPolicyToEmployees(id, data)` - Apply to employees (HR/Admin)
- `deletePolicy(id)` - Delete policy (HR/Admin)

#### Analytics API (`API/analyticsAPI.js`)

**Endpoints:**
- `getTimeSpent(params)` - Get time spent analytics
- `getPeakHours(params)` - Get peak hours data
- `getDashboardAnalytics(params)` - Get combined dashboard data
- `getEmployeeProductivity(id, params)` - Get employee productivity
- `getDepartmentAnalytics(dept, params)` - Get department analytics

### 3. Service Wrappers

Service wrappers provide additional error handling and convenience methods.

**Example:**
```javascript
import { authService } from '../services/authService';

// Login with automatic error handling
try {
  const user = await authService.login({ email, password });
} catch (error) {
  // Error already logged in service
  showNotification(error.message);
}

// Get stored user
const user = authService.getStoredUser();

// Check authentication
if (authService.isAuthenticated()) {
  // User is logged in
}
```

### 4. React Hooks

Custom hooks for easy integration with React components.

#### useAttendance Hook
```javascript
import { useAttendance, useAttendanceRecords } from '../Hooks/useAttendance';

function AttendanceComponent() {
  const { checkIn, checkOut, loading, error } = useAttendance();
  const { records, stats, refetch } = useAttendanceRecords({
    month: 10,
    year: 2025
  });

  return (
    <div>
      <button onClick={checkIn} disabled={loading}>
        Check In
      </button>
      {records.map(record => (
        <div key={record._id}>{record.date}</div>
      ))}
    </div>
  );
}
```

#### useLeave Hook
```javascript
import { useMyLeaves, useLeaveBalance, useLeaveApplication } from '../Hooks/useLeave';

function LeaveComponent() {
  const { applyLeave, loading } = useLeaveApplication();
  const { leaves, refetch } = useMyLeaves({ status: 'pending' });
  const { balance } = useLeaveBalance();

  const handleApply = async () => {
    await applyLeave({
      leaveType: 'casual',
      fromDate: '2025-10-20',
      toDate: '2025-10-22',
      reason: 'Personal'
    });
    refetch(); // Refresh the list
  };

  return (
    <div>
      <p>Casual Leave Balance: {balance?.casual?.available}</p>
      <button onClick={handleApply}>Apply Leave</button>
    </div>
  );
}
```

#### useEmployee Hook
```javascript
import { useMyProfile, useEmployees, useEmployeeActions } from '../Hooks/useEmployee';

function EmployeeComponent() {
  const { profile, updateProfile } = useMyProfile();
  const { employees, refetch } = useEmployees({ page: 1, limit: 50 });
  const { addEmployee, updateEmployee, deleteEmployee } = useEmployeeActions();

  return (
    <div>
      <h2>{profile?.name}</h2>
      <ul>
        {employees.map(emp => (
          <li key={emp._id}>{emp.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Usage Guidelines

### 1. Import from Central Exports

```javascript
// ✅ Good - Use central exports
import { login, logout } from '../API';
import { authService } from '../services';

// ❌ Avoid - Direct imports
import { login } from '../API/authAPI';
```

### 2. Use Hooks in Components

```javascript
// ✅ Good - Use hooks for state management
import { useMyLeaves } from '../Hooks/useLeave';

function MyComponent() {
  const { leaves, loading, error, refetch } = useMyLeaves();
  // Component logic
}
```

### 3. Error Handling

```javascript
// ✅ Good - Handle errors gracefully
try {
  const response = await employeeService.addEmployee(data);
  showSuccess('Employee added successfully');
} catch (error) {
  showError(error.message || 'Failed to add employee');
}
```

### 4. Loading States

```javascript
// ✅ Good - Show loading indicators
const { employees, loading } = useEmployees();

if (loading) return <Loader />;
return <EmployeeList data={employees} />;
```

## Response Format

All API responses follow this standard format:

### Success Response
```javascript
{
  success: true,
  message: "Operation successful",
  data: { /* response data */ },
  token: "jwt-token" // For auth endpoints
}
```

### Error Response
```javascript
{
  success: false,
  message: "Error message",
  errors: { /* validation errors */ }
}
```

## Best Practices

1. **Always use the service layer** - Don't make direct Axios calls from components
2. **Use custom hooks** - Leverage React hooks for state management
3. **Handle errors** - Always wrap API calls in try-catch blocks
4. **Show loading states** - Provide user feedback during API calls
5. **Refetch data** - Use refetch functions after mutations
6. **Type safety** - Consider adding TypeScript for better type safety
7. **Token management** - Token is automatically handled by Axios interceptors
8. **Logout on 401** - Automatic redirect to login on unauthorized access

## Testing

```javascript
// Example test for API function
import { login } from '../API/authAPI';

test('login should store token', async () => {
  const credentials = { email: 'test@example.com', password: 'password' };
  const response = await login(credentials);
  
  expect(response.user).toBeDefined();
  expect(localStorage.getItem('authToken')).toBeTruthy();
});
```

## Environment Variables

Create a `.env` file in the client directory:

```env
VITE_SERVER_URL=http://localhost:3000
```

## Support

For issues or questions, refer to:
- Backend API documentation in `HRMS_Postman_Collection.json`
- Server routes in `server/route/`
- Component examples in `client/src/pages/`
