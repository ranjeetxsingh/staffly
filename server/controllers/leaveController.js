const Leave = require("../models/Leave.js");

exports.getLeaves = async (req, res) => {
  const leaves = await Leave.find().populate("employee", "name email");
  res.json(leaves);
};

exports.applyLeave = async (req, res) => {
  const { employeeId, fromDate, toDate, reason } = req.body;
  const leave = await Leave.create({ employee: employeeId, fromDate, toDate, reason });
  res.status(201).json(leave);
};

exports.approveLeave = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
  res.json(leave);
};
