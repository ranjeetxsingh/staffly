# Database Migration & Helper Scripts

This folder contains utility scripts for database management and testing.

## Available Scripts

### 1. Fix Attendance Data
**File**: `fixAttendanceData.js`

Fixes common attendance data issues:
- Creates missing Employee records for existing Users
- Identifies attendance records with null employee references
- Verifies all employee references are valid
- Reports current role distribution

```bash
node server/utils/fixAttendanceData.js
```

**What it does**:
1. ✅ Creates Employee records for Users without them
2. ⚠️ Reports attendance records with null employees (needs manual fix)
3. ✅ Validates all employee references
4. 📊 Shows summary of roles and data

**Safe to run**: Yes, it only creates missing records and reports issues.

---

### 2. Create HR User
**File**: `createHRUser.js`

Creates a test HR user with proper roles for testing.

```bash
node server/utils/createHRUser.js
```

**What it does**:
1. ✅ Creates User account with admin role
2. ✅ Creates Employee record with 'hr' role
3. ✅ Sets up proper permissions for HR features

**Default Credentials**:
- Email: `hr@staffly.com`
- Password: `hr123456`
- User Role: `admin`
- Employee Role: `hr`

**⚠️ Important**: Change the password after first login!

---

## Common Tasks

### Create a New HR User
1. Open `createHRUser.js`
2. Edit the `hrData` object:
   ```javascript
   const hrData = {
     name: 'Your Name',
     email: 'your.email@company.com',
     password: 'temporary_password',
     role: 'admin',
     department: 'Human Resources',
     designation: 'HR Manager',
     employeeId: 'HR001'
   };
   ```
3. Run: `node server/utils/createHRUser.js`

### Upgrade Existing User to HR
```javascript
// In MongoDB shell or using a script:

// 1. Update Employee role
await Employee.findOneAndUpdate(
  { email: 'user@example.com' },
  { $set: { role: 'hr' } }
);

// 2. Optionally update User role
await User.findOneAndUpdate(
  { email: 'user@example.com' },
  { $set: { role: 'admin' } }
);
```

### Delete Attendance Records with Null Employee
```javascript
// Only run this if you're sure!
await Attendance.deleteMany({ employee: null });
```

---

## Role System Explained

### User Model Roles
Used for **authentication** and basic permissions:
- `employee` - Regular user
- `admin` - System administrator

### Employee Model Roles
Used for **HR operations** and detailed permissions:
- `employee` - Regular employee
- `hr` - Human Resources staff
- `admin` - HR Administrator
- `manager` - Department manager

### How They Work Together
1. **Authentication**: JWT token contains User._id
2. **Authorization**: `protect` middleware loads both User and Employee
3. **Permission Check**: `hrOnly` checks both roles
   - `User.role === 'admin'` → ✅ Access granted
   - `Employee.role === 'hr'` → ✅ Access granted
   - `Employee.role === 'admin'` → ✅ Access granted
   - Otherwise → ❌ 403 Forbidden

---

## Troubleshooting

### "Employee record not found" during check-in
**Cause**: User exists but no Employee record  
**Fix**: Run `fixAttendanceData.js` to create missing Employee records

### HR user getting 403 on HR endpoints
**Cause**: Employee.role is 'employee' not 'hr'  
**Fix**: 
```javascript
await Employee.findOneAndUpdate(
  { email: 'hr@example.com' },
  { $set: { role: 'hr' } }
);
```

### Attendance records showing "employee: null"
**Cause**: Records created before fix or invalid employee ID  
**Fix**: 
1. Run `fixAttendanceData.js` to identify issues
2. Delete invalid records or manually reassign

### Can't log in with HR credentials
**Cause**: User account doesn't exist  
**Fix**: Run `createHRUser.js` to create the account

---

## Script Output Examples

### fixAttendanceData.js
```
✅ Connected to MongoDB

📋 Step 1: Creating missing Employee records...
  ✅ Created Employee record for: john@example.com
  ✅ Created Employee record for: jane@example.com
✅ Created 2 new Employee records

📋 Step 2: Fixing Attendance records with null employee...
  Found 1 attendance records with null employee
  ⚠️  Warning: Found attendance records with null employee

📋 Step 3: Verifying employee references...
  ✅ All attendance records have valid employee references

📋 Step 4: Checking Employee roles...
Current Employee Roles:
{ employee: 5, hr: 2, admin: 1 }

============================================================
📊 SUMMARY
============================================================
Total Users: 8
Total Employees: 8
New Employees Created: 2
Attendance with null employee: 1
Invalid employee references: 0
============================================================

✅ Migration complete!
```

### createHRUser.js
```
✅ Connected to MongoDB

📋 Creating HR User...
Name: HR Manager
Email: hr@staffly.com
Password: hr123456
⚠️  Remember to change the password after first login!

✅ Created User account
✅ Created Employee record

============================================================
✅ HR User Created Successfully!
============================================================
Login Credentials:
  Email: hr@staffly.com
  Password: hr123456
  User Role: admin
  Employee Role: hr
============================================================

⚠️  IMPORTANT: Change the password after first login!
```

---

## Best Practices

1. **Always backup** your database before running migration scripts
2. **Test in development** before running in production
3. **Change default passwords** immediately after creating test users
4. **Review logs** from scripts to identify data issues
5. **Keep Employee and User emails in sync** - they're linked by email

---

## Need More Help?

See the main documentation:
- `ATTENDANCE_FIX_SUMMARY.md` - Complete attendance system fix details
- `REFACTORING_SUMMARY.md` - Architecture refactoring documentation
- `API_RESPONSE_FIX.md` - API response handling fixes

---

*Last Updated: October 16, 2025*
