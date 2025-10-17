const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    employee: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Employee", 
      required: true 
    },
    leaveType: {
      type: String,
      required: true,
      enum: ['sick', 'casual', 'Casual', 'annual', 'Annual', 'maternity', 'Maternity', 'paternity', 'Paternity', 'unpaid', 'Unpaid', 'compensatory', 'Compensatory', 'Sick']
    },
    fromDate: {
      type: Date,
      required: true
    },
    toDate: {
      type: Date,
      required: true
    },
    numberOfDays: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected", "cancelled"], 
      default: "pending" 
    },
    appliedOn: {
      type: Date,
      default: Date.now
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    },
    approvedOn: Date,
    rejectionReason: String,
    attachments: [{
      filename: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    comments: [{
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
      },
      comment: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

// Validate that toDate is after fromDate
leaveSchema.pre('validate', function(next) {
  if (this.toDate < this.fromDate) {
    next(new Error('To date must be after from date'));
  }
  next();
});

// Calculate number of days automatically
leaveSchema.pre('save', function(next) {
  if (this.fromDate && this.toDate) {
    const diffTime = Math.abs(this.toDate - this.fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end date
    this.numberOfDays = diffDays;
  }
  next();
});

// Method to approve leave
leaveSchema.methods.approve = function(approverEmployeeId) {
  this.status = 'approved';
  this.approvedBy = approverEmployeeId;
  this.approvedOn = new Date();
  return this.save();
};

// Method to reject leave
leaveSchema.methods.reject = function(approverEmployeeId, reason) {
  this.status = 'rejected';
  this.approvedBy = approverEmployeeId;
  this.approvedOn = new Date();
  this.rejectionReason = reason;
  return this.save();
};

// Method to cancel leave
leaveSchema.methods.cancel = function() {
  if (this.status === 'approved') {
    this.status = 'cancelled';
    return this.save();
  }
  throw new Error('Only approved leaves can be cancelled');
};

// Index for faster queries
leaveSchema.index({ employee: 1, status: 1 });
leaveSchema.index({ fromDate: 1, toDate: 1 });

module.exports = mongoose.model("Leave", leaveSchema);
