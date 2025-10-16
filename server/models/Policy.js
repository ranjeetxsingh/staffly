const mongoose = require("mongoose");

// Sub-schema for leave type policies
const leaveTypeSchema = new mongoose.Schema({
  leaveType: {
    type: String,
    required: true,
    enum: ['sick', 'casual', 'annual', 'maternity', 'paternity', 'unpaid', 'compensatory']
  },
  annualQuota: {
    type: Number,
    required: true,
    default: 0
  },
  carryForward: {
    type: Boolean,
    default: false
  },
  maxCarryForward: {
    type: Number,
    default: 0
  },
  description: String
}, { _id: false });

const policySchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    category: {
      type: String,
      enum: ['leave', 'attendance', 'general', 'payroll', 'benefits'],
      default: 'general'
    },
    
    // Leave policy settings
    leaveTypes: [leaveTypeSchema],
    
    // Attendance policy settings
    workingHoursPerDay: {
      type: Number,
      default: 8 // in hours
    },
    workingDaysPerWeek: {
      type: Number,
      default: 5
    },
    weekendDays: {
      type: [String],
      default: ['Saturday', 'Sunday']
    },
    graceTimeMinutes: {
      type: Number,
      default: 15 // Grace period for late check-in
    },
    halfDayThreshold: {
      type: Number,
      default: 4 // Hours required for half-day
    },
    
    // General settings
    effectiveFrom: {
      type: Date,
      default: Date.now
    },
    effectiveTo: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Employee" 
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    }
  },
  { timestamps: true }
);

// Static method to get active leave policy
policySchema.statics.getActiveLeavePolicy = async function() {
  return await this.findOne({
    category: 'leave',
    isActive: true,
    effectiveFrom: { $lte: new Date() },
    $or: [
      { effectiveTo: { $exists: false } },
      { effectiveTo: { $gte: new Date() } }
    ]
  }).sort({ effectiveFrom: -1 });
};

// Static method to get active attendance policy
policySchema.statics.getActiveAttendancePolicy = async function() {
  return await this.findOne({
    category: 'attendance',
    isActive: true,
    effectiveFrom: { $lte: new Date() },
    $or: [
      { effectiveTo: { $exists: false } },
      { effectiveTo: { $gte: new Date() } }
    ]
  }).sort({ effectiveFrom: -1 });
};

// Method to add or update a leave type
policySchema.methods.updateLeaveType = function(leaveTypeData) {
  const existingIndex = this.leaveTypes.findIndex(
    lt => lt.leaveType === leaveTypeData.leaveType
  );
  
  if (existingIndex >= 0) {
    this.leaveTypes[existingIndex] = leaveTypeData;
  } else {
    this.leaveTypes.push(leaveTypeData);
  }
  
  return this.save();
};

module.exports = mongoose.model("Policy", policySchema);
