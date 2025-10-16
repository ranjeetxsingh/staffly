# Leave Page Fix - Array Filter Error

## Error Encountered
```
LeavePage.jsx:213 Uncaught TypeError: leaves?.filter is not a function
    at LeavePage (LeavePage.jsx:213:22)
```

---

## Root Cause

The `useLeave` hook was setting the `leaves` state with the entire API response object instead of extracting the `leaves` array.

### API Response Structure:
```json
{
  "success": true,
  "data": {
    "leaves": [
      { "_id": "...", "leaveType": "sick", "status": "pending", ... }
    ],
    "pagination": { "currentPage": 1, "totalPages": 2, ... }
  }
}
```

### What Was Happening:
```javascript
// Before fix:
const response = await leaveService.getMyLeaves();
setLeaves(response); // ❌ Sets entire object

// In component:
leaves?.filter(l => l.status === 'pending') 
// ❌ Error: response.filter is not a function
```

### What Should Happen:
```javascript
// After fix:
const response = await leaveService.getMyLeaves();
const leavesArray = response?.data?.leaves || response?.leaves || [];
setLeaves(Array.isArray(leavesArray) ? leavesArray : []); // ✅ Sets array

// In component:
leaves?.filter(l => l.status === 'pending') // ✅ Works
```

---

## Solutions Implemented

### 1. Fixed `useLeave` Hook (Comprehensive)

Updated all three fetch methods to properly extract arrays:

#### `fetchMyLeaves()`
```javascript
const fetchMyLeaves = useCallback(async () => {
  setLoading(true);
  try {
    const response = await leaveService.getMyLeaves();
    // Extract leaves array from nested response
    const leavesArray = response?.data?.leaves || response?.leaves || [];
    setLeaves(Array.isArray(leavesArray) ? leavesArray : []);
    return response;
  } catch (err) {
    setError(err.message);
    setLeaves([]); // ✅ Always set to array on error
    throw err;
  } finally {
    setLoading(false);
  }
}, []);
```

#### `fetchPendingLeaves()`
```javascript
const fetchPendingLeaves = useCallback(async () => {
  setLoading(true);
  try {
    const response = await leaveService.getPending();
    const leavesArray = response?.data?.leaves || response?.leaves || [];
    setLeaves(Array.isArray(leavesArray) ? leavesArray : []);
    return response;
  } catch (err) {
    setError(err.message);
    setLeaves([]); // ✅ Always set to array on error
    throw err;
  } finally {
    setLoading(false);
  }
}, []);
```

#### `fetchAllLeaves()`
```javascript
const fetchAllLeaves = useCallback(async () => {
  setLoading(true);
  try {
    const response = await leaveService.getAll();
    const leavesArray = response?.data?.leaves || response?.leaves || [];
    setLeaves(Array.isArray(leavesArray) ? leavesArray : []);
    return response;
  } catch (err) {
    setError(err.message);
    setLeaves([]); // ✅ Always set to array on error
    throw err;
  } finally {
    setLoading(false);
  }
}, []);
```

### 2. Fixed Individual Hooks

Also updated the individual hooks for consistency:

#### `useMyLeaves()`
```javascript
const leavesArray = response?.data?.leaves || response?.leaves || [];
setLeaves(Array.isArray(leavesArray) ? leavesArray : []);
setPagination(response?.data?.pagination || response?.pagination || null);
```

#### `useAllLeaves()`
```javascript
const leavesArray = response?.data?.leaves || response?.leaves || [];
setLeaves(Array.isArray(leavesArray) ? leavesArray : []);
setPagination(response?.data?.pagination || response?.pagination || null);
```

#### `usePendingLeaves()`
```javascript
const leavesArray = response?.data?.leaves || response?.leaves || [];
setLeaves(Array.isArray(leavesArray) ? leavesArray : []);
```

---

## Extraction Logic

### Multi-Level Fallback:
```javascript
const leavesArray = 
  response?.data?.leaves ||  // First try: nested data.leaves
  response?.leaves ||        // Fallback: direct leaves property
  [];                        // Default: empty array

setLeaves(Array.isArray(leavesArray) ? leavesArray : []);
```

### Why This Works:
1. **`response?.data?.leaves`**: Handles nested structure from backend
2. **`response?.leaves`**: Handles direct structure (if interceptor fully extracts)
3. **`[]`**: Fallback to empty array if neither exists
4. **`Array.isArray()`**: Final safety check to ensure it's always an array

---

## What This Fixes

### ✅ In LeavePage.jsx

#### Line 213 - Pending Leaves Badge
**Before**: `leaves?.filter is not a function`
```javascript
badge: leaves?.filter(l => l.status === 'pending')?.length || 0
```
**After**: ✅ Works correctly
```javascript
badge: leaves?.filter(l => l.status === 'pending')?.length || 0
// leaves is now always an array
```

#### Line 220 - Pending Approvals Table
**Before**: `leaves?.filter is not a function`
```javascript
data={leaves?.filter(l => l.status === 'pending') || []}
```
**After**: ✅ Works correctly
```javascript
data={leaves?.filter(l => l.status === 'pending') || []}
// leaves.filter() now works
```

#### Other Tables
**Before**: Might show wrong data or errors
```javascript
data={leaves || []}
```
**After**: ✅ Always shows array
```javascript
data={leaves || []}
// leaves is guaranteed to be an array
```

---

## Error Handling Improvements

### Added Array Reset on Error:
```javascript
catch (err) {
  setError(err.message);
  setLeaves([]); // ✅ NEW: Always reset to empty array on error
  throw err;
}
```

**Benefits**:
- Prevents stale data from previous successful calls
- Ensures UI always has valid array to work with
- Component doesn't crash if API call fails

---

## Data Flow

### 1. Component Mounts
```
LeavePage → useLeave() → fetchMyLeaves()
```

### 2. API Call
```
leaveService.getMyLeaves() → GET /api/leaves/my-leaves
```

### 3. Response
```
Backend: { success: true, data: { leaves: [...], pagination: {...} } }
↓
Axios Interceptor: Returns response.data
↓
Hook receives: { success: true, data: { leaves: [...] } }
```

### 4. Extraction
```javascript
const leavesArray = response?.data?.leaves || response?.leaves || [];
// leavesArray = [...]
```

### 5. State Update
```javascript
setLeaves(Array.isArray(leavesArray) ? leavesArray : []);
// leaves state = [...]
```

### 6. Component Render
```jsx
{leaves?.filter(l => l.status === 'pending')?.length}
// ✅ Works because leaves is an array
```

---

## Testing Checklist

### ✅ Leave Page
- [ ] Page loads without errors
- [ ] "My Leaves" tab shows leaves
- [ ] "Pending Approvals" tab shows filtered leaves
- [ ] "All Leaves" tab shows all leaves
- [ ] Badge count shows correct number
- [ ] No console errors about `.filter`

### ✅ Filter Operations
- [ ] Status filter works
- [ ] Can filter pending leaves
- [ ] Can filter approved leaves
- [ ] Can filter rejected leaves

### ✅ Error Handling
- [ ] Page doesn't crash if API fails
- [ ] Shows empty table when no data
- [ ] Error message displays when fetch fails

### ✅ Console Output
- [ ] No "filter is not a function" errors
- [ ] No "undefined" errors
- [ ] Data logs show arrays

---

## Files Modified

1. ✅ `client/src/Hooks/useLeave.js`
   - Fixed `useLeave()` comprehensive hook:
     - `fetchMyLeaves()` - extracts array
     - `fetchPendingLeaves()` - extracts array
     - `fetchAllLeaves()` - extracts array
     - Added error state reset to `[]`
   
   - Fixed individual hooks:
     - `useMyLeaves()` - proper array extraction
     - `useAllLeaves()` - proper array extraction
     - `usePendingLeaves()` - proper array extraction
     - Added fallback to empty array on error

---

## Similar Patterns Fixed

This same fix applies to all hooks that receive nested API responses:

### ✅ Pattern to Follow:
```javascript
// DO THIS:
const response = await service.getData();
const dataArray = response?.data?.items || response?.items || [];
setData(Array.isArray(dataArray) ? dataArray : []);

// NOT THIS:
const response = await service.getData();
setData(response); // ❌ Might set entire object
```

### Already Fixed:
- ✅ `useAttendance` hooks (AttendancePage fix)
- ✅ `useLeave` hooks (This fix)
- ✅ `useEmployee` hooks (Dashboard fix)

---

## Prevention

### Rule for All Hooks:
1. **Always extract arrays** from nested responses
2. **Always validate** with `Array.isArray()`
3. **Always fallback** to empty array `[]`
4. **Always reset** to `[]` on error

### Template:
```javascript
const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    const response = await service.get();
    const dataArray = response?.data?.items || response?.items || [];
    setData(Array.isArray(dataArray) ? dataArray : []);
    return response;
  } catch (err) {
    setError(err.message);
    setData([]); // Important: Reset to empty array
    throw err;
  } finally {
    setLoading(false);
  }
}, []);
```

---

*Last Updated: October 16, 2025*
