const Attendance = require("../models/Attendance.js");
const Employee = require("../models/Employee.js");

/**
 * Employee Check-In
 * POST /attendance/check-in
 */
exports.checkIn = async (req, res) => {
  try {
    // Get employee ID from the employee object attached by protect middleware
    const employeeId = req.employee?._id || req.user.employeeId;
    
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee record not found. Please contact HR to create your employee profile."
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create today's attendance record
    let attendance = await Attendance.findOne({
      employee: employeeId,
      date: today
    });

    if (!attendance) {
      attendance = new Attendance({
        employee: employeeId,
        date: today
      });
    }

    // Check in
    await attendance.checkIn();
    
    // Populate employee data before sending response
    await attendance.populate('employee', 'name email employeeId department');

    res.status(200).json({
      success: true,
      message: "Checked in successfully",
      data: attendance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Employee Check-Out
 * POST /attendance/check-out
 */
exports.checkOut = async (req, res) => {
  try {
    // Get employee ID from the employee object attached by protect middleware
    const employeeId = req.employee?._id || req.user.employeeId;
    
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee record not found. Please contact HR to create your employee profile."
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: today
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No check-in found for today"
      });
    }

    await attendance.checkOut();
    
    // Populate employee data before sending response
    await attendance.populate('employee', 'name email employeeId department');

    res.status(200).json({
      success: true,
      message: "Checked out successfully",
      data: {
        attendance,
        totalWorkHours: attendance.totalWorkHoursDecimal,
        sessions: attendance.sessions
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
 * Get My Attendance
 * GET /attendance/my-attendance?month=10&year=2025
 */
exports.getMyAttendance = async (req, res) => {
  try {
    // Get employee ID from the employee object attached by protect middleware
    const employeeId = req.employee?._id || req.user.employeeId || req.user._id;
    const { month, year, startDate, endDate } = req.query;

    let query = { employee: employeeId };

    // Filter by month/year or date range
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      query.date = { $gte: start, $lte: end };
    } else if (startDate && endDate) {
      query.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    const attendanceRecords = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('employee', 'name email employeeId department');

    // Calculate statistics
    const stats = {
      totalDays: attendanceRecords.length,
      totalWorkHours: (attendanceRecords.reduce((sum, record) => sum + record.totalWorkHours, 0) / 60).toFixed(2),
      averageWorkHours: 0,
      presentDays: attendanceRecords.filter(r => r.status === 'present').length,
      absentDays: attendanceRecords.filter(r => r.status === 'absent').length,
      halfDays: attendanceRecords.filter(r => r.status === 'half-day').length
    };
    
    if (stats.totalDays > 0) {
      stats.averageWorkHours = (stats.totalWorkHours / stats.totalDays).toFixed(2);
    }

    res.status(200).json({
      success: true,
      data: {
        records: attendanceRecords,
        stats
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
 * Get Attendance by Employee ID (HR/Admin)
 * GET /attendance/employee/:employeeId?month=10&year=2025
 */
exports.getAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year, startDate, endDate } = req.query;

    let query = { employee: employeeId };

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      query.date = { $gte: start, $lte: end };
    } else if (startDate && endDate) {
      query.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    const attendanceRecords = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('employee', 'name email employeeId department designation');

    res.status(200).json({
      success: true,
      data: attendanceRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get All Attendance (HR/Admin)
 * GET /attendance/all?page=1&limit=50&department=Engineering
 */
exports.getAllAttendance = async (req, res) => {
  try {
    const { page = 1, limit = 50, department, status, date } = req.query;
    
    let query = {};
    
    // Filter by date
    if (date) {
      const filterDate = new Date(date);
      filterDate.setHours(0, 0, 0, 0);
      query.date = filterDate;
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }

    // Build the aggregation pipeline
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'employees',
          localField: 'employee',
          foreignField: '_id',
          as: 'employeeData'
        }
      },
      { $unwind: '$employeeData' }
    ];

    // Filter by department if specified
    if (department) {
      pipeline.push({
        $match: { 'employeeData.department': department }
      });
    }

    pipeline.push(
      { $sort: { date: -1 } },
      { $skip: (page - 1) * parseInt(limit) },
      { $limit: parseInt(limit) }
    );

    const records = await Attendance.aggregate(pipeline);
    const total = await Attendance.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        records,
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
 * Get Today's Attendance Summary (HR/Admin)
 * GET /attendance/today-summary
 */
exports.getTodaySummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecords = await Attendance.find({ date: today })
      .populate('employee', 'name email employeeId department');

    const totalEmployees = await Employee.countDocuments({ status: 'active' });
    
    const summary = {
      date: today,
      totalEmployees,
      present: attendanceRecords.filter(r => r.sessions.length > 0).length,
      absent: totalEmployees - attendanceRecords.length,
      onLeave: 0, // Can be calculated from Leave model
      checkedIn: attendanceRecords.filter(r => r.sessions.some(s => !s.checkOut)).length,
      checkedOut: attendanceRecords.filter(r => r.sessions.every(s => s.checkOut)).length,
      records: attendanceRecords
    };

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Monthly Report (HR/Admin)
 * GET /attendance/monthly-report?month=10&year=2025&department=Engineering
 */
exports.getMonthlyReport = async (req, res) => {
  try {
    const { month, year, department } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required"
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const pipeline = [
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'employee',
          foreignField: '_id',
          as: 'employeeData'
        }
      },
      { $unwind: '$employeeData' }
    ];

    if (department) {
      pipeline.push({
        $match: { 'employeeData.department': department }
      });
    }

    pipeline.push({
      $group: {
        _id: '$employee',
        employeeName: { $first: '$employeeData.name' },
        employeeId: { $first: '$employeeData.employeeId' },
        department: { $first: '$employeeData.department' },
        totalDays: { $sum: 1 },
        totalWorkHours: { $sum: '$totalWorkHours' },
        presentDays: {
          $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
        },
        absentDays: {
          $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] }
        },
        halfDays: {
          $sum: { $cond: [{ $eq: ['$status', 'half-day'] }, 1, 0] }
        }
      }
    });

    const report = await Attendance.aggregate(pipeline);

    // Convert minutes to hours
    report.forEach(r => {
      r.totalWorkHours = (r.totalWorkHours / 60).toFixed(2);
      r.averageWorkHours = (r.totalWorkHours / r.totalDays).toFixed(2);
    });

    res.status(200).json({
      success: true,
      data: {
        month: parseInt(month),
        year: parseInt(year),
        department: department || 'All',
        report
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
 * Update Attendance Status (HR/Admin)
 * PUT /attendance/:id/status
 */
exports.updateAttendanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const attendance = await Attendance.findById(id);
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found"
      });
    }

    attendance.status = status;
    if (notes) attendance.notes = notes;
    
    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Attendance status updated successfully",
      data: attendance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
