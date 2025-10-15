const express = require("express");
const { getAttendance, markIn, markOut } = require("../controllers/attendanceController");
const router = express.Router();

router.get("/", getAttendance);
router.post("/in", markIn);
router.post("/out", markOut);

module.exports=router;
