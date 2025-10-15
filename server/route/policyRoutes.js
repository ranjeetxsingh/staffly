const express = require("express");
const { getPolicies, addPolicy, updatePolicy } = require("../controllers/policyController.js");
const router = express.Router();

router.get("/", getPolicies);
router.post("/add", addPolicy);
router.patch("/:id", updatePolicy);

module.exports=router;
