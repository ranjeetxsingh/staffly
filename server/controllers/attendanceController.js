const Attendance = require("../models/Attendance.js");

exports.getAttendance = async (req, res) => {
  const records = await Attendance.find().populate("employee", "name email");
  res.json(records);
};

exports.markIn = async (req, res) => {
  const { employeeId } = req.body;
  const record = await Attendance.create({
    employee: employeeId,
    date: new Date(),
    inTime: new Date(),
  });
  res.status(201).json(record);
};

exports.markOut = async (req, res) => {
  const { employeeId } = req.body;
  const record = await Attendance.findOne({ employee: employeeId, date: new Date().toDateString() });
  if (!record) return res.status(404).json({ message: "No check-in found for today" });

  record.outTime = new Date();
  record.totalHours = (record.outTime - record.inTime) / (1000 * 60 * 60);
  await record.save();
  res.json(record);
};
