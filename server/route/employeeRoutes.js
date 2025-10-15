const express = require("express");
const { getEmployees, addEmployee, updateEmployee } = require("../controllers/employeeController.js");
const router = express.Router();

router.get("/", getEmployees);
router.post("/add", addEmployee);
router.patch("/:id", updateEmployee);

module.exports=router;
