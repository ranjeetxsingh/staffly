const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  complaintId: {
    type: String,
    unique: true,
    required: true
  },
  location: { type: String, required: true },
  issue: {
    type: String,
    required: true,
    enum: [
      "garbage",
      "foul smell",
      "discoloration",
      "dead aquatic life",
      "fecal discharge",
      "industrial discharge",
      "others",
    ],
  },
  additionalInfo: { type: String },
  images: [
    {
      url: { type: String, required: true },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved", "rejected"],
    default: "pending",
  },
  action:{
    type: String,
    default: "Pending to Inspection"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  updatedStatus: { type: String,
    default: "pending"
   },
  remarks: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

complaintSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Complaint", complaintSchema); 
