const express = require("express");
const { getLeaves, applyLeave, approveLeave } = require("../controllers/leaveController.js");
const router = express.Router();

router.get("/", getLeaves);
router.post("/apply", applyLeave);
router.patch("/approve/:id", approveLeave);

module.exports=router;
