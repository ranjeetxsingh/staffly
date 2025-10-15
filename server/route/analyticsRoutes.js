const express = require("express");
const { getTimeSpent, getPeakHours } = require("../controllers/analyticsController.js");
const router = express.Router();

router.get("/time-spent", getTimeSpent);
router.get("/peak-hours", getPeakHours);

module.exports=router;
