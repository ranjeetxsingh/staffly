const express = require("express");
const {
  applyLeave,
  getMyLeaves,
  getLeaveBalance,
  getAllLeaves,
  getPendingLeaves,
  approveLeave,
  rejectLeave,
  cancelLeave,
  addLeaveComment,
  getLeaveStatistics
} = require("../controllers/leaveController.js");
const { protect, hrOnly } = require("../middleware/authMiddleware");
const router = express.Router();

// Employee routes
router.post("/apply", protect, applyLeave);
router.get("/my-leaves", protect, getMyLeaves);
router.get("/balance", protect, getLeaveBalance);
router.delete("/:id/cancel", protect, cancelLeave);
router.post("/:id/comment", protect, addLeaveComment);

// HR/Manager/Admin routes
router.get("/all", protect, hrOnly, getAllLeaves);
router.get("/pending", protect, hrOnly, getPendingLeaves);
router.put("/:id/approve", protect, hrOnly, approveLeave);
router.put("/:id/reject", protect, hrOnly, rejectLeave);
router.get("/statistics", protect, hrOnly, getLeaveStatistics);

module.exports = router;
