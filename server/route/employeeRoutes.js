const express = require("express");
const {
  getEmployees,
  getEmployeeById,
  getMyProfile,
  addEmployee,
  updateEmployee,
  updateMyProfile,
  deleteEmployee,
  reinitializeLeaveBalances,
  updateLeaveBalance,
  getEmployeesByDepartment,
  getDepartments,
  getEmployeeStats
} = require("../controllers/employeeController.js");
const { protect, hrOnly } = require("../middleware/authMiddleware");
const router = express.Router();

// Employee routes
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

// HR/Admin routes
router.get("/", protect, hrOnly, getEmployees);
router.post("/", protect, hrOnly, addEmployee);
router.get("/stats/overview", protect, hrOnly, getEmployeeStats);
router.get("/departments/list", protect, hrOnly, getDepartments);
router.get("/department/:department", protect, hrOnly, getEmployeesByDepartment);
router.get("/:id", protect, hrOnly, getEmployeeById);
router.put("/:id", protect, hrOnly, updateEmployee);
router.delete("/:id", protect, hrOnly, deleteEmployee);
router.post("/:id/initialize-leaves", protect, hrOnly, reinitializeLeaveBalances);
router.put("/:id/leave-balance", protect, hrOnly, updateLeaveBalance);

module.exports = router;
