# Frontend Integration Guide

## 🎯 Overview

This guide will help you integrate the complete API service layer into your HRMS Staffly application. Follow these steps to ensure seamless integration with your existing components.

## 📁 What Has Been Created

### 1. API Layer (`client/src/API/`)
✅ `authAPI.js` - Authentication endpoints  
✅ `employeeAPI.js` - Employee management endpoints  
✅ `attendanceAPI.js` - Attendance tracking endpoints  
✅ `leaveAPI.js` - Leave management endpoints  
✅ `policyAPI.js` - Policy management endpoints  
✅ `analyticsAPI.js` - Analytics and reporting endpoints  
✅ `index.js` - Central export file  

### 2. Service Wrappers (`client/src/services/`)
✅ `authService.js` - Updated with new functions  
✅ `employeeService.js` - Complete employee service  
✅ `attendanceService.js` - Attendance service  
✅ `leaveService.js` - Leave service  
✅ `policyService.js` - Policy service  
✅ `analyticsService.js` - Analytics service  
✅ `index.js` - Central export file  

### 3. React Hooks (`client/src/Hooks/`)
✅ `useAttendance.js` - Attendance hooks  
✅ `useLeave.js` - Leave management hooks  
✅ `useEmployee.js` - Employee management hooks  
✅ `usePolicy.js` - Policy hooks  

### 4. Utilities (`client/src/utils/`)
✅ `axios.js` - Enhanced Axios instance with interceptors  

### 5. Examples (`client/src/examples/`)
✅ `LeaveManagementExample.jsx` - Complete leave component  
✅ `AttendanceManagementExample.jsx` - Complete attendance component  

### 6. Documentation
✅ `API_DOCUMENTATION.md` - Complete API documentation  
✅ `INTEGRATION_GUIDE.md` - This file  

## 🚀 Quick Start

### Step 1: Update Your Components

Replace direct axios calls with the new service layer:

**Before:**
```javascript
import axios from '../utils/axios';

const handleLogin = async () => {
  const response = await axios.post('/api/auth/login', credentials);
  // ...
}
```

**After:**
```javascript
import { authService } from '../services';

const handleLogin = async () => {
  const response = await authService.login(credentials);
  // Token is automatically stored
}
```

**Even Better - Using Hooks:**
```javascript
import { useAuth } from '../Hooks/useAuth';

function LoginComponent() {
  const { login, loading, error } = useAuth();
  
  const handleLogin = async () => {
    await login(credentials);
    // Navigate to dashboard
  };
}
```

### Step 2: Update Existing Components

Here's how to update your existing pages:

#### Attendance Page (`client/src/pages/Attendance/AttendancePage.jsx`)

```javascript
import React from 'react';
import { useAttendance, useAttendanceRecords } from '../../Hooks/useAttendance';

const AttendancePage = () => {
  const { checkIn, checkOut, loading } = useAttendance();
  const { records, stats, refetch } = useAttendanceRecords({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  return (
    <div>
      <button onClick={checkIn} disabled={loading}>
        Check In
      </button>
      <button onClick={checkOut} disabled={loading}>
        Check Out
      </button>
      
      <div>
        {records.map(record => (
          <div key={record._id}>
            {/* Display attendance record */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendancePage;
```

#### Employee Page (`client/src/pages/Employee/EmployeePage.jsx`)

```javascript
import React, { useState } from 'react';
import { useEmployees, useEmployeeActions } from '../../Hooks/useEmployee';

const EmployeePage = () => {
  const [page, setPage] = useState(1);
  const { employees, pagination, loading, refetch } = useEmployees({ 
    page, 
    limit: 50 
  });
  const { addEmployee, updateEmployee, deleteEmployee } = useEmployeeActions();

  const handleAdd = async (employeeData) => {
    await addEmployee(employeeData);
    refetch(); // Refresh the list
  };

  const handleUpdate = async (id, employeeData) => {
    await updateEmployee(id, employeeData);
    refetch();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await deleteEmployee(id);
      refetch();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {employees.map(emp => (
        <div key={emp._id}>
          {emp.name} - {emp.department}
          <button onClick={() => handleUpdate(emp._id, updatedData)}>
            Edit
          </button>
          <button onClick={() => handleDelete(emp._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default EmployeePage;
```

#### Dashboard Page (`client/src/pages/Dashboard/Dashboard.jsx`)

```javascript
import React from 'react';
import { useEmployeeStats } from '../../Hooks/useEmployee';
import { useTodaySummary } from '../../Hooks/useAttendance';
import { usePendingLeaves } from '../../Hooks/useLeave';

const Dashboard = () => {
  const { stats: employeeStats } = useEmployeeStats();
  const { summary: attendanceSummary } = useTodaySummary();
  const { leaves: pendingLeaves } = usePendingLeaves();

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Employee Stats */}
      <div>
        <h2>Employees</h2>
        <p>Total: {employeeStats?.total}</p>
        <p>Active: {employeeStats?.active}</p>
      </div>

      {/* Attendance Summary */}
      <div>
        <h2>Today's Attendance</h2>
        <p>Present: {attendanceSummary?.present}</p>
        <p>Absent: {attendanceSummary?.absent}</p>
      </div>

      {/* Pending Leaves */}
      <div>
        <h2>Pending Leave Requests</h2>
        <p>Count: {pendingLeaves?.length}</p>
      </div>
    </div>
  );
};

export default Dashboard;
```

#### Profile Page (`client/src/pages/Profile/Profile.jsx`)

```javascript
import React, { useState } from 'react';
import { useMyProfile } from '../../Hooks/useEmployee';

const Profile = () => {
  const { profile, loading, updateProfile } = useMyProfile();
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    alert('Profile updated successfully!');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        defaultValue={profile?.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      {/* More fields */}
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default Profile;
```

### Step 3: Update Authentication Flow

Update your login/logout components to use the new auth service:

#### Login Component

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login(credentials);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default Login;
```

### Step 4: Protected Routes

Update your protected routes to use the auth service:

```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services';

const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getStoredUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

## 🎨 Using the Example Components

### Option 1: Copy Examples
Copy the example components to your pages folder and customize them:

```bash
# Copy leave example
cp client/src/examples/LeaveManagementExample.jsx client/src/pages/Leave/LeavePage.jsx

# Copy attendance example
cp client/src/examples/AttendanceManagementExample.jsx client/src/pages/Attendance/AttendancePage.jsx
```

### Option 2: Import and Use Directly

```javascript
// In your routes file
import LeaveManagementExample from './examples/LeaveManagementExample';

<Route path="/leaves" element={<LeaveManagementExample />} />
```

## 🔧 Common Patterns

### Pattern 1: Data Fetching with Loading State

```javascript
const MyComponent = () => {
  const { data, loading, error, refetch } = useDataHook();

  if (loading) return <Loader />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  
  return <DataDisplay data={data} />;
};
```

### Pattern 2: Form Submission with Feedback

```javascript
const MyForm = () => {
  const [formData, setFormData] = useState({});
  const { submit, loading, error, success } = useSubmitHook();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submit(formData);
      setFormData({}); // Reset form
      // Show success message
    } catch (err) {
      // Error is already in state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <ErrorAlert message={error} />}
      {success && <SuccessAlert message="Submitted successfully!" />}
      <button disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
```

### Pattern 3: List with Pagination

```javascript
const MyList = () => {
  const [page, setPage] = useState(1);
  const { items, pagination, loading, refetch } = useListHook({ page, limit: 50 });

  return (
    <div>
      {items.map(item => <ItemCard key={item._id} item={item} />)}
      
      <Pagination
        current={page}
        total={pagination?.totalPages}
        onChange={setPage}
      />
    </div>
  );
};
```

## 🐛 Troubleshooting

### Issue: "Cannot read property 'data' of undefined"

**Solution:** The API now returns data directly (not wrapped in `response.data`)

```javascript
// Old code
const response = await axios.get('/api/endpoint');
const data = response.data; // ❌

// New code
const data = await employeeService.getEmployees(); // ✅
// data is already unwrapped
```

### Issue: Token not being sent with requests

**Solution:** Make sure you're using the axios instance from `utils/axios.js`

```javascript
// ❌ Wrong
import axios from 'axios';

// ✅ Correct
import axios from '../utils/axios';
```

### Issue: Redirect loop on login page

**Solution:** Check if you're using the correct auth check

```javascript
// In ProtectedRoute component
const isAuthenticated = authService.isAuthenticated(); // ✅
// Not: const token = localStorage.getItem('token'); // ❌
```

## 📝 Migration Checklist

- [ ] Update all authentication-related components to use `authService`
- [ ] Replace direct axios calls with service functions
- [ ] Update employee management pages with hooks
- [ ] Update attendance pages with hooks
- [ ] Update leave management pages with hooks
- [ ] Update policy pages (if any) with hooks
- [ ] Update dashboard with new hooks for statistics
- [ ] Test protected routes with new auth service
- [ ] Test all CRUD operations
- [ ] Test error handling
- [ ] Test loading states
- [ ] Remove old/unused code
- [ ] Update environment variables if needed

## 🎓 Best Practices

1. **Always use hooks in components** - They provide automatic state management
2. **Handle errors gracefully** - Show user-friendly error messages
3. **Show loading states** - Provide visual feedback during API calls
4. **Refetch after mutations** - Keep data in sync after create/update/delete
5. **Use TypeScript** - Consider adding TypeScript for better type safety
6. **Keep components small** - Break down large components into smaller ones
7. **Use the service layer** - Never make direct axios calls from components

## 📚 Additional Resources

- See `API_DOCUMENTATION.md` for complete API reference
- Check example components in `client/src/examples/`
- Review the Postman collection for API details
- Backend routes in `server/route/`

## 🆘 Need Help?

If you encounter any issues:

1. Check the browser console for errors
2. Verify the API endpoint in the backend routes
3. Check if the token is being sent correctly
4. Review the example components for reference
5. Ensure your backend server is running

## ✨ Next Steps

After integration:

1. Test all functionality thoroughly
2. Add proper error boundaries
3. Implement toast notifications for better UX
4. Add form validation
5. Implement loading skeletons
6. Add unit tests for critical functions
7. Consider adding state management (Redux) if needed
8. Optimize performance with React.memo and useMemo
9. Add accessibility features
10. Implement analytics tracking

Good luck with your integration! 🚀
