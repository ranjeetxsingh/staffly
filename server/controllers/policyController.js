const Policy = require("../models/Policy.js");
const Employee = require("../models/Employee.js");

/**
 * Get Active Leave Policy
 * GET /policies/leave/active
 */
exports.getActiveLeavePolicy = async (req, res) => {
  try {
    const policy = await Policy.getActiveLeavePolicy();

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "No active leave policy found"
      });
    }

    res.status(200).json({
      success: true,
      data: policy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Active Attendance Policy
 * GET /policies/attendance/active
 */
exports.getActiveAttendancePolicy = async (req, res) => {
  try {
    const policy = await Policy.getActiveAttendancePolicy();

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "No active attendance policy found"
      });
    }

    res.status(200).json({
      success: true,
      data: policy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get All Policies
 * GET /policies?category=leave&isActive=true
 */
exports.getPolicies = async (req, res) => {
  try {
    const { category, isActive } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const policies = await Policy.find(query)
      .sort({ effectiveFrom: -1 })
      .populate('createdBy', 'name email employeeId')
      .populate('lastModifiedBy', 'name email employeeId');

    res.status(200).json({
      success: true,
      data: policies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Policy by ID
 * GET /policies/:id
 */
exports.getPolicyById = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await Policy.findById(id)
      .populate('createdBy', 'name email employeeId')
      .populate('lastModifiedBy', 'name email employeeId');

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found"
      });
    }

    res.status(200).json({
      success: true,
      data: policy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Create New Policy (Admin only)
 * POST /policies
 */
exports.addPolicy = async (req, res) => {
  try {
    const policyData = req.body;
    const creatorId = req.user.employeeId || req.user._id;

    // If setting as active, deactivate other policies of same category
    if (policyData.isActive) {
      await Policy.updateMany(
        { category: policyData.category, isActive: true },
        { isActive: false }
      );
    }

    const policy = new Policy({
      ...policyData,
      createdBy: creatorId,
      lastModifiedBy: creatorId
    });

    await policy.save();

    res.status(201).json({
      success: true,
      message: "Policy created successfully",
      data: policy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update Policy (Admin only)
 * PUT /policies/:id
 */
exports.updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const modifierId = req.user.employeeId || req.user._id;

    const policy = await Policy.findById(id);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found"
      });
    }

    // If setting as active, deactivate other policies of same category
    if (updates.isActive && !policy.isActive) {
      await Policy.updateMany(
        { category: policy.category, isActive: true, _id: { $ne: id } },
        { isActive: false }
      );
    }

    Object.assign(policy, updates);
    policy.lastModifiedBy = modifierId;
    
    await policy.save();

    res.status(200).json({
      success: true,
      message: "Policy updated successfully",
      data: policy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update Leave Type Quota (Admin only)
 * PUT /policies/:id/leave-type
 */
exports.updateLeaveTypeQuota = async (req, res) => {
  try {
    const { id } = req.params;
    const { leaveType, annualQuota, carryForward, maxCarryForward, description } = req.body;
    const modifierId = req.user.employeeId || req.user._id;

    if (!leaveType || annualQuota === undefined) {
      return res.status(400).json({
        success: false,
        message: "Leave type and annual quota are required"
      });
    }

    const policy = await Policy.findById(id);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found"
      });
    }

    if (policy.category !== 'leave') {
      return res.status(400).json({
        success: false,
        message: "This endpoint is only for leave policies"
      });
    }

    await policy.updateLeaveType({
      leaveType,
      annualQuota,
      carryForward: carryForward !== undefined ? carryForward : false,
      maxCarryForward: maxCarryForward || 0,
      description
    });

    policy.lastModifiedBy = modifierId;
    await policy.save();

    res.status(200).json({
      success: true,
      message: "Leave type quota updated successfully",
      data: policy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete Policy (Admin only)
 * DELETE /policies/:id
 */
exports.deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await Policy.findById(id);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found"
      });
    }

    if (policy.isActive) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete active policy. Please deactivate it first or activate another policy."
      });
    }

    await Policy.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Policy deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Apply Policy to All Employees (Admin only)
 * POST /policies/:id/apply-to-employees
 */
exports.applyPolicyToEmployees = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await Policy.findById(id);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found"
      });
    }

    if (policy.category !== 'leave') {
      return res.status(400).json({
        success: false,
        message: "This operation is only for leave policies"
      });
    }

    if (!policy.isActive) {
      return res.status(400).json({
        success: false,
        message: "Only active policies can be applied to employees"
      });
    }

    // Get all active employees
    const employees = await Employee.find({ status: 'active' });
    
    let successCount = 0;
    let errorCount = 0;

    for (const employee of employees) {
      try {
        employee.leaveBalances = policy.leaveTypes.map(lt => ({
          leaveType: lt.leaveType,
          total: lt.annualQuota,
          used: 0,
          available: lt.annualQuota,
          carriedForward: 0
        }));
        await employee.save();
        successCount++;
      } catch (error) {
        console.error(`Error updating employee ${employee.employeeId}:`, error.message);
        errorCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Policy applied to ${successCount} employees`,
      data: {
        totalEmployees: employees.length,
        successCount,
        errorCount
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
 * Deactivate Policy (Admin only)
 * PUT /policies/:id/deactivate
 */
exports.deactivatePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await Policy.findByIdAndUpdate(
      id,
      { 
        isActive: false,
        effectiveTo: new Date(),
        lastModifiedBy: req.user.employeeId || req.user._id
      },
      { new: true }
    );

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Policy deactivated successfully",
      data: policy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
