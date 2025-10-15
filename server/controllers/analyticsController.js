const Attendance = require("../models/Attendance.js");

exports.getTimeSpent = async (req, res) => {
  const data = await Attendance.aggregate([
    { $group: { _id: "$employee", totalHours: { $sum: "$totalHours" } } },
  ]);
  res.json(data);
};

exports.getPeakHours = async (req, res) => {
  const records = await Attendance.find({}, "inTime outTime");
  res.json(records); // You can refine analytics logic later
};
