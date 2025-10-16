const Leave = require("../models/Leave.js");
const Employee = require("../models/Employee.js");
const Policy = require("../models/Policy.js");

/**
 * Apply for Leave
 * POST /leaves/apply
 */
exports.applyLeave = async (req, res) => {
  try {
    const employeeId = req.body.employeeId || req.user.employeeId || req.user._id;
    const { leaveType, fromDate, toDate, reason, attachments } = req.body;


    // Validate required fields
    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "Leave type, dates, and reason are required"
      });
    }

    // Get employee and check leave balance
    const employee = await Employee.findById(employeeId);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Parse dates - handle multiple formats (DD-MM-YYYY, YYYY-MM-DD, ISO)
    const parseDate = (dateStr) => {
      // If already a date object, return it
      if (dateStr instanceof Date) return dateStr;
      
      // Check if DD-MM-YYYY format (12-10-2025)
      if (typeof dateStr === 'string' && dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [day, month, year] = dateStr.split('-');
        return new Date(`${year}-${month}-${day}`);
      }
      
      // Otherwise, try standard Date parsing (handles YYYY-MM-DD, ISO format)
      return new Date(dateStr);
    };

    const from = parseDate(fromDate);
    const to = parseDate(toDate);

    // Validate dates
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use DD-MM-YYYY, YYYY-MM-DD, or ISO format"
      });
    }

    if (to < from) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date"
      });
    }

    // Calculate number of days (pre-save hook will also calculate, but we need it for validation)
    const timeDiff = Math.abs(to.getTime() - from.getTime());
    const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Inclusive of both start and end date
    
    // Create leave application
    const leave = new Leave({
      employee: employeeId,
      leaveType,
      fromDate: from,
      toDate: to,
      reason,
      attachments: attachments || [],
      numberOfDays
    });

    await leave.save();

    // Check if employee has sufficient balance
    const balance = employee.getLeaveBalance(leaveType);
    
    if (!balance) {
      return res.status(400).json({
        success: false,
        message: `Leave type '${leaveType}' not found in your leave balance. Please contact HR.`,
        data: leave
      });
    }

    if (balance.available < leave.numberOfDays) {
      return res.status(400).json({
        success: false,
        message: `Insufficient leave balance. Available: ${balance.available} days, Requested: ${leave.numberOfDays} days`,
        data: leave
      });
    }

    res.status(201).json({
      success: true,
      message: "Leave application submitted successfully",
      data: leave
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get My Leaves
 * GET /leaves/my-leaves?status=pending
 */
exports.getMyLeaves = async (req, res) => {
  try {
    const employeeId = req.user.employeeId || req.user._id;
    const { status, year } = req.query;

    const query = { employee: employeeId };
    
    if (status) {
      query.status = status;
    }

    if (year) {
      query.fromDate = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      };
    }

    const leaves = await Leave.find(query)
      .sort({ appliedOn: -1 })
      .populate('approvedBy', 'name email employeeId')
      .populate('employee', 'name email employeeId department');

    res.status(200).json({
      success: true,
      data: leaves
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Leave Balance
 * GET /leaves/balance
 */
exports.getLeaveBalance = async (req, res) => {
  try {
    const employeeId = req.user.employeeId || req.user._id;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Get leave statistics for current year
    const currentYear = new Date().getFullYear();
    const leaves = await Leave.find({
      employee: employeeId,
      status: 'approved',
      fromDate: {
        $gte: new Date(`${currentYear}-01-01`),
        $lte: new Date(`${currentYear}-12-31`)
      }
    });

    const leaveStats = {};
    leaves.forEach(leave => {
      if (!leaveStats[leave.leaveType]) {
        leaveStats[leave.leaveType] = 0;
      }
      leaveStats[leave.leaveType] += leave.numberOfDays;
    });

    res.status(200).json({
      success: true,
      data: {
        balances: employee.leaveBalances,
        usedThisYear: leaveStats
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
 * Get All Leaves (HR/Admin/Manager)
 * GET /leaves/all?status=pending&department=Engineering
 */
exports.getAllLeaves = async (req, res) => {
  try {
    const { status, department, leaveType, page = 1, limit = 50 } = req.query;

    const pipeline = [];
    let matchStage = {};

    if (status) matchStage.status = status;
    if (leaveType) matchStage.leaveType = leaveType;

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push(
      {
        $lookup: {
          from: 'employees',
          localField: 'employee',
          foreignField: '_id',
          as: 'employeeData'
        }
      },
      { $unwind: '$employeeData' }
    );

    if (department) {
      pipeline.push({
        $match: { 'employeeData.department': department }
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: 'employees',
          localField: 'approvedBy',
          foreignField: '_id',
          as: 'approverData'
        }
      },
      { $sort: { appliedOn: -1 } },
      { $skip: (page - 1) * parseInt(limit) },
      { $limit: parseInt(limit) }
    );

    const leaves = await Leave.aggregate(pipeline);
    const total = await Leave.countDocuments(matchStage);

    res.status(200).json({
      success: true,
      data: {
        leaves,
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
 * Get Pending Leaves (HR/Manager)
 * GET /leaves/pending
 */
exports.getPendingLeaves = async (req, res) => {
  try {
    const { department } = req.query;
    
    const query = { status: 'pending' };

    const leaves = await Leave.find(query)
      .populate('employee', 'name email employeeId department designation')
      .sort({ appliedOn: 1 });

    // Filter by department if specified
    let filteredLeaves = leaves;
    if (department) {
      filteredLeaves = leaves.filter(leave => leave.employee.department === department);
    }

    res.status(200).json({
      success: true,
      data: filteredLeaves
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Approve Leave (HR/Admin/Manager)
 * PUT /leaves/:id/approve
 */
exports.approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const approverId = req.user.employeeId || req.user._id;

    const leave = await Leave.findById(id).populate('employee');
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found"
      });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Leave is already ${leave.status}`
      });
    }

    // Approve the leave
    await leave.approve(approverId);

    // Update employee leave balance
    const employee = await Employee.findById(leave.employee._id);
    await employee.updateLeaveBalance(leave.leaveType, leave.numberOfDays);

    res.status(200).json({
      success: true,
      message: "Leave approved successfully",
      data: leave
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Reject Leave (HR/Admin/Manager)
 * PUT /leaves/:id/reject
 */
exports.rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const approverId = req.user.employeeId || req.user._id;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      });
    }

    const leave = await Leave.findById(id);
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found"
      });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Leave is already ${leave.status}`
      });
    }

    await leave.reject(approverId, reason);

    res.status(200).json({
      success: true,
      message: "Leave rejected",
      data: leave
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Cancel Leave
 * DELETE /leaves/:id/cancel
 */
exports.cancelLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.user.employeeId || req.user._id;

    const leave = await Leave.findById(id);
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found"
      });
    }

    // Check if the leave belongs to the user
    if (leave.employee.toString() !== employeeId.toString() && req.user.role !== 'admin' && req.user.role !== 'hr') {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own leaves"
      });
    }

    if (leave.status === 'pending') {
      // Simply delete pending leaves
      await Leave.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: "Leave application deleted successfully"
      });
    }

    // Cancel approved leave and restore balance
    await leave.cancel();
    
    if (leave.status === 'approved') {
      const employee = await Employee.findById(leave.employee);
      await employee.updateLeaveBalance(leave.leaveType, -leave.numberOfDays);
    }

    res.status(200).json({
      success: true,
      message: "Leave cancelled successfully",
      data: leave
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Add Comment to Leave
 * POST /leaves/:id/comment
 */
exports.addLeaveComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const employeeId = req.user.employeeId || req.user._id;

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment is required"
      });
    }

    const leave = await Leave.findById(id);
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found"
      });
    }

    leave.comments.push({
      by: employeeId,
      comment,
      timestamp: new Date()
    });

    await leave.save();

    const updatedLeave = await Leave.findById(id)
      .populate('comments.by', 'name email employeeId');

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      data: updatedLeave
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Leave Statistics (HR/Admin)
 * GET /leaves/statistics?year=2025
 */
exports.getLeaveStatistics = async (req, res) => {
  try {
    const { year = new Date().getFullYear(), department } = req.query;

    const pipeline = [
      {
        $match: {
          fromDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      }
    ];

    if (department) {
      pipeline.push(
        {
          $lookup: {
            from: 'employees',
            localField: 'employee',
            foreignField: '_id',
            as: 'employeeData'
          }
        },
        { $unwind: '$employeeData' },
        {
          $match: { 'employeeData.department': department }
        }
      );
    }

    pipeline.push({
      $group: {
        _id: {
          leaveType: '$leaveType',
          status: '$status'
        },
        count: { $sum: 1 },
        totalDays: { $sum: '$numberOfDays' }
      }
    });

    const stats = await Leave.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: {
        year: parseInt(year),
        department: department || 'All',
        statistics: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
