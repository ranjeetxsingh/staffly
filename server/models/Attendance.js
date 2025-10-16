const mongoose = require("mongoose");

// Sub-schema for individual check-in/check-out sessions
const sessionSchema = new mongoose.Schema({
  checkIn: { 
    type: Date, 
    required: true 
  },
  checkOut: { 
    type: Date 
  },
  duration: { 
    type: Number, // Duration in minutes
    default: 0 
  }
}, { _id: true });

// Calculate session duration before saving
sessionSchema.pre('save', function(next) {
  if (this.checkIn && this.checkOut) {
    const diffMs = this.checkOut - this.checkIn;
    this.duration = Math.round(diffMs / (1000 * 60)); // Convert to minutes
  }
  next();
});

const attendanceSchema = new mongoose.Schema(
  {
    employee: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Employee", 
      required: true 
    },
    date: { 
      type: Date, 
      required: true,
      // Store only the date part (without time)
      set: function(val) {
        const d = new Date(val);
        d.setHours(0, 0, 0, 0);
        return d;
      }
    },
    sessions: [sessionSchema], // Array of check-in/check-out sessions
    totalWorkHours: { 
      type: Number, // Total work hours in minutes
      default: 0 
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'half-day', 'work-from-home'],
      default: 'present'
    },
    notes: String
  },
  { timestamps: true }
);

// Create compound index to ensure one attendance record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

// Virtual to get total work hours in decimal format (e.g., 8.5 hours)
attendanceSchema.virtual('totalWorkHoursDecimal').get(function() {
  return (this.totalWorkHours / 60).toFixed(2);
});

// Method to add a new check-in
attendanceSchema.methods.checkIn = function() {
  // Check if there's an open session (no checkOut)
  const openSession = this.sessions.find(s => !s.checkOut);
  if (openSession) {
    throw new Error('Already checked in. Please check out first.');
  }
  
  this.sessions.push({
    checkIn: new Date()
  });
  
  return this.save();
};

// Method to add a check-out
attendanceSchema.methods.checkOut = function() {
  // Find the last session without a checkOut
  const openSession = this.sessions.find(s => !s.checkOut);
  if (!openSession) {
    throw new Error('No open check-in found. Please check in first.');
  }
  
  openSession.checkOut = new Date();
  
  // Calculate duration for this session
  const diffMs = openSession.checkOut - openSession.checkIn;
  openSession.duration = Math.round(diffMs / (1000 * 60));
  
  // Recalculate total work hours
  this.calculateTotalWorkHours();
  
  return this.save();
};

// Method to calculate total work hours from all sessions
attendanceSchema.methods.calculateTotalWorkHours = function() {
  this.totalWorkHours = this.sessions.reduce((total, session) => {
    return total + (session.duration || 0);
  }, 0);
};

// Pre-save hook to calculate total work hours
attendanceSchema.pre('save', function(next) {
  this.calculateTotalWorkHours();
  next();
});

// Set virtuals to be included in JSON
attendanceSchema.set('toJSON', { virtuals: true });
attendanceSchema.set('toObject', { virtuals: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;