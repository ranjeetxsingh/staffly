# Leave Balance Management - Complete Implementation Guide

## Overview
This implementation adds comprehensive leave balance management features including:
1. **Automatic initialization** - Leave balances are initialized when creating new employees
2. **Manual reinitialize** - HR/Admin can reset balances to policy defaults
3. **Manual adjustment** - HR/Admin can edit individual leave balances
4. **UI Controls** - Dedicated employee detail page with leave management interface

---

## Backend Implementation

### 1. API Endpoints

#### Reinitialize Leave Balances
```
POST /api/employees/:id/initialize-leaves
```
- **Access**: HR/Admin only
- **Description**: Resets all leave balances to defaults from active leave policy
- **Request**: No body required
- **Response**:
```json
{
  "success": true,
  "message": "Leave balances reinitialized successfully",
  "data": {
    "leaveBalances": [
      {
        "leaveType": "casual",
        "total": 12,
        "used": 0,
        "available": 12,
        "carriedForward": 0
      }
    ]
  }
}
```

#### Update Individual Leave Balance
```
PUT /api/employees/:id/leave-balance
```
- **Access**: HR/Admin only
- **Description**: Updates specific leave type balance for an employee
- **Request Body**:
```json
{
  "leaveType": "casual",
  "total": 15,
  "used": 3,
  "carriedForward": 2
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Leave balance updated successfully",
  "data": {
    "leaveBalances": [...]
  }
}
```
- **Note**: Available days are auto-calculated as: `total + carriedForward - used`

### 2. Controllers

**File**: `server/controllers/employeeController.js`

#### Auto-initialization on Employee Creation
```javascript
// In addEmployee controller (line 63-64)
await employee.save();
await employee.initializeLeaveBalances(); // Auto-initialize
```

#### updateLeaveBalance Controller
```javascript
exports.updateLeaveBalance = async (req, res) => {
  // Finds employee
  // Validates leave type exists
  // Updates total, used, carriedForward
  // Recalculates available = total + carriedForward - used
  // Saves and returns updated balances
};
```

### 3. Routes

**File**: `server/route/employeeRoutes.js`

```javascript
router.post("/:id/initialize-leaves", protect, hrOnly, reinitializeLeaveBalances);
router.put("/:id/leave-balance", protect, hrOnly, updateLeaveBalance);
```

Both routes require:
- `protect` middleware: User must be authenticated
- `hrOnly` middleware: User must be HR or Admin

---

## Frontend Implementation

### 1. Services

**File**: `client/src/services/employeeService.js`

```javascript
reinitializeLeaves: async (employeeId, data = {}) => {
  const response = await axios.post(
    `/api/employees/${employeeId}/initialize-leaves`, 
    data
  );
  return response;
},

updateLeaveBalance: async (employeeId, leaveBalanceData) => {
  const response = await axios.put(
    `/api/employees/${employeeId}/leave-balance`, 
    leaveBalanceData
  );
  return response;
}
```

### 2. Employee Detail Page

**File**: `client/src/pages/Employee/EmployeeDetailPage.jsx`

#### Features:
1. **Employee Information Display**
   - Employee ID, Department, Designation
   - Role, Phone, Joining Date
   - Status badge

2. **Leave Balance Table**
   - Shows all leave types with total, used, available, carried forward
   - Color-coded badges (green for available, warning for used)
   - Edit button for each leave type (HR/Admin only)

3. **Reinitialize Button**
   - Visible only to HR/Admin
   - Resets all balances to policy defaults
   - Shows confirmation dialog
   - Displays loading state

4. **Edit Balance Modal**
   - Edit total, used, and carried forward days
   - Auto-calculates available days
   - Input validation (min/max values)
   - Real-time preview of available days

#### UI Components:
```jsx
// Reinitialize Button
<Button
  variant="primary"
  onClick={handleReinitializeLeaves}
  disabled={reinitializing}
>
  {reinitializing ? '⏳ Reinitializing...' : '🔄 Reinitialize Leave Balances'}
</Button>

// Leave Balance Table
<Table
  columns={leaveBalanceColumns}
  data={employee.leaveBalances}
  striped
  hoverable
/>

// Edit Balance Modal
<Modal
  isOpen={isEditBalanceModalOpen}
  title="Edit Leave Balance"
  size="md"
>
  <Input label="Total Days" type="number" />
  <Input label="Used Days" type="number" />
  <Input label="Carried Forward Days" type="number" />
  <div>Available Days: {calculated} days</div>
</Modal>
```

### 3. Router Configuration

**File**: `client/src/Router/AppRouter.jsx`

```jsx
<Route path="employees/:id" element={
  <PrivateRoute>
    <EmployeeDetailPage />
  </PrivateRoute>
} />
```

---

## Usage Workflows

### Workflow 1: Creating a New Employee

1. HR/Admin navigates to Employees page
2. Clicks "Add Employee"
3. Fills employee details (name, email, department, designation, etc.)
4. Submits form
5. **Backend automatically**:
   - Creates Employee record
   - Creates User account
   - **Initializes leave balances from active policy**
   - Sends response with credentials
6. Employee can immediately apply for leaves

### Workflow 2: Viewing Employee Leave Balances

1. HR/Admin navigates to Employees list
2. Clicks on employee name or "View" button
3. Employee detail page opens showing:
   - Personal information
   - Leave balances table
4. Can see:
   - Each leave type (casual, sick, annual, etc.)
   - Total allocated days
   - Days used
   - Days available
   - Carried forward days

### Workflow 3: Reinitializing Leave Balances

**Use Case**: Reset all balances to policy defaults (e.g., new year, policy change)

1. HR/Admin opens employee detail page
2. Clicks "🔄 Reinitialize Leave Balances" button
3. Confirms action in dialog
4. Backend:
   - Fetches active leave policy
   - Resets all leave types to policy defaults
   - Sets used to 0, available to total
5. Page refreshes showing updated balances
6. Success message displayed

### Workflow 4: Manually Adjusting Leave Balance

**Use Case**: Compensate for errors, grant bonus leaves, adjust carried forward

1. HR/Admin opens employee detail page
2. Locates the leave type to adjust in table
3. Clicks "✏️ Edit" button for that leave type
4. Edit modal opens with current values:
   - Total Days: 12
   - Used Days: 3
   - Carried Forward: 2
   - **Available (auto-calculated): 11**
5. HR/Admin adjusts values:
   - Total Days: 15 (granted bonus)
   - Used Days: 3 (unchanged)
   - Carried Forward: 2 (unchanged)
   - **Available: 14** (auto-updates)
6. Clicks "Update Balance"
7. Backend validates and saves
8. Table refreshes with new values

---

## Setup Scripts

### 1. Create Default Leave Policy

**Script**: `server/utils/createDefaultPolicy.js`

```bash
node server/utils/createDefaultPolicy.js
```

Creates a default leave policy with:
- **Casual**: 12 days/year (carry forward: 5 days max)
- **Sick**: 10 days/year (no carry forward)
- **Annual**: 20 days/year (carry forward: 10 days max)
- **Maternity**: 180 days (6 months)
- **Paternity**: 15 days
- **Unpaid**: 30 days
- **Compensatory**: 12 days (carry forward: 6 days max)

### 2. Initialize Leave Balances for Existing Employees

**Script**: `server/utils/initializeLeaveBalances.js`

```bash
node server/utils/initializeLeaveBalances.js
```

For all active employees without leave balances:
- Fetches active leave policy
- Initializes all leave types
- Sets used to 0, available to total
- Shows summary report

**Output**:
```
✅ Connected to MongoDB
📋 Active Leave Policy: Default Company Leave Policy 2025
📊 Leave Types in Policy:
   - casual: 12 days
   - sick: 10 days
   ...

👥 Found 2 active employees
✅ Initialized leave balances for Priyanshu
✅ Initialized leave balances for Employee2

📊 Summary:
   ✅ Initialized: 2
   ✓  Already had balances: 0
   ❌ Errors: 0
```

---

## Database Schema

### Employee Model - Leave Balance Sub-schema

```javascript
const leaveBalanceSchema = new mongoose.Schema({
  leaveType: {
    type: String,
    required: true,
    enum: ['sick', 'casual', 'annual', 'maternity', 'paternity', 'unpaid', 'compensatory']
  },
  total: {
    type: Number,
    default: 0
  },
  used: {
    type: Number,
    default: 0
  },
  available: {
    type: Number,
    default: 0
  },
  carriedForward: {
    type: Number,
    default: 0
  }
}, { _id: false });
```

### Employee Model Methods

```javascript
// Initialize leave balances from active policy
employeeSchema.methods.initializeLeaveBalances = async function() {
  const Policy = mongoose.model('Policy');
  const leavePolicy = await Policy.getActiveLeavePolicy();
  
  if (leavePolicy && leavePolicy.leaveTypes) {
    this.leaveBalances = leavePolicy.leaveTypes.map(lt => ({
      leaveType: lt.leaveType,
      total: lt.annualQuota,
      used: 0,
      available: lt.annualQuota,
      carriedForward: 0
    }));
    await this.save();
  }
  return this;
};

// Get balance for specific leave type
employeeSchema.methods.getLeaveBalance = function(leaveType) {
  return this.leaveBalances.find(lb => lb.leaveType === leaveType);
};

// Update leave balance (deduct days)
employeeSchema.methods.updateLeaveBalance = function(leaveType, daysUsed) {
  const balance = this.leaveBalances.find(lb => lb.leaveType === leaveType);
  
  if (!balance) {
    throw new Error(`Leave type ${leaveType} not found`);
  }
  
  balance.used += daysUsed;
  balance.available = balance.total - balance.used;
  
  if (balance.available < 0) {
    throw new Error(`Insufficient ${leaveType} leave balance`);
  }
  
  return this.save();
};
```

---

## Access Control

### Role-Based Permissions

| Action | Employee | HR | Admin |
|--------|----------|----|----|
| View own leave balance | ✅ | ✅ | ✅ |
| View others' leave balance | ❌ | ✅ | ✅ |
| Apply for leave | ✅ | ✅ | ✅ |
| Reinitialize leave balances | ❌ | ✅ | ✅ |
| Edit leave balances | ❌ | ✅ | ✅ |
| Create employee (auto-init) | ❌ | ✅ | ✅ |

### Frontend Role Check

```javascript
const isHROrAdmin = user?.role === 'admin' || 
                    user?.employeeRole === 'hr' || 
                    user?.employeeRole === 'admin';

// Conditionally render HR/Admin features
{isHROrAdmin && (
  <Button onClick={handleReinitializeLeaves}>
    Reinitialize Leave Balances
  </Button>
)}
```

### Backend Middleware

```javascript
// Route protection
router.post("/:id/initialize-leaves", protect, hrOnly, reinitializeLeaveBalances);
router.put("/:id/leave-balance", protect, hrOnly, updateLeaveBalance);

// hrOnly middleware checks:
// - req.user.role === 'admin'
// - OR req.user.employeeRole === 'hr'
// - OR req.user.employeeRole === 'admin'
```

---

## Error Handling

### Common Errors

1. **No Active Policy**
   ```json
   {
     "success": false,
     "message": "No active leave policy found"
   }
   ```
   **Solution**: Run `createDefaultPolicy.js` script

2. **Leave Type Not Found**
   ```json
   {
     "success": false,
     "message": "Leave type 'casual' not found in employee's leave balances"
   }
   ```
   **Solution**: Reinitialize leave balances or check policy configuration

3. **Employee Not Found**
   ```json
   {
     "success": false,
     "message": "Employee not found"
   }
   ```
   **Solution**: Verify employee ID is correct

4. **Unauthorized Access**
   ```json
   {
     "success": false,
     "message": "Access denied. HR or Admin role required"
   }
   ```
   **Solution**: User must be HR or Admin

### Frontend Error Handling

```javascript
try {
  await employeeService.updateLeaveBalance(id, data);
  showSuccess('Leave balance updated successfully!');
} catch (error) {
  showError(error?.response?.data?.message || 'Failed to update leave balance');
  console.error('Update balance error:', error);
}
```

---

## Testing Checklist

### Backend Tests
- [ ] Employee creation initializes leave balances
- [ ] Reinitialize endpoint resets all balances
- [ ] Update balance validates leave type exists
- [ ] Update balance calculates available correctly
- [ ] HR/Admin can access endpoints
- [ ] Regular employees cannot access endpoints
- [ ] Active policy is fetched correctly

### Frontend Tests
- [ ] Employee detail page loads
- [ ] Leave balances table displays all types
- [ ] Reinitialize button visible to HR/Admin only
- [ ] Edit button visible to HR/Admin only
- [ ] Edit modal pre-fills current values
- [ ] Available days auto-calculate correctly
- [ ] Success/error messages display
- [ ] Page refreshes after updates
- [ ] Non-HR users see read-only view

### Integration Tests
- [ ] Create employee → balances initialized
- [ ] Apply leave → used days update
- [ ] Approve leave → available days reduce
- [ ] Reinitialize → all balances reset
- [ ] Edit balance → changes persist
- [ ] Navigate from list → detail page
- [ ] Back button → return to list

---

## Files Modified/Created

### Backend
1. ✅ `server/controllers/employeeController.js` - Added `updateLeaveBalance` controller
2. ✅ `server/route/employeeRoutes.js` - Added leave balance routes
3. ✅ `server/utils/createDefaultPolicy.js` - Created policy setup script
4. ✅ `server/utils/initializeLeaveBalances.js` - Created bulk initialization script

### Frontend
1. ✅ `client/src/services/employeeService.js` - Added `reinitializeLeaves`, `updateLeaveBalance`
2. ✅ `client/src/pages/Employee/EmployeeDetailPage.jsx` - Created new detail page
3. ✅ `client/src/Router/AppRouter.jsx` - Added route for detail page

### Documentation
1. ✅ `LEAVE_BALANCE_MANAGEMENT.md` - This file

---

## Future Enhancements

1. **Bulk Operations**: Update multiple employees' balances at once
2. **Audit Log**: Track who changed balances and when
3. **Leave Calendar**: Visual representation of leave usage
4. **Carry Forward Automation**: Auto-transfer unused leaves at year-end
5. **Leave Encashment**: Convert unused leaves to salary
6. **Department-wise Reports**: Leave utilization by department
7. **Email Notifications**: Alert employees when balances are updated
8. **Export to Excel**: Download leave balance reports

---

## Troubleshooting

### Leave Application Fails
**Error**: "Leave type 'casual' not found in your leave balance"

**Solutions**:
1. Check if employee has leave balances:
   ```bash
   # In MongoDB
   db.employees.findOne({ email: "emp@example.com" }).leaveBalances
   ```

2. Initialize balances:
   ```bash
   node server/utils/initializeLeaveBalances.js
   ```

3. Or use UI: Navigate to employee detail → Click "Initialize Leave Balances"

### Policy Not Found
**Error**: "No active leave policy found"

**Solution**:
```bash
node server/utils/createDefaultPolicy.js
```

### Permission Denied
**Error**: "Access denied. HR or Admin role required"

**Solution**: Ensure user has correct role:
- Check `user.role` is 'admin'
- OR `user.employeeRole` is 'hr' or 'admin'

---

## Summary

This implementation provides a complete leave balance management system with:
- ✅ Automatic initialization on employee creation
- ✅ Manual reinitialize for all balances
- ✅ Fine-grained manual adjustment per leave type
- ✅ Role-based access control (HR/Admin only)
- ✅ User-friendly UI with tables and modals
- ✅ Comprehensive error handling
- ✅ Setup scripts for easy deployment
- ✅ Real-time calculations and validations

The system ensures employees always have proper leave balances and gives HR/Admin full control over leave management while maintaining data integrity and security.
