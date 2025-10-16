const express = require("express");
const {
  checkIn,
  checkOut,
  getMyAttendance,
  getAttendanceByEmployee,
  getAllAttendance,
  getTodaySummary,
  getMonthlyReport,
  updateAttendanceStatus
} = require("../controllers/attendanceController");
const { protect, hrOnly } = require("../middleware/authMiddleware");
const router = express.Router();

// Employee routes
router.post("/check-in", protect, checkIn);
router.post("/check-out", protect, checkOut);
router.get("/my-attendance", protect, getMyAttendance);

// HR/Admin routes
router.get("/all", protect, hrOnly, getAllAttendance);
router.get("/today-summary", protect, hrOnly, getTodaySummary);
router.get("/monthly-report", protect, hrOnly, getMonthlyReport);
router.get("/employee/:employeeId", protect, hrOnly, getAttendanceByEmployee);
router.put("/:id/status", protect, hrOnly, updateAttendanceStatus);

module.exports = router;
