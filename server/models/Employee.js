const mongoose = require("mongoose");

// Sub-schema for leave balance tracking
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

const employeeSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true
    },
    role: { 
      type: String, 
      enum: ["employee", "hr", "admin", "manager"], 
      default: "employee" 
    },
    department: {
      type: String,
      trim: true
    },
    designation: {
      type: String,
      trim: true
    },
    joiningDate: {
      type: Date,
      default: Date.now
    },
    status: { 
      type: String, 
      enum: ["active", "inactive", "on-leave", "terminated"], 
      default: "active" 
    },
    
    // Manager/Reporting structure
    reportsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    },
    
    // Leave balances
    leaveBalances: [leaveBalanceSchema],
    
    // Contact information
    phone: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    
    // Employment details
    salary: {
      type: Number,
      select: false // Don't return by default
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say']
    },
    
    // Emergency contact
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    },
    
    // Link to user account (if using separate User model)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

// Index for faster queries (email and employeeId already have unique indexes)
employeeSchema.index({ department: 1, status: 1 });

// Virtual for full address
employeeSchema.virtual('fullAddress').get(function() {
  if (!this.address) return '';
  const { street, city, state, zipCode, country } = this.address;
  return [street, city, state, zipCode, country].filter(Boolean).join(', ');
});

// Method to initialize leave balances from policy
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

// Method to update leave balance
employeeSchema.methods.updateLeaveBalance = function(leaveType, daysUsed) {
  const balance = this.leaveBalances.find(lb => lb.leaveType === leaveType);
  
  if (!balance) {
    throw new Error(`Leave type ${leaveType} not found in employee balances`);
  }
  
  balance.used += daysUsed;
  balance.available = balance.total - balance.used;
  
  if (balance.available < 0) {
    throw new Error(`Insufficient ${leaveType} leave balance`);
  }
  
  return this.save();
};

// Method to get leave balance for a specific type
employeeSchema.methods.getLeaveBalance = function(leaveType) {
  return this.leaveBalances.find(lb => lb.leaveType === leaveType);
};

// Static method to find employees by department
employeeSchema.statics.findByDepartment = function(department) {
  return this.find({ department, status: 'active' });
};

// Pre-save hook to generate employee ID if not present
employeeSchema.pre('save', async function(next) {
  if (!this.employeeId && this.isNew) {
    const count = await this.constructor.countDocuments();
    this.employeeId = `EMP${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Set virtuals to be included in JSON
employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Employee", employeeSchema);
