# Leave Application Fix Summary

## Problem
"Failed to apply for leave" - Leave applications were not being submitted successfully.

## Root Causes

### 1. **Field Name Mismatch**
- **Frontend sends**: `startDate`, `endDate`
- **Backend expects**: `fromDate`, `toDate`

The backend leaveController.js requires specific field names:
```javascript
const { leaveType, fromDate, toDate, reason, attachments } = req.body;
```

### 2. **Data Extraction Issues**
Leave hooks were not correctly extracting arrays from API responses due to inconsistent backend response structures.

### 3. **Missing Validation**
No client-side validation before submission, leading to unclear error messages.

## Backend API Endpoints (from leaveController.js)

### Apply Leave
- **Endpoint**: `POST /api/leaves/apply`
- **Required Fields**:
  - `leaveType`: string (sick, casual, annual, maternity, paternity, unpaid, compensatory)
  - `fromDate`: Date (DD-MM-YYYY, YYYY-MM-DD, or ISO format)
  - `toDate`: Date (DD-MM-YYYY, YYYY-MM-DD, or ISO format)
  - `reason`: string
- **Optional Fields**:
  - `attachments`: array
  - `employeeId`: ObjectId (defaults to logged-in user)
- **Response**: `{ success: true, message: "...", data: leave }`

### Get My Leaves
- **Endpoint**: `GET /api/leaves/my-leaves?status=pending&year=2025`
- **Response**: `{ success: true, data: [...] }` - **Direct array**

### Get Pending Leaves (HR/Admin)
- **Endpoint**: `GET /api/leaves/pending?department=Engineering`
- **Response**: `{ success: true, data: [...] }` - **Direct array**

### Get All Leaves (HR/Admin)
- **Endpoint**: `GET /api/leaves/all?status=pending&department=Engineering&page=1&limit=50`
- **Response**: `{ success: true, data: { leaves: [...], pagination: {...} } }` - **Nested object**

## Fixes Applied

### 1. Field Name Mapping in LeavePage.jsx

**Before:**
```javascript
const handleApplyLeave = async () => {
  try {
    await applyLeave(formData);  // Sends startDate, endDate
    // ...
  } catch (error) {
    showError('Failed to apply for leave');  // Generic error
  }
};
```

**After:**
```javascript
const handleApplyLeave = async () => {
  // Validation
  if (!formData.leaveType) {
    showError('Please select a leave type');
    return;
  }
  if (!formData.startDate) {
    showError('Please select a start date');
    return;
  }
  if (!formData.endDate) {
    showError('Please select an end date');
    return;
  }
  if (!formData.reason || formData.reason.trim().length === 0) {
    showError('Please provide a reason for leave');
    return;
  }

  // Date validation
  const start = new Date(formData.startDate);
  const end = new Date(formData.endDate);
  if (end < start) {
    showError('End date must be after or equal to start date');
    return;
  }

  try {
    // Map frontend field names to backend field names
    const leaveData = {
      leaveType: formData.leaveType,
      fromDate: formData.startDate,  // ✅ Mapped correctly
      toDate: formData.endDate,      // ✅ Mapped correctly
      reason: formData.reason,
    };
    
    await applyLeave(leaveData);
    showSuccess('Leave application submitted successfully!');
    setIsApplyModalOpen(false);
    resetForm();
    loadLeaves();
  } catch (error) {
    showError(error?.response?.data?.message || 'Failed to apply for leave');
    console.error('Apply leave error:', error);
  }
};
```

### 2. Data Extraction Fixes in useLeave.js

#### useMyLeaves Hook
**Before:**
```javascript
const leavesArray = response?.data?.leaves || response?.leaves || [];
```

**After:**
```javascript
// Backend returns: { success: true, data: [...] } - direct array
const leavesArray = response?.data || [];
```

#### usePendingLeaves Hook
**Before:**
```javascript
const leavesArray = response?.data?.leaves || response?.leaves || [];
```

**After:**
```javascript
// Backend returns: { success: true, data: [...] } - direct array
const leavesArray = response?.data || [];
```

#### Combined useLeave Hook
Updated `fetchMyLeaves` and `fetchPendingLeaves` to extract direct arrays:
```javascript
const leavesArray = response?.data || [];
```

Kept `fetchAllLeaves` with nested extraction (since backend returns nested object):
```javascript
const leavesArray = response?.data?.leaves || response?.leaves || [];
```

## Response Structure Mapping

| Endpoint | Response Structure | Extract With |
|----------|-------------------|--------------|
| `getMyLeaves` | `{ success: true, data: [...] }` | `response.data` |
| `getPending` | `{ success: true, data: [...] }` | `response.data` |
| `getAll` | `{ success: true, data: { leaves: [...], pagination: {...} } }` | `response.data.leaves` |
| `applyLeave` | `{ success: true, message: "...", data: leave }` | `response.data` |
| `approveLeave` | `{ success: true, message: "...", data: leave }` | `response.data` |
| `rejectLeave` | `{ success: true, message: "...", data: leave }` | `response.data` |
| `getBalance` | `{ success: true, data: { balances: [...], usedThisYear: {...} } }` | `response.data` |

## Backend Date Parsing

The backend supports multiple date formats:
```javascript
// DD-MM-YYYY format (12-10-2025)
if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
  const [day, month, year] = dateStr.split('-');
  return new Date(`${year}-${month}-${day}`);
}

// YYYY-MM-DD, ISO format
return new Date(dateStr);
```

HTML5 date inputs provide YYYY-MM-DD format, which is compatible.

## Validation Added

### Client-Side
1. ✅ Required field validation (leaveType, startDate, endDate, reason)
2. ✅ Date range validation (endDate >= startDate)
3. ✅ Reason not empty

### Server-Side (Already in place)
1. ✅ Required fields check
2. ✅ Date validation (valid format)
3. ✅ End date after start date
4. ✅ Leave balance check
5. ✅ Employee exists

## Testing Checklist

- [ ] Can apply for leave with all leave types
- [ ] Start date validation works
- [ ] End date validation works
- [ ] Cannot submit with end date before start date
- [ ] Reason is required
- [ ] Days calculation displays correctly
- [ ] Success message shows after submission
- [ ] Leave appears in "My Leaves" tab
- [ ] Error messages are specific (not generic)
- [ ] Leave balance updates after approval
- [ ] HR can see pending leaves
- [ ] HR can approve/reject leaves

## Files Modified

1. **`client/src/pages/Leave/LeavePage.jsx`**
   - Added field name mapping (startDate→fromDate, endDate→toDate)
   - Added comprehensive validation
   - Added specific error messages
   - Added error logging for debugging

2. **`client/src/Hooks/useLeave.js`**
   - Fixed `useMyLeaves` data extraction
   - Fixed `usePendingLeaves` data extraction
   - Fixed combined `useLeave` hook data extraction
   - Updated comments to document response structures

## Expected Behavior

### Successful Application
1. User fills all required fields
2. Selects valid date range
3. Provides reason
4. Submits form
5. Backend validates and creates leave record
6. Frontend shows success message
7. Modal closes and form resets
8. Leave list refreshes automatically

### Error Handling
1. Missing fields → Specific error message
2. Invalid date range → "End date must be after or equal to start date"
3. Insufficient balance → Backend error message displayed
4. Server error → Error message from backend or generic fallback

## API Communication Flow

```
User Action
    ↓
LeavePage.handleApplyLeave()
    ↓
Validation (client-side)
    ↓
Field mapping (startDate→fromDate, endDate→toDate)
    ↓
useLeave.applyLeave(leaveData)
    ↓
leaveService.applyLeave(leaveData)
    ↓
axios.post('/api/leaves/apply', leaveData)
    ↓
Backend: leaveController.applyLeave()
    ↓
Validation (server-side)
    ↓
Database: Create Leave record
    ↓
Response: { success: true, data: leave }
    ↓
Axios interceptor: Returns response.data
    ↓
Frontend: Shows success, refreshes list
```
