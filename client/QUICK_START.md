# 🚀 Quick Start Guide - API Service Layer

## ⚡ Getting Started in 5 Minutes

### Step 1: Import What You Need

Choose your preferred method:

#### Method A: Use Hooks (Recommended)
```javascript
import { useMyLeaves, useLeaveApplication } from '../Hooks';
```

#### Method B: Use Services
```javascript
import { leaveService } from '../services';
```

#### Method C: Use Raw API
```javascript
import { leaveAPI } from '../API';
```

---

### Step 2: Common Use Cases

#### 🔐 Login User
```javascript
import { authService } from '../services';

const handleLogin = async () => {
  try {
    await authService.login({ email, password });
    // Token automatically stored!
    navigate('/dashboard');
  } catch (error) {
    alert(error.message);
  }
};
```

#### 👤 Get User Profile
```javascript
import { useMyProfile } from '../Hooks';

function ProfilePage() {
  const { profile, loading, updateProfile } = useMyProfile();
  
  if (loading) return <Loader />;
  
  return (
    <div>
      <h1>{profile.name}</h1>
      <button onClick={() => updateProfile({ phone: '123' })}>
        Update
      </button>
    </div>
  );
}
```

#### 📋 Display Leave List
```javascript
import { useMyLeaves } from '../Hooks';

function MyLeaves() {
  const { leaves, loading, error, refetch } = useMyLeaves();
  
  if (loading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {leaves.map(leave => (
        <div key={leave._id}>
          {leave.leaveType} - {leave.status}
        </div>
      ))}
    </div>
  );
}
```

#### 📝 Apply for Leave
```javascript
import { useLeaveApplication } from '../Hooks';

function ApplyLeave() {
  const { applyLeave, loading, error } = useLeaveApplication();
  
  const handleSubmit = async (formData) => {
    try {
      await applyLeave({
        leaveType: 'casual',
        fromDate: '2025-10-20',
        toDate: '2025-10-22',
        reason: 'Personal work'
      });
      alert('Leave applied successfully!');
    } catch (err) {
      alert('Failed to apply leave');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Apply'}
      </button>
    </form>
  );
}
```

#### ⏰ Check In/Out
```javascript
import { useAttendance } from '../Hooks';

function AttendanceButton() {
  const { checkIn, checkOut, loading, todayAttendance } = useAttendance();
  
  const isCheckedIn = todayAttendance?.checkInTime && !todayAttendance?.checkOutTime;
  
  return (
    <button 
      onClick={isCheckedIn ? checkOut : checkIn}
      disabled={loading}
    >
      {loading ? 'Processing...' : isCheckedIn ? 'Check Out' : 'Check In'}
    </button>
  );
}
```

#### 👥 List Employees (HR/Admin)
```javascript
import { useEmployees, useEmployeeActions } from '../Hooks';

function EmployeeList() {
  const { employees, loading, refetch } = useEmployees({ 
    page: 1, 
    limit: 50 
  });
  const { deleteEmployee } = useEmployeeActions();
  
  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      await deleteEmployee(id);
      refetch(); // Refresh list
    }
  };
  
  return (
    <div>
      {employees.map(emp => (
        <div key={emp._id}>
          {emp.name} - {emp.department}
          <button onClick={() => handleDelete(emp._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

#### ✅ Approve Leave (HR/Admin)
```javascript
import { usePendingLeaves, useLeaveActions } from '../Hooks';

function PendingLeaves() {
  const { leaves, refetch } = usePendingLeaves();
  const { approve, reject } = useLeaveActions();
  
  const handleApprove = async (leaveId) => {
    await approve(leaveId);
    refetch();
  };
  
  const handleReject = async (leaveId) => {
    await reject(leaveId, { reason: 'Not enough staff' });
    refetch();
  };
  
  return (
    <div>
      {leaves.map(leave => (
        <div key={leave._id}>
          {leave.employee.name} - {leave.leaveType}
          <button onClick={() => handleApprove(leave._id)}>Approve</button>
          <button onClick={() => handleReject(leave._id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}
```

---

### Step 3: Error Handling

#### Option 1: Try-Catch
```javascript
try {
  await someService.someFunction();
} catch (error) {
  console.error(error.message);
  showNotification(error.message);
}
```

#### Option 2: Use Hook Error State
```javascript
const { data, error } = useMyData();

if (error) {
  return <ErrorMessage message={error} />;
}
```

---

### Step 4: Loading States

#### Option 1: Use Hook Loading State
```javascript
const { data, loading } = useMyData();

if (loading) return <Loader />;
return <DataDisplay data={data} />;
```

#### Option 2: Local Loading State
```javascript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await someAction();
  } finally {
    setLoading(false);
  }
};
```

---

## 🎯 Common Patterns

### Pattern 1: List with Filters
```javascript
const [filters, setFilters] = useState({ status: 'pending' });
const { leaves, refetch } = useMyLeaves(filters);

// Update filters
const handleFilterChange = (newStatus) => {
  setFilters({ status: newStatus });
  refetch({ status: newStatus });
};
```

### Pattern 2: Create and Refresh
```javascript
const { leaves, refetch } = useMyLeaves();
const { applyLeave } = useLeaveApplication();

const handleApply = async (data) => {
  await applyLeave(data);
  refetch(); // Refresh the list
};
```

### Pattern 3: Dashboard Stats
```javascript
import { useEmployeeStats } from '../Hooks';
import { useTodaySummary } from '../Hooks';

function Dashboard() {
  const { stats: employeeStats } = useEmployeeStats();
  const { summary: attendanceSummary } = useTodaySummary();
  
  return (
    <div>
      <Card title="Employees" value={employeeStats?.total} />
      <Card title="Present Today" value={attendanceSummary?.present} />
    </div>
  );
}
```

---

## 📚 Available Hooks Quick Reference

### Authentication
- `useAuth()` - Login, logout, authentication

### Employees
- `useMyProfile()` - Current user profile
- `useEmployees(params)` - List employees
- `useEmployee(id)` - Single employee
- `useEmployeeActions()` - CRUD operations
- `useEmployeeStats()` - Statistics
- `useDepartments()` - Departments list

### Attendance
- `useAttendance()` - Check in/out
- `useAttendanceRecords(params)` - Records list
- `useTodaySummary()` - Today's summary (HR)
- `useMonthlyReport(params)` - Monthly report (HR)

### Leaves
- `useLeaveApplication()` - Apply leave
- `useMyLeaves(params)` - My leaves
- `useLeaveBalance()` - Leave balance
- `useAllLeaves(params)` - All leaves (HR)
- `usePendingLeaves()` - Pending leaves (HR)
- `useLeaveActions()` - Approve/reject

### Policies
- `useActiveLeavePolicy()` - Active leave policy
- `useActiveAttendancePolicy()` - Active attendance policy
- `usePolicies(params)` - All policies (HR)
- `usePolicy(id)` - Single policy
- `usePolicyActions()` - CRUD operations

---

## 🔗 Import Paths

```javascript
// Hooks (Recommended)
import { useMyLeaves } from '../Hooks';
import { useMyLeaves } from '../Hooks/useLeave';

// Services
import { leaveService } from '../services';
import { leaveService } from '../services/leaveService';

// Raw API
import { leaveAPI } from '../API';
import * as leaveAPI from '../API/leaveAPI';
```

---

## ⚙️ Common Parameters

### Pagination
```javascript
{ page: 1, limit: 50 }
```

### Date Filters
```javascript
{ month: 10, year: 2025 }
```

### Status Filters
```javascript
{ status: 'pending' } // 'pending', 'approved', 'rejected'
```

### Search & Filter
```javascript
{
  search: 'john',
  department: 'IT',
  status: 'active'
}
```

---

## 🐛 Troubleshooting

### Issue: Data is undefined
```javascript
// ❌ Wrong
const response = await leaveAPI.getMyLeaves();
console.log(response.data.data); // undefined!

// ✅ Correct
const response = await leaveAPI.getMyLeaves();
console.log(response.data); // Data is already unwrapped!
```

### Issue: Token not sent
```javascript
// ❌ Wrong - using axios directly
import axios from 'axios';

// ✅ Correct - use configured instance
import axios from '../utils/axios';
```

### Issue: Infinite re-renders with hooks
```javascript
// ❌ Wrong
const { leaves, refetch } = useMyLeaves();
useEffect(() => {
  refetch(); // Will cause infinite loop!
}, [refetch]);

// ✅ Correct
const { leaves, refetch } = useMyLeaves();
// Data is fetched automatically, no need for useEffect
```

---

## 🎓 Next Steps

1. ✅ Read this Quick Start
2. 📖 Check `API_DOCUMENTATION.md` for complete reference
3. 🔧 Follow `INTEGRATION_GUIDE.md` to update components
4. 👀 Review example components in `src/examples/`
5. 🚀 Start building!

---

## 💡 Pro Tips

1. **Always use hooks in components** - They handle state automatically
2. **Use services for non-component code** - Like utility functions
3. **Use raw API only when needed** - For custom implementations
4. **Always handle errors** - Show user-friendly messages
5. **Show loading states** - Better user experience
6. **Refetch after mutations** - Keep data in sync

---

**Happy Coding! 🎉**

For detailed documentation, see:
- `API_DOCUMENTATION.md` - Complete API reference
- `INTEGRATION_GUIDE.md` - Integration instructions
- `PROJECT_SUMMARY.md` - Project overview
