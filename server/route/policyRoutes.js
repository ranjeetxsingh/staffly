const express = require("express");
const {
  getActiveLeavePolicy,
  getActiveAttendancePolicy,
  getPolicies,
  getPolicyById,
  addPolicy,
  updatePolicy,
  updateLeaveTypeQuota,
  deletePolicy,
  applyPolicyToEmployees,
  deactivatePolicy
} = require("../controllers/policyController.js");
const { protect, hrOnly } = require("../middleware/authMiddleware");
const router = express.Router();

// Public/Employee routes (view policies)
router.get("/leave/active", protect, getActiveLeavePolicy);
router.get("/attendance/active", protect, getActiveAttendancePolicy);

// HR/Admin routes
router.get("/", protect, hrOnly, getPolicies);
router.get("/:id", protect, hrOnly, getPolicyById);
router.post("/", protect, hrOnly, addPolicy);
router.put("/:id", protect, hrOnly, updatePolicy);
router.put("/:id/leave-type", protect, hrOnly, updateLeaveTypeQuota);
router.put("/:id/deactivate", protect, hrOnly, deactivatePolicy);
router.post("/:id/apply-to-employees", protect, hrOnly, applyPolicyToEmployees);
router.delete("/:id", protect, hrOnly, deletePolicy);

module.exports = router;
