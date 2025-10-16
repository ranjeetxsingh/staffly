# Role-Based Workflow Implementation

## Overview
This document describes the role-based workflow separation implemented in the Staffly HRMS system. The application now provides distinct user experiences for Employees, HR personnel, and Administrators.

## User Roles

### 1. Employee
- **Role Detection**: `user.role !== 'admin' && user.employeeRole !== 'hr' && user.employeeRole !== 'admin'`
- **Purpose**: Regular employees who need to manage their personal attendance and leaves

### 2. HR (Human Resources)
- **Role Detection**: `user.employeeRole === 'hr'`
- **Purpose**: HR personnel who manage employees, approve leaves, but don't need attendance check-in features

### 3. Admin
- **Role Detection**: `user.role === 'admin' || user.employeeRole === 'admin'`
- **Purpose**: System administrators with full access to all features

## Role-Based Features

### Navigation (Navbar)

**File**: `client/src/data/global/roleBasedNavbar.jsx`

#### Employee Navigation
```javascript
- Home
- Attendance (with check-in/check-out)
- My Leaves
- Policies
```

#### HR Navigation
```javascript
- Dashboard
- Employees
- Leave Requests
- Analytics
- Policies
```
**Note**: HR does NOT see Attendance with check-in/check-out options

#### Admin Navigation
```javascript
- Dashboard
- Employees
- Leave Management
- Attendance (reports view)
- Analytics
- Policies
```

### Implementation Details

#### 1. **Navbar Components**
**Files Modified**:
- `client/src/components/Navbar/Navbar.jsx`
- `client/src/components/Navbar/ResponsiveMenu.jsx`

**Changes**:
- Changed from static navigation to dynamic role-based navigation
- Import `getNavbarMenuByRole(user)` function
- Menu items change based on logged-in user's role

```javascript
import { getNavbarMenuByRole } from '../../data/global/roleBasedNavbar';
const NavbarMenu = getNavbarMenuByRole(user);
```

---

#### 2. **Attendance Page**
**File**: `client/src/pages/Attendance/AttendancePage.jsx`

**Employee View**:
- ✅ Check-in button
- ✅ Check-out button
- ✅ Personal attendance records
- ✅ Personal statistics (no employee column in table)

**HR/Admin View**:
- ❌ NO check-in/check-out buttons
- ✅ All employees' attendance records
- ✅ Team statistics
- ✅ Attendance reports with employee information

**Key Changes**:
```javascript
const isHROrAdmin = user?.role === 'admin' || user?.employeeRole === 'hr' || user?.employeeRole === 'admin';
const isEmployee = !isHROrAdmin;

// Conditionally render check-in/out buttons
{isEmployee && (
  <div className="flex gap-2">
    <Button variant="success" onClick={() => setIsCheckInModalOpen(true)}>
      ✓ Check In
    </Button>
    <Button variant="warning" onClick={handleCheckOut}>
      ← Check Out
    </Button>
  </div>
)}

// Different table columns based on role
const tableColumns = isHROrAdmin ? [...] : [...]; // With/without employee column
```

---

#### 3. **Leave Page**
**File**: `client/src/pages/Leave/LeavePage.jsx`

**Employee View**:
- Default Tab: "My Leaves"
- Available Tabs:
  - My Leaves (view only)
- ✅ Apply for Leave button
- ❌ NO approve/reject actions

**HR/Admin View**:
- Default Tab: "Pending Approvals"
- Available Tabs:
  - My Leaves
  - Pending Approvals (with approve/reject buttons)
  - All Leaves (view all employees)
- ✅ Apply for Leave button
- ✅ Approve/Reject actions

**Key Changes**:
```javascript
const isHROrAdmin = user?.role === 'admin' || user?.employeeRole === 'hr' || user?.employeeRole === 'admin';
const isEmployee = !isHROrAdmin;

// Set default active tab based on role
const [activeTab, setActiveTab] = useState(isEmployee ? 0 : 1);

// Define tabs based on role
const getTabsData = () => {
  if (isEmployee) {
    return [myLeavesTab]; // Only My Leaves
  }
  return [myLeavesTab, pendingApprovalsTab, allLeavesTab]; // All tabs
};
```

---

#### 4. **Dashboard Page**
**File**: `client/src/pages/Dashboard/Dashboard.jsx`

**Access Control**:
- **Allowed**: HR, Admin
- **Denied**: Regular Employees (redirected to `/attendance`)

**All HR/Admin Users**:
- Total Employees
- Present Today
- Absent Today
- Currently Checked In

**HR/Admin Only**:
- Pending Leave Requests card
- On Leave card
- Attendance Rate card
- Recent Activities (team-wide)

**Quick Actions** (Role-Based):
- **HR/Admin**: Manage Employees, Leave Requests, Attendance Reports
- **All Users**: View Policies, My Profile

**Key Changes**:
```javascript
const isHROrAdmin = user?.role === 'admin' || user?.employeeRole === 'hr' || user?.employeeRole === 'admin';

// Redirect employees to attendance page
useEffect(() => {
  if (isEmployee) {
    navigate('/attendance');
  }
}, [isEmployee, navigate]);

// Conditional rendering for HR/Admin stats
{isHROrAdmin && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    {/* Pending Leave Requests, On Leave, Attendance Rate */}
  </div>
)}

// Role-based Quick Actions
{isHROrAdmin && (
  <>
    <Button onClick={() => navigate('/employees')}>Manage Employees</Button>
    <Button onClick={() => navigate('/leaves')}>Leave Requests</Button>
    <Button onClick={() => navigate('/attendance')}>Attendance Reports</Button>
  </>
)}
```

---

#### 5. **Employee List Page**
**File**: `client/src/pages/Employee/EmployeeListPage.jsx`

**Access Control**:
- **Allowed**: HR, Admin
- **Denied**: Regular Employees (redirected to `/access-denied`)

**Existing Implementation**:
```javascript
const isHROrAdmin = user?.role === 'admin' || user?.employeeRole === 'hr' || user?.employeeRole === 'admin';

useEffect(() => {
  if (!isHROrAdmin) {
    navigate('/access-denied');
  }
}, [isHROrAdmin, navigate]);
```

---

#### 6. **Router Updates**
**File**: `client/src/Router/AppRouter.jsx`

**Added**:
- Access Denied route: `/access-denied`

```javascript
import AccessDenied from "../pages/AccessDenied/AccessDenied";

<Route path="access-denied" element={<AccessDenied />} />
```

---

## Role Detection Logic

### Consistent Pattern Across All Pages

```javascript
// Import user from Redux
const { user } = useSelector((state) => state.auth);

// Check if user is HR or Admin
const isHROrAdmin = user?.role === 'admin' || user?.employeeRole === 'hr' || user?.employeeRole === 'admin';

// Check if user is Employee
const isEmployee = !isHROrAdmin;
```

### Why Two Fields?

The system uses two role fields:
1. **`user.role`**: Authentication role ('employee' or 'admin') from User model
2. **`user.employeeRole`**: Employee role ('employee', 'hr', 'admin', 'manager') from Employee model

This dual-field approach allows:
- Fine-grained access control
- Separation of auth concerns from HR concerns
- Flexibility for future role additions

---

## Summary of Changes

### Files Created
1. ✅ `client/src/data/global/roleBasedNavbar.jsx` - Role-based navigation configuration

### Files Modified
1. ✅ `client/src/components/Navbar/Navbar.jsx` - Dynamic navbar based on role
2. ✅ `client/src/components/Navbar/ResponsiveMenu.jsx` - Mobile menu with role-based items
3. ✅ `client/src/pages/Attendance/AttendancePage.jsx` - Conditional check-in/out for employees only
4. ✅ `client/src/pages/Leave/LeavePage.jsx` - Different tabs and views per role
5. ✅ `client/src/pages/Dashboard/Dashboard.jsx` - Role-based statistics
6. ✅ `client/src/Router/AppRouter.jsx` - Added access-denied route

### Files Already Compliant
- ✅ `client/src/pages/Employee/EmployeeListPage.jsx` - Already has HR/Admin access control
- ✅ `client/src/pages/Employee/EmployeeDetailPage.jsx` - Already has role-based leave management

---

## Testing Checklist

### Employee Login
- [ ] Navbar shows: Home, Attendance, My Leaves, Policies (NO Dashboard)
- [ ] Dashboard redirects to /attendance automatically
- [ ] Attendance page shows check-in/check-out buttons
- [ ] Attendance table does NOT show employee column
- [ ] Leave page shows only "My Leaves" tab
- [ ] Cannot access /employees (redirected to /access-denied)
- [ ] Quick Actions (if visible): Only shows View Policies, My Profile

### HR Login
- [ ] Navbar shows: Dashboard, Employees, Leave Requests, Analytics, Policies
- [ ] Navbar does NOT show Attendance (for check-in)
- [ ] Dashboard is accessible with HR-specific stats
- [ ] Dashboard Quick Actions show: Manage Employees, Leave Requests, Attendance Reports
- [ ] Leave page default tab is "Pending Approvals"
- [ ] Leave page shows approve/reject buttons
- [ ] Can access /employees

### Admin Login
- [ ] Navbar shows: Dashboard, Employees, Leave Management, Attendance, Analytics, Policies
- [ ] Dashboard is accessible with all stats
- [ ] Dashboard Quick Actions show: Manage Employees, Leave Requests, Attendance Reports
- [ ] Attendance page shows reports view (no check-in/out)
- [ ] Leave page shows all tabs
- [ ] Can access all pages

---

## Future Enhancements

1. **Analytics Page**: Add role-based analytics views
2. **Profile Page**: Different fields based on role
3. **Policies Page**: View vs Edit permissions based on role
4. **Notifications**: Role-specific notification types
5. **Reports**: Different report types for each role
6. **Permissions**: More granular permission system

---

## API Endpoints (Already Implemented)

All backend endpoints already support role-based access:
- `GET /api/employees` - HR/Admin only
- `GET /api/attendance/my` - Employee own records
- `GET /api/attendance/summary/today` - HR/Admin all records
- `GET /api/leaves/my` - Employee own leaves
- `GET /api/leaves/pending` - HR/Admin pending approvals
- `POST /api/leaves/:id/approve` - HR/Admin only
- `POST /api/leaves/:id/reject` - HR/Admin only

---

## Migration Notes

**No database migrations required** - all changes are frontend only.

**Existing users** will automatically see the appropriate view based on their existing role assignments.

---

## Support

For issues or questions about the role-based workflow implementation:
1. Check this documentation first
2. Review the code comments in the modified files
3. Test with different user roles
4. Verify role detection logic is consistent across all pages

---

**Last Updated**: 2024
**Version**: 1.0.0
