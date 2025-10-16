# Attendance Table Fix - Data Display

## Issue Fixed
The attendance table wasn't showing data because the column `key` properties didn't match the actual data structure from the API.

---

## API Response Structure

### Employee's Own Attendance (`/api/attendance/my-attendance`)
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "_id": "68f083e97ea436da94a4d2d8",
        "employee": {
          "_id": "68efede6b3da22092a17f3fe",
          "name": "Priyanshu",
          "email": "kumarpriyanshu287@gmail.com",
          "department": "Engineering",
          "employeeId": "EMP00002"
        },
        "date": "2025-10-15T18:30:00.000Z",
        "totalWorkHours": 0,
        "totalWorkHoursDecimal": "0.00",
        "status": "present",
        "sessions": [
          {
            "checkIn": "2025-10-16T05:34:33.796Z",
            "checkOut": null,
            "duration": 0
          }
        ]
      }
    ],
    "stats": {
      "totalDays": 1,
      "totalWorkHours": "0.00",
      "averageWorkHours": "0.00",
      "presentDays": 1,
      "absentDays": 0,
      "halfDays": 0
    }
  }
}
```

---

## Updated Table Columns

### 1. Employee Column
**Before**: 
```javascript
key: 'employeeName' // ❌ This field doesn't exist
```

**After**:
```javascript
key: 'employee'
render: (value, row) => (
  <div>
    <p>{row.employee?.name || 'N/A'}</p>
    <p className="text-sm">{row.employee?.email}</p>
    <p className="text-xs">ID: {row.employee?.employeeId}</p>
  </div>
)
```

**Displays**:
- ✅ Employee name (from `employee.name`)
- ✅ Employee email (from `employee.email`)
- ✅ Employee ID (from `employee.employeeId`)

---

### 2. Date Column (NEW)
```javascript
key: 'date'
render: (value) => new Date(value).toLocaleDateString()
```

**Displays**: 
- ✅ Date of attendance record (e.g., "10/16/2025")

---

### 3. Check In Column
**Before**: 
```javascript
key: 'checkIn' // ❌ Doesn't exist at root level
```

**After**:
```javascript
key: 'sessions'
render: (value, row) => {
  const lastSession = row.sessions?.[row.sessions.length - 1];
  return lastSession?.checkIn 
    ? new Date(lastSession.checkIn).toLocaleTimeString() 
    : '-';
}
```

**Displays**: 
- ✅ Latest check-in time (from `sessions[last].checkIn`)
- ✅ Shows "-" if no sessions

---

### 4. Check Out Column
**Before**: 
```javascript
key: 'checkOut' // ❌ Doesn't exist at root level
```

**After**:
```javascript
key: 'sessions'
render: (value, row) => {
  const lastSession = row.sessions?.[row.sessions.length - 1];
  return lastSession?.checkOut 
    ? new Date(lastSession.checkOut).toLocaleTimeString() 
    : lastSession?.checkIn ? 'Still Checked In' : '-';
}
```

**Displays**: 
- ✅ Latest check-out time (from `sessions[last].checkOut`)
- ✅ "Still Checked In" if checked in but not out
- ✅ "-" if no sessions

---

### 5. Hours Column
**Before**: 
```javascript
key: 'totalHours' // ❌ Field is 'totalWorkHoursDecimal'
```

**After**:
```javascript
key: 'totalWorkHoursDecimal'
render: (value, row) => {
  return value && parseFloat(value) > 0 
    ? `${parseFloat(value).toFixed(2)}h` 
    : row.sessions?.some(s => !s.checkOut) 
    ? 'In Progress' 
    : '0.00h';
}
```

**Displays**: 
- ✅ Total work hours (e.g., "8.50h")
- ✅ "In Progress" if currently checked in
- ✅ "0.00h" if no work hours yet

---

### 6. Sessions Column (NEW)
```javascript
key: 'sessions'
render: (value, row) => (
  <Badge variant="info">{row.sessions?.length || 0}</Badge>
)
```

**Displays**: 
- ✅ Number of check-in/check-out sessions
- ✅ Helps identify multiple sessions in one day

---

### 7. Status Column
**Enhanced**:
```javascript
key: 'status'
render: (value) => (
  <Badge variant={...}>
    {value?.replace('-', ' ').toUpperCase() || 'N/A'}
  </Badge>
)
```

**Displays**: 
- ✅ PRESENT (green)
- ✅ LATE (yellow/warning)
- ✅ ABSENT (red/danger)
- ✅ WORK FROM HOME (blue/info)
- ✅ HALF DAY (yellow/warning)

---

## Updated Statistics Cards

### For Employees (with API Stats)
Shows enriched statistics from the API response:

#### Card 1: Total Days
- **Main**: Number of attendance records
- **Sub**: Total days recorded from API

#### Card 2: Present Days
- **Main**: Number of present days
- **Sub**: Attendance percentage

#### Card 3: Late/Half Day
- **Main**: Combined late and half-day count
- **Sub**: Number of half days

#### Card 4: Total Hours
- **Main**: Total work hours from API
- **Sub**: Average hours per day

### For HR/Admin
Shows summary statistics:

#### Card 1: Total Employees
- **Main**: Number of attendance records today

#### Card 2: Present
- **Main**: Number of present employees
- **Sub**: Attendance percentage

#### Card 3: Late/Half Day
- **Main**: Combined count

#### Card 4: Absent
- **Main**: Number of absent employees

---

## Example Table Display

| Employee | Date | Check In | Check Out | Hours | Sessions | Status |
|----------|------|----------|-----------|-------|----------|--------|
| **Priyanshu**<br>kumarpriyanshu287@gmail.com<br>ID: EMP00002 | 10/16/2025 | 11:04:33 AM | Still Checked In | In Progress | 1 | PRESENT |
| **John Doe**<br>john@example.com<br>ID: EMP00001 | 10/16/2025 | 9:00:00 AM | 5:30:00 PM | 8.50h | 1 | PRESENT |
| **Jane Smith**<br>jane@example.com<br>ID: EMP00003 | 10/16/2025 | 9:30:00 AM | 2:00:00 PM | 4.50h | 1 | HALF DAY |

---

## Data Flow

1. **Component Mounts**
   - Checks if user is HR/Admin
   - Fetches appropriate data:
     - Employee → `useAttendanceRecords()` → `/api/attendance/my-attendance`
     - HR/Admin → `useTodaySummary()` → `/api/attendance/today-summary`

2. **Data Extraction**
   ```javascript
   // For employees
   const attendanceData = myRecords; // Already extracted in hook
   
   // For HR
   const attendanceData = todaySummary?.data?.records || todaySummary?.records || [];
   ```

3. **Table Renders**
   - Maps through `filteredAttendance` array
   - Each column's `render` function gets the full row object
   - Extracts nested data (employee.name, sessions[0].checkIn, etc.)

4. **Stats Update**
   - `calculateStats()` counts records by status
   - For employees: Also uses `apiStats` for totals and averages
   - Updates state → triggers re-render

---

## Console Debug Output

When component loads, you'll see in console:
```javascript
📊 Attendance Data: {
  isHROrAdmin: false,
  attendanceLength: 1,
  firstRecord: {
    _id: "68f083e97ea436da94a4d2d8",
    employee: { name: "Priyanshu", ... },
    sessions: [...],
    status: "present"
  },
  apiStats: {
    totalDays: 1,
    totalWorkHours: "0.00",
    averageWorkHours: "0.00",
    presentDays: 1
  }
}
```

This helps verify:
- ✅ Data is being fetched
- ✅ Employee info is populated
- ✅ Sessions are present
- ✅ Stats are calculated

---

## Testing Checklist

### ✅ Visual Display
- [ ] Employee name shows in table
- [ ] Employee email shows below name
- [ ] Employee ID shows as "ID: EMP00XXX"
- [ ] Date shows in local format
- [ ] Check-in time shows correctly
- [ ] Check-out time shows or "Still Checked In"
- [ ] Hours show as "X.XXh" or "In Progress"
- [ ] Sessions count shows as badge
- [ ] Status badge shows with correct color

### ✅ Statistics Cards
- [ ] Total days shows correct count
- [ ] Present days shows with percentage
- [ ] Late/Half day combines both counts
- [ ] Total hours shows for employees (with avg)
- [ ] All numbers update when data changes

### ✅ Functionality
- [ ] Date filter works
- [ ] Status filter works
- [ ] Check-in button works
- [ ] Check-out button works
- [ ] Table updates after check-in/out
- [ ] Stats recalculate after actions

---

## Common Issues & Solutions

### Issue: Table shows "No attendance records found"
**Cause**: Data not being extracted correctly  
**Check**: Console debug output - is `attendanceLength > 0`?  
**Fix**: Verify `myRecords` or `todaySummary?.data?.records` has data

### Issue: Employee name shows "N/A"
**Cause**: `employee` field is null or not populated  
**Check**: API response - does `employee` object exist?  
**Fix**: Ensure backend `.populate('employee', '...')` is called

### Issue: Check-in/out times don't show
**Cause**: `sessions` array is empty or wrong index  
**Check**: Console log `firstRecord.sessions`  
**Fix**: Verify `sessions` array exists and has `checkIn` property

### Issue: Hours show "0.00h" when checked in
**Cause**: `checkOut` is null, so duration is 0  
**Expected**: Should show "In Progress"  
**Fix**: Already fixed in render function - checks for open sessions

### Issue: Stats don't match API response
**Cause**: `apiStats` not being used  
**Check**: Console log shows `apiStats`?  
**Fix**: Verify `stats` is extracted from `useAttendanceRecords` hook

---

## Files Modified

1. ✅ `client/src/pages/Attendance/AttendancePage.jsx`
   - Updated all table column keys to match API response
   - Added nested data extraction (employee.name, sessions[].checkIn)
   - Enhanced status display with all status types
   - Added sessions count column
   - Added date column
   - Updated stats cards to use API stats
   - Added debug logging

---

*Last Updated: October 16, 2025*
