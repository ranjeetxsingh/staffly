const Employee = require("../models/Employee.js");
const User = require("../models/User.js");
const Policy = require("../models/Policy.js");
const Profile = require("../models/Profile.js");
const bcrypt = require("bcryptjs");

/**
 * Create New Employee
 * POST /employees
 * Also creates a User account for login
 */
exports.addEmployee = async (req, res) => {
  try {
    const { password, ...employeeData } = req.body;

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email: employeeData.email });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee with this email already exists"
      });
    }

    // Check if user account already exists
    const existingUser = await User.findOne({ email: employeeData.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User account with this email already exists"
      });
    }

    // Create Profile for the user
    const profile = new Profile({
      bio: `Employee in ${employeeData.department || 'Company'}`,
      phone: employeeData.phone
    });
    await profile.save();

    // Hash password - use provided password or generate default one
    const defaultPassword = password || "Employee@123"; // Default password if not provided
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // Create User account
    const user = new User({
      email: employeeData.email,
      password: hashedPassword,
      name: employeeData.name,
      role: employeeData.role || 'employee', // Use employee role from employeeData
      profile: profile._id,
      profilePicture: "https://www.pngitem.com/pimgs/m/146-1468479_transparent-avatar-png-default-avatar-png-transparent-png.png"
    });
    await user.save();

    // Create Employee record with user reference
    const employee = new Employee({
      ...employeeData,
      user: user._id
    });
    await employee.save();

    // Initialize leave balances from active policy
    await employee.initializeLeaveBalances();

    res.status(201).json({
      success: true,
      message: "Employee and user account created successfully",
      data: {
        employee,
        loginCredentials: {
          email: user.email,
          defaultPassword: !password ? "Employee@123" : "Custom password set",
          message: "Employee should change password after first login"
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get All Employees
 * GET /employees?department=Engineering&status=active&page=1&limit=50
 */
exports.getEmployees = async (req, res) => {
  try {
    const { department, status, role, page = 1, limit = 50, search } = req.query;

    let query = {};
    
    if (department) query.department = department;
    if (status) query.status = status;
    if (role) query.role = role;
    
    // Search by name, email, or employeeId
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    const employees = await Employee.find(query)
      .select('-salary') // Don't include salary in list view
      .populate('reportsTo', 'name email employeeId designation')
      .sort({ createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Employee.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        employees,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Employee by ID
 * GET /employees/:id
 */
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id)
      .populate('reportsTo', 'name email employeeId designation')
      .populate('user', 'email name profilePicture');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get My Profile
 * GET /employees/me
 */
exports.getMyProfile = async (req, res) => {
  try {
    const employeeId = req.user.employeeId || req.user._id;
    console.log("User",req.user);


    const employee = await User.findById(req.user._id);
    if (!employee) {
      return res.status(404).json({   
        success: false,
        message: "Employee profile not found"
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update Employee
 * PUT /employees/:id
 */
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent updating certain fields
    delete updates.employeeId;
    delete updates.leaveBalances;
    delete updates.createdAt;
    delete updates.updatedAt;

    const employee = await Employee.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('reportsTo', 'name email employeeId designation');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update My Profile
 * PUT /employees/me
 */
exports.updateMyProfile = async (req, res) => {
  try {
    const employeeId = req.user.employeeId || req.user._id;
    const updates = req.body;

    // Employees can only update certain fields
    const allowedUpdates = ['phone', 'address', 'emergencyContact'];
    const filteredUpdates = {};
    
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      filteredUpdates,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete Employee (Soft delete - set status to inactive)
 * DELETE /employees/:id
 */
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByIdAndUpdate(
      id,
      { status: 'terminated' },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee terminated successfully",
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Reinitialize Leave Balances
 * POST /employees/:id/initialize-leaves
 */
exports.reinitializeLeaveBalances = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    await employee.initializeLeaveBalances();

    res.status(200).json({
      success: true,
      message: "Leave balances reinitialized successfully",
      data: {
        leaveBalances: employee.leaveBalances
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update Leave Balance (HR/Admin only)
 * PUT /employees/:id/leave-balance
 */
exports.updateLeaveBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { leaveType, total, used, available, carriedForward } = req.body;

    const employee = await Employee.findById(id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Find the leave balance to update
    const leaveBalance = employee.leaveBalances.find(lb => lb.leaveType === leaveType);
    
    if (!leaveBalance) {
      return res.status(404).json({
        success: false,
        message: `Leave type '${leaveType}' not found in employee's leave balances`
      });
    }

    // Update the values if provided
    if (total !== undefined) leaveBalance.total = total;
    if (used !== undefined) leaveBalance.used = used;
    if (carriedForward !== undefined) leaveBalance.carriedForward = carriedForward;
    
    // Recalculate available
    leaveBalance.available = leaveBalance.total + leaveBalance.carriedForward - leaveBalance.used;

    await employee.save();

    res.status(200).json({
      success: true,
      message: "Leave balance updated successfully",
      data: {
        leaveBalances: employee.leaveBalances
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Employees by Department
 * GET /employees/department/:department
 */
exports.getEmployeesByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const { status = 'active' } = req.query;

    const employees = await Employee.find({ 
      department, 
      status 
    })
      .select('name email employeeId designation')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: {
        department,
        count: employees.length,
        employees
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Department List
 * GET /employees/departments/list
 */
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Employee.distinct('department');
    
    // Get count for each department
    const departmentStats = await Promise.all(
      departments.map(async (dept) => {
        const count = await Employee.countDocuments({ 
          department: dept, 
          status: 'active' 
        });
        return { department: dept, employeeCount: count };
      })
    );

    res.status(200).json({
      success: true,
      data: departmentStats.filter(d => d.department) // Remove null/undefined departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Employee Statistics (HR/Admin)
 * GET /employees/stats/overview
 */
exports.getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'active' });
    const inactiveEmployees = await Employee.countDocuments({ status: 'inactive' });
    const onLeave = await Employee.countDocuments({ status: 'on-leave' });
    const terminated = await Employee.countDocuments({ status: 'terminated' });

    // Department-wise breakdown
    const departmentBreakdown = await Employee.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Role-wise breakdown
    const roleBreakdown = await Employee.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          total: totalEmployees,
          active: activeEmployees,
          inactive: inactiveEmployees,
          onLeave,
          terminated
        },
        departmentBreakdown,
        roleBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
